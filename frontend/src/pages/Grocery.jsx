import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const DEFAULT_MEMBERS = [
  { role: "You", name: "", age: "", gender: "", medicalConditions: "", included: true },
  { role: "Mother", name: "", age: "", gender: "Female", medicalConditions: "", included: true },
  { role: "Father", name: "", age: "", gender: "Male", medicalConditions: "", included: true },
  { role: "Son", name: "", age: "", gender: "Male", medicalConditions: "", included: false },
  { role: "Daughter", name: "", age: "", gender: "Female", medicalConditions: "", included: false },
  { role: "Grandfather", name: "", age: "", gender: "Male", medicalConditions: "", included: true },
  { role: "Grandmother", name: "", age: "", gender: "Female", medicalConditions: "", included: true },
];

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
}

function Grocery() {
  const [location, setLocation] = useState({
    country: "India",
    state: "",
    city: "",
    pinCode: "",
  });
  const [budget, setBudget] = useState("");
  const [foodPreference, setFoodPreference] = useState("Vegetarian");
  const [members, setMembers] = useState(DEFAULT_MEMBERS);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedLocation = readJson("location");
    const personalInfo = readJson("personalInfo");
    const healthDetails = readJson("healthDetails");
    const lifestyle = readJson("lifestyle");
    const savedGrocery = readJson("groceryPlanner");

    setLocation({
      country: savedLocation.country || savedGrocery.country || "India",
      state: savedLocation.state || savedGrocery.state || "",
      city: savedLocation.city || savedGrocery.city || "",
      pinCode: savedLocation.pinCode || savedGrocery.pinCode || "",
    });

    setBudget(savedGrocery.budget || "");
    setFoodPreference(
      savedGrocery.foodPreference || lifestyle.foodPreference || "Vegetarian"
    );

    if (savedGrocery.members?.length) {
      setMembers(savedGrocery.members);
      return;
    }

    setMembers((current) =>
      current.map((member) => {
        if (member.role !== "You") return member;

        return {
          ...member,
          name: personalInfo.fullName || "",
          age: personalInfo.age || "",
          gender: personalInfo.gender || "",
          medicalConditions: healthDetails.medicalCondition || "",
          included: true,
        };
      })
    );
  }, []);

  const includedCount = useMemo(
    () => members.filter((member) => member.included).length,
    [members]
  );

  const handleLocationChange = (e) => {
    setLocation({
      ...location,
      [e.target.name]: e.target.value,
    });
  };

  const updateMember = (index, field, value) => {
    setMembers((current) =>
      current.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPlan(null);

    const includedMembers = members.filter((member) => member.included);

    if (!includedMembers.length) {
      setError("Include at least one family member.");
      return;
    }

    const payload = {
      ...location,
      budget: Number(budget),
      foodPreference,
      members: includedMembers.map((member) => ({
        ...member,
        age: member.age === "" ? null : Number(member.age),
      })),
    };

    localStorage.setItem(
      "groceryPlanner",
      JSON.stringify({ ...location, budget, foodPreference, members })
    );

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/grocery/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Could not generate grocery plan.");
      }

      setPlan(data);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to Meddy backend. Please make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/dashboard" className="text-indigo-600 font-semibold">
            ← Dashboard
          </Link>
          <Link to="/nutrition" className="text-indigo-600 font-semibold">
            Nutrition Planner →
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-center text-indigo-600">
            🛒 Grocery Planner
          </h1>
          <p className="text-center text-gray-500 mt-2">
            Family grocery list by age, medical conditions, city, and monthly budget.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={location.country}
                onChange={handleLocationChange}
                className="w-full border rounded-xl p-3"
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={location.state}
                onChange={handleLocationChange}
                className="w-full border rounded-xl p-3"
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={location.city}
                onChange={handleLocationChange}
                className="w-full border rounded-xl p-3"
                required
              />
              <input
                type="text"
                name="pinCode"
                placeholder="PIN Code (Optional)"
                value={location.pinCode}
                onChange={handleLocationChange}
                className="w-full border rounded-xl p-3"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="number"
                min="1"
                placeholder="Monthly Grocery Budget (₹)"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full border rounded-xl p-3"
                required
              />
              <select
                value={foodPreference}
                onChange={(e) => setFoodPreference(e.target.value)}
                className="w-full border rounded-xl p-3"
              >
                <option>Vegetarian</option>
                <option>Non-Vegetarian</option>
                <option>Vegan</option>
                <option>Eggetarian</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold">Family List</h2>
                <p className="text-sm text-gray-500">
                  {includedCount} member{includedCount === 1 ? "" : "s"} included
                </p>
              </div>

              <div className="space-y-4">
                {members.map((member, index) => (
                  <div
                    key={member.role}
                    className="border rounded-2xl p-4 bg-gray-50"
                  >
                    <label className="flex items-center gap-3 font-semibold">
                      <input
                        type="checkbox"
                        checked={member.included}
                        onChange={(e) =>
                          updateMember(index, "included", e.target.checked)
                        }
                      />
                      {member.role}
                    </label>

                    {member.included && (
                      <div className="grid md:grid-cols-3 gap-3 mt-4">
                        <input
                          type="text"
                          placeholder="Name (optional)"
                          value={member.name}
                          onChange={(e) =>
                            updateMember(index, "name", e.target.value)
                          }
                          className="w-full border rounded-xl p-3 bg-white"
                        />
                        <input
                          type="number"
                          min="1"
                          placeholder="Age"
                          value={member.age}
                          onChange={(e) =>
                            updateMember(index, "age", e.target.value)
                          }
                          className="w-full border rounded-xl p-3 bg-white"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Medical conditions"
                          value={member.medicalConditions}
                          onChange={(e) =>
                            updateMember(
                              index,
                              "medicalConditions",
                              e.target.value
                            )
                          }
                          className="w-full border rounded-xl p-3 bg-white"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-red-600 bg-red-50 rounded-xl p-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 rounded-xl text-lg font-semibold"
            >
              {loading ? "Creating grocery plan..." : "Generate Grocery Plan"}
            </button>
          </form>
        </div>

        {plan && (
          <div className="mt-8 bg-white rounded-3xl shadow-lg p-8 space-y-6">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-indigo-600">
                  Your Family Grocery Plan
                </h2>
                <p className="text-gray-600 mt-2">{plan.summary}</p>
              </div>
              <div className="bg-indigo-50 rounded-2xl p-4 min-w-[220px]">
                <p className="text-sm text-gray-500">Estimated total</p>
                <p className="text-2xl font-bold">₹{plan.estimatedTotal}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Budget ₹{plan.budget || budget}
                </p>
                <p
                  className={`text-sm font-semibold mt-1 ${
                    plan.withinBudget ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {plan.withinBudget ? "Within budget" : "Over budget"}
                </p>
              </div>
            </div>

            {plan.memberNotes?.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3">Member focus</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {plan.memberNotes.map((note, index) => (
                    <div key={index} className="border rounded-2xl p-4">
                      <p className="font-semibold">
                        {note.role}
                        {note.name ? ` • ${note.name}` : ""}
                        {note.age ? ` • ${note.age} yrs` : ""}
                      </p>
                      <p className="text-gray-600 mt-1">{note.focus}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {plan.categories?.map((category) => (
              <div key={category.name}>
                <h3 className="text-lg font-bold mb-3">{category.name}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-sm text-gray-500">
                        <th className="pb-2">Item</th>
                        <th className="pb-2">Qty</th>
                        <th className="pb-2">Est. price</th>
                        <th className="pb-2">For</th>
                        <th className="pb-2">Why</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.items?.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-2 font-medium">{item.name}</td>
                          <td className="py-2">{item.qty}</td>
                          <td className="py-2">₹{item.estPrice}</td>
                          <td className="py-2">{item.forMembers}</td>
                          <td className="py-2 text-gray-600">{item.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {plan.weeklyTips?.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-2">Tips</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  {plan.weeklyTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {plan.disclaimer && (
              <p className="text-sm text-gray-500">{plan.disclaimer}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Grocery;
