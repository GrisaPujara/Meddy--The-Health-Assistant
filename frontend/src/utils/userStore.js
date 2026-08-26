const ACCOUNTS_KEY = "meddyAccounts";
const SESSION_KEY = "meddySessionEmail";

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function emptyUser() {
  return {
    email: "",
    password: "",
    fullName: "",
    personalInfo: {},
    location: {},
    healthDetails: {},
    lifestyle: {},
    groceryPlanner: {},
    nutritionPlanner: {},
    isPremium: false,
  };
}

function syncLegacyKeys(user) {
  localStorage.setItem("personalInfo", JSON.stringify(user.personalInfo || {}));
  localStorage.setItem("location", JSON.stringify(user.location || {}));
  localStorage.setItem("healthDetails", JSON.stringify(user.healthDetails || {}));
  localStorage.setItem("lifestyle", JSON.stringify(user.lifestyle || {}));
  localStorage.setItem("groceryPlanner", JSON.stringify(user.groceryPlanner || {}));
  localStorage.setItem("nutritionPlanner", JSON.stringify(user.nutritionPlanner || {}));
}

function migrateLegacy() {
  const existing = readJson(ACCOUNTS_KEY, []);
  if (existing.length) return;

  const register = readJson("register", null);
  const personalInfo = readJson("personalInfo", null);
  if (!register && !personalInfo) return;

  const email = (register?.email || "legacy@meddy.local").trim().toLowerCase();
  const user = {
    email,
    password: register?.password || "",
    fullName: register?.fullName || personalInfo?.fullName || "",
    personalInfo: personalInfo || {},
    location: readJson("location", {}),
    healthDetails: readJson("healthDetails", {}),
    lifestyle: readJson("lifestyle", {}),
    groceryPlanner: readJson("groceryPlanner", {}),
    nutritionPlanner: readJson("nutritionPlanner", {}),
  };

  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([user]));
  if (!localStorage.getItem(SESSION_KEY)) {
    localStorage.setItem(SESSION_KEY, email);
  }
}

function getAccounts() {
  migrateLegacy();
  return readJson(ACCOUNTS_KEY, []);
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function getSessionEmail() {
  migrateLegacy();
  return localStorage.getItem(SESSION_KEY) || "";
}

export function isLoggedIn() {
  const email = getSessionEmail();
  if (!email) return false;
  return getAccounts().some((account) => account.email === email);
}

export function getCurrentUser() {
  const email = getSessionEmail();
  if (!email) return emptyUser();
  return getAccounts().find((account) => account.email === email) || emptyUser();
}

export function loadProfileData() {
  const user = getCurrentUser();
  return {
    fullName: user.fullName || user.personalInfo?.fullName || "",
    email: user.email || "",
    personalInfo: user.personalInfo || {},
    location: user.location || {},
    healthDetails: user.healthDetails || {},
    lifestyle: user.lifestyle || {},
    groceryPlanner: user.groceryPlanner || {},
    nutritionPlanner: user.nutritionPlanner || {},
    isPremium: Boolean(user.isPremium),
  };
}

export function updateCurrentUser(patch) {
  const email = getSessionEmail();
  if (!email) return;

  const accounts = getAccounts();
  const index = accounts.findIndex((account) => account.email === email);
  if (index === -1) return;

  const nextUser = {
    ...accounts[index],
    ...patch,
  };

  accounts[index] = nextUser;
  saveAccounts(accounts);
  syncLegacyKeys(nextUser);
}

export function registerAccount({ fullName, email, password }) {
  const normalized = email.trim().toLowerCase();
  const accounts = getAccounts();

  if (accounts.some((account) => account.email === normalized)) {
    throw new Error("An account with this email already exists. Please login.");
  }

  const user = {
    email: normalized,
    password,
    fullName,
    personalInfo: { fullName },
    location: {},
    healthDetails: {},
    lifestyle: {},
    groceryPlanner: {},
    nutritionPlanner: {},
    isPremium: false,
  };

  accounts.push(user);
  saveAccounts(accounts);
  localStorage.setItem(SESSION_KEY, normalized);
  localStorage.setItem("register", JSON.stringify({ fullName, email: normalized }));
  syncLegacyKeys(user);
  return user;
}

export function loginAccount(email, password) {
  const normalized = email.trim().toLowerCase();
  const accounts = getAccounts();
  const user = accounts.find((account) => account.email === normalized);

  if (!user) {
    throw new Error("No account found for this email. Create an account first.");
  }

  if (user.password !== password) {
    throw new Error("Incorrect password.");
  }

  localStorage.setItem(SESSION_KEY, normalized);
  syncLegacyKeys(user);
  return user;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function hasCompletedProfile(user = getCurrentUser()) {
  return Boolean(
    user?.personalInfo?.age &&
      user?.healthDetails?.height &&
      user?.lifestyle?.foodPreference
  );
}
