import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser, updateCurrentUser } from "../utils/userStore";
import { saveDetectedLocation } from "../utils/locationAccess";

function Location() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get("edit") === "1";
  const nextQuery = isEdit ? "?edit=1" : "";

  const [location, setLocation] = useState({
    country: "",
    state: "",
    city: "",
    pinCode: "",
  });

  const [status, setStatus] = useState("");

  useEffect(() => {
    const saved = getCurrentUser().location || {};
    setLocation({
      country: saved.country || "",
      state: saved.state || "",
      city: saved.city || "",
      pinCode: saved.pinCode || "",
      lat: saved.lat || "",
      lng: saved.lng || "",
      source: saved.source || "",
    });
  }, []);

  const handleChange = (e) => {
    setLocation({
      ...location,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save location data
    updateCurrentUser({ location });

    // Go to next page
    navigate(`/health-details${nextQuery}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center text-indigo-600">
          🌿 Meddy
        </h1>

        <h2 className="text-3xl font-bold text-center mt-6">
          Step 2 • Location
        </h2>

        <p className="text-center text-gray-500 mt-2">
          {isEdit
            ? "Edit city and state. Saved values stay filled in."
            : "Help Meddy personalize your grocery and nutrition recommendations."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          <button
            type="button"
            onClick={async () => {
              setStatus("Detecting your location...");
              try {
                const detected = await saveDetectedLocation();
                setLocation((current) => ({ ...current, ...detected }));
                setStatus("Location filled from GPS. You can still edit it.");
              } catch (err) {
                setStatus(
                  err.message ||
                    "Could not access location. Allow location in the browser, or type it below."
                );
              }
            }}
            className="w-full bg-indigo-50 text-indigo-700 py-3 rounded-xl font-semibold"
          >
            Use my current location
          </button>

          {status && <p className="text-sm text-gray-600">{status}</p>}

          <input
            type="text"
            name="country"
            placeholder="Country"
            value={location.country}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            required
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={location.state}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            required
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={location.city}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            required
          />

          <input
            type="text"
            name="pinCode"
            placeholder="PIN Code (Optional)"
            value={location.pinCode}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                updateCurrentUser({ location });
                navigate(`/personal-info${nextQuery}`);
              }}
              className="w-1/2 bg-gray-300 hover:bg-gray-400 py-3 rounded-xl font-semibold"
            >
              ← Back
            </button>

            <button
              type="submit"
              className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
            >
              Continue →
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Location;