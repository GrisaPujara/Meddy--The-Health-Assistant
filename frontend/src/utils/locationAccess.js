import { getCurrentUser, isLoggedIn, updateCurrentUser } from "./userStore";

export async function detectDeviceLocation() {
  if (!navigator.geolocation) {
    throw new Error("This browser does not support location access.");
  }

  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000,
    });
  });

  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
  );

  if (!response.ok) {
    throw new Error("Could not read city from GPS.");
  }

  const geo = await response.json();

  return {
    lat,
    lng,
    country: geo.countryName || "",
    state: geo.principalSubdivision || "",
    city: geo.city || geo.locality || "",
    pinCode: geo.postcode || "",
    source: "gps",
  };
}

export async function saveDetectedLocation() {
  if (!isLoggedIn()) return null;

  const detected = await detectDeviceLocation();
  const current = getCurrentUser().location || {};

  const location = {
    ...current,
    ...detected,
    country: detected.country || current.country || "",
    state: detected.state || current.state || "",
    city: detected.city || current.city || "",
    pinCode: detected.pinCode || current.pinCode || "",
  };

  updateCurrentUser({ location });
  return location;
}

export function requestLocationAfterLogin() {
  if (!isLoggedIn()) return Promise.resolve(null);
  if (sessionStorage.getItem("meddyLocationAsked") === "1") {
    return Promise.resolve(null);
  }
  sessionStorage.setItem("meddyLocationAsked", "1");
  return saveDetectedLocation().catch(() => null);
}
