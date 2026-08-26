const API = "http://127.0.0.1:8000";

async function parse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data.detail;
    throw new Error(
      typeof detail === "string" ? detail : "Family health request failed."
    );
  }
  return data;
}

export function fetchFamily(email) {
  return fetch(`${API}/family?email=${encodeURIComponent(email)}`).then(parse);
}

export function createFamily(email, displayName, familyName) {
  return fetch(`${API}/family`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, displayName, familyName }),
  }).then(parse);
}

export function joinFamily(email, displayName, inviteCode) {
  return fetch(`${API}/family/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, displayName, inviteCode }),
  }).then(parse);
}

export function leaveFamily(email) {
  return fetch(`${API}/family/leave`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, displayName: "" }),
  }).then(parse);
}

export function addFamilyPerson(email, name, role) {
  return fetch(`${API}/family/people`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, role }),
  }).then(parse);
}

export function createReminder(payload) {
  return fetch(`${API}/family/reminders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(parse);
}

export function toggleReminder(email, reminderId, enabled) {
  return fetch(`${API}/family/reminders/${reminderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, enabled }),
  }).then(parse);
}

export function deleteReminder(email, reminderId) {
  return fetch(
    `${API}/family/reminders/${reminderId}?email=${encodeURIComponent(email)}`,
    { method: "DELETE" }
  ).then(parse);
}
