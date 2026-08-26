import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  addFamilyPerson,
  createFamily,
  createReminder,
  deleteReminder,
  fetchFamily,
  joinFamily,
  leaveFamily,
  toggleReminder,
} from "../utils/familyApi";
import { getCurrentUser, isLoggedIn, loadProfileData } from "../utils/userStore";

const TYPES = [
  { id: "medicine", label: "Medicine" },
  { id: "checkup", label: "Health checkup" },
  { id: "yearly", label: "Yearly checkup" },
];

const ROLES = [
  "You",
  "Mother",
  "Father",
  "Son",
  "Daughter",
  "Grandfather",
  "Grandmother",
  "Family",
];

function FamilyHealth() {
  const navigate = useNavigate();
  const [family, setFamily] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [familyName, setFamilyName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [person, setPerson] = useState({ name: "", role: "Mother" });
  const [reminder, setReminder] = useState({
    type: "medicine",
    title: "",
    notes: "",
    personId: "",
    time: "09:00",
    date: "",
    repeat: "daily",
  });

  const user = getCurrentUser();
  const displayName =
    user.fullName || user.personalInfo?.fullName || user.email.split("@")[0] || "Me";

  const load = async () => {
    if (!user.email) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchFamily(user.email);
      setFamily(data.family);
      if (data.family?.people?.[0]?.id) {
        setReminder((current) => ({
          ...current,
          personId: current.personId || data.family.people[0].id,
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    load();
  }, [navigate]);

  const run = async (action) => {
    setError("");
    try {
      const data = await action();
      setFamily(data.family);
      if (data.family?.people?.[0]?.id) {
        setReminder((current) => ({
          ...current,
          personId: current.personId || data.family.people[0].id,
        }));
      }
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    run(() => createFamily(user.email, displayName, familyName));
  };

  const handleJoin = (e) => {
    e.preventDefault();
    run(() => joinFamily(user.email, displayName, inviteCode));
  };

  const handleAddPerson = (e) => {
    e.preventDefault();
    if (!person.name.trim()) return;
    run(() => addFamilyPerson(user.email, person.name, person.role)).then(() => {
      setPerson({ name: "", role: "Mother" });
    });
  };

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!reminder.title.trim() || !reminder.personId) {
      setError("Choose a family member and enter a reminder title.");
      return;
    }
    run(() =>
      createReminder({
        email: user.email,
        ...reminder,
        repeat:
          reminder.type === "medicine"
            ? "daily"
            : reminder.type === "yearly"
              ? "yearly"
              : "once",
      })
    ).then(() => {
      setReminder((current) => ({ ...current, title: "", notes: "" }));
    });
  };

  const importGroceryPeople = () => {
    const groceryMembers = loadProfileData().groceryPlanner?.members || [];
    groceryMembers
      .filter((member) => member.role !== "You")
      .forEach((member) => {
        const already = family?.people?.some(
          (item) => item.name.toLowerCase() === (member.name || member.role).toLowerCase()
        );
        if (!already) {
          addFamilyPerson(user.email, member.name || member.role, member.role).then(
            (data) => setFamily(data.family)
          );
        }
      });
  };

  if (loading) {
    return <p className="p-10 text-center text-gray-500">Loading family health...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="text-indigo-600 font-semibold">
            ← Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-indigo-600 text-center">
            👨‍👩‍👧 Family Health
          </h1>
          <p className="text-center text-gray-500 mt-2">
            Medicine, checkup, and yearly reminders for each family member.
          </p>
        </div>

        {error && (
          <p className="text-red-600 bg-red-50 rounded-xl p-3">{error}</p>
        )}

        {!family && (
          <div className="grid md:grid-cols-2 gap-6">
            <form onSubmit={handleCreate} className="bg-white rounded-3xl shadow-lg p-8 space-y-4">
              <h2 className="text-xl font-bold">Start a family plan</h2>
              <input
                type="text"
                placeholder="Family name (optional)"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full border rounded-xl p-3"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold"
              >
                Create family plan
              </button>
            </form>

            <form onSubmit={handleJoin} className="bg-white rounded-3xl shadow-lg p-8 space-y-4">
              <h2 className="text-xl font-bold">Join with invite code</h2>
              <input
                type="text"
                placeholder="MEDDY-XXXXXX"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full border rounded-xl p-3"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold"
              >
                Join family
              </button>
            </form>
          </div>
        )}

        {family && (
          <>
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{family.name}</h2>
                  <p className="text-gray-500 mt-1">
                    Share this code with family members who have Meddy:
                  </p>
                  <p className="text-2xl font-bold text-indigo-600 mt-2">
                    {family.inviteCode}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => run(() => leaveFamily(user.email))}
                  className="text-red-600 font-semibold"
                >
                  Leave family
                </button>
              </div>

              <h3 className="font-bold mt-6 mb-3">App members</h3>
              <div className="flex flex-wrap gap-2">
                {family.members.map((member) => (
                  <span
                    key={member.email}
                    className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-xl text-sm"
                  >
                    {member.displayName || member.email}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8">
              <div className="flex justify-between gap-4 items-center mb-4">
                <h2 className="text-xl font-bold">People to remind</h2>
                <button
                  type="button"
                  onClick={importGroceryPeople}
                  className="text-indigo-600 font-semibold"
                >
                  Import from grocery list
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-3 mb-4">
                {family.people.map((item) => (
                  <div key={item.id} className="border rounded-xl p-3">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.role}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddPerson} className="grid md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={person.name}
                  onChange={(e) => setPerson({ ...person, name: e.target.value })}
                  className="border rounded-xl p-3"
                  required
                />
                <select
                  value={person.role}
                  onChange={(e) => setPerson({ ...person, role: e.target.value })}
                  className="border rounded-xl p-3"
                >
                  {ROLES.map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white rounded-xl font-semibold"
                >
                  Add person
                </button>
              </form>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h2 className="text-xl font-bold mb-4">Add a reminder</h2>
              <form onSubmit={handleAddReminder} className="space-y-4">
                <div className="grid md:grid-cols-3 gap-3">
                  <select
                    value={reminder.type}
                    onChange={(e) =>
                      setReminder({
                        ...reminder,
                        type: e.target.value,
                        repeat:
                          e.target.value === "medicine"
                            ? "daily"
                            : e.target.value === "yearly"
                              ? "yearly"
                              : "once",
                      })
                    }
                    className="border rounded-xl p-3"
                  >
                    {TYPES.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={reminder.personId}
                    onChange={(e) =>
                      setReminder({ ...reminder, personId: e.target.value })
                    }
                    className="border rounded-xl p-3"
                    required
                  >
                    <option value="">For whom?</option>
                    {family.people.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.role})
                      </option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={reminder.time}
                    onChange={(e) =>
                      setReminder({ ...reminder, time: e.target.value })
                    }
                    className="border rounded-xl p-3"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Title (e.g. Blood pressure tablet)"
                  value={reminder.title}
                  onChange={(e) =>
                    setReminder({ ...reminder, title: e.target.value })
                  }
                  className="w-full border rounded-xl p-3"
                  required
                />
                {(reminder.type === "checkup" || reminder.type === "yearly") && (
                  <input
                    type="date"
                    value={reminder.date}
                    onChange={(e) =>
                      setReminder({ ...reminder, date: e.target.value })
                    }
                    className="w-full border rounded-xl p-3"
                    required
                  />
                )}
                <textarea
                  placeholder="Notes (optional)"
                  value={reminder.notes}
                  onChange={(e) =>
                    setReminder({ ...reminder, notes: e.target.value })
                  }
                  className="w-full border rounded-xl p-3"
                  rows="2"
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold"
                >
                  Save reminder
                </button>
              </form>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h2 className="text-xl font-bold mb-4">Family reminders</h2>
              {!family.reminders.length && (
                <p className="text-gray-500">No reminders yet.</p>
              )}
              <div className="space-y-3">
                {family.reminders.map((item) => {
                  const who =
                    family.people.find((person) => person.id === item.personId)
                      ?.name || "Someone";
                  return (
                    <div
                      key={item.id}
                      className="border rounded-2xl p-4 flex flex-wrap justify-between gap-3"
                    >
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-gray-500">
                          {item.type} • {who} • {item.time}
                          {item.date ? ` • ${item.date}` : ""} • {item.repeat}
                        </p>
                      </div>
                      <div className="flex gap-3 items-center">
                        <button
                          type="button"
                          onClick={() =>
                            run(() =>
                              toggleReminder(user.email, item.id, !item.enabled)
                            )
                          }
                          className="text-indigo-600 font-semibold"
                        >
                          {item.enabled ? "On" : "Off"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            run(() => deleteReminder(user.email, item.id))
                          }
                          className="text-red-600 font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FamilyHealth;
