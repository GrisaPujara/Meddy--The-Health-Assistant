import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, loadProfileData, updateCurrentUser } from "../utils/userStore";

function mapGoal(value) {
  if (value === "Weight Loss") return "Weight Loss";
  if (value === "Weight Gain" || value === "Muscle Gain") return "Weight Gain";
  return "Weight Stability";
}

function Nutrition() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    country: "India",
    state: "",
    city: "",
    pinCode: "",
    budget: "",
    foodPreference: "Vegetarian",
    goal: "Weight Stability",
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",
    medicalConditions: "",
    allergies: "",
    familySize: 1,
    planMode: "solo",
  });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    const profile = loadProfileData();
    const location = profile.location || {};
    const personalInfo = profile.personalInfo || {};
    const healthDetails = profile.healthDetails || {};
    const lifestyle = profile.lifestyle || {};
    const grocery = profile.groceryPlanner || {};
    const saved = profile.nutritionPlanner || {};

    setForm({
      country: location.country || saved.country || "India",
      state: location.state || saved.state || "",
      city: location.city || saved.city || "",
      pinCode: location.pinCode || saved.pinCode || "",
      budget: saved.budget || grocery.budget || "",
      foodPreference:
        lifestyle.foodPreference || saved.foodPreference || "Vegetarian",
      goal: mapGoal(lifestyle.fitnessGoal) || saved.goal || "Weight Stability",
      age: personalInfo.age || saved.age || "",
      gender: personalInfo.gender || saved.gender || "",
      height: healthDetails.height || saved.height || "",
      weight: healthDetails.weight || saved.weight || "",
      activityLevel: lifestyle.activityLevel || saved.activityLevel || "",
      medicalConditions:
        healthDetails.medicalCondition || saved.medicalConditions || "",
      allergies: healthDetails.allergies || saved.allergies || "",
      familySize:
        saved.planMode === "family"
          ? grocery.members?.filter((member) => member.included).length ||
            lifestyle.familyMembers ||
            saved.familySize ||
            1
          : 1,
      planMode: saved.planMode || "solo",
    });
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPlan(null);

    const isSolo = form.planMode === "solo";
    const payload = {
      ...form,
      budget: Number(form.budget),
      age: form.age === "" ? null : Number(form.age),
      height: form.height === "" ? null : Number(form.height),
      weight: form.weight === "" ? null : Number(form.weight),
      familySize: isSolo ? 1 : Number(form.familySize) || 1,
    };

    updateCurrentUser({ nutritionPlanner: form });
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/nutrition/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Could not generate nutrition plan.");
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
          <Link to="/grocery" className="text-indigo-600 font-semibold">
            Grocery Planner →
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-center text-indigo-600">
            🥗 Nutrition Planner
          </h1>
          <p className="text-center text-gray-500 mt-2">
            Diet plans for just you, or the household, kept under budget.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setForm({ ...form, planMode: "solo", familySize: 1 })}
                className={`rounded-xl p-4 border-2 font-semibold ${
                  form.planMode === "solo"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-200"
                }`}
              >
                Just me
                <p className="text-sm font-normal text-gray-500 mt-1">
                  Calories and meals for the logged-in person only.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, planMode: "family" })}
                className={`rounded-xl p-4 border-2 font-semibold ${
                  form.planMode === "family"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-200"
                }`}
              >
                Whole family
                <p className="text-sm font-normal text-gray-500 mt-1">
                  Scale meals for the household size you enter.
                </p>
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
                required
              />
              <input
                type="number"
                name="budget"
                min="1"
                placeholder="Monthly Food Budget (₹)"
                value={form.budget}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
                required
              />
              <select
                name="goal"
                value={form.goal}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              >
                <option value="Weight Loss">Weight Loss</option>
                <option value="Weight Gain">Weight Gain</option>
                <option value="Weight Stability">Weight Stability</option>
              </select>
              <select
                name="foodPreference"
                value={form.foodPreference}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              >
                <option>Vegetarian</option>
                <option>Non-Vegetarian</option>
                <option>Vegan</option>
                <option>Eggetarian</option>
              </select>
              <select
                name="activityLevel"
                value={form.activityLevel}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              >
                <option value="">Activity level</option>
                <option value="Sedentary">Sedentary</option>
                <option value="Lightly Active">Lightly Active</option>
                <option value="Moderately Active">Moderately Active</option>
                <option value="Very Active">Very Active</option>
              </select>
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={form.age}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
              {form.planMode === "family" && (
              <input
                type="number"
                name="familySize"
                min="1"
                placeholder="People eating this plan"
                value={form.familySize}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
              )}
              <input
                type="number"
                name="height"
                placeholder="Height (cm)"
                value={form.height}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
              <input
                type="number"
                name="weight"
                placeholder="Weight (kg)"
                value={form.weight}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
            </div>

            <textarea
              name="medicalConditions"
              placeholder="Medical conditions"
              value={form.medicalConditions}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
              rows="3"
            />
            <textarea
              name="allergies"
              placeholder="Allergies"
              value={form.allergies}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
              rows="2"
            />

            {error && (
              <p className="text-red-600 bg-red-50 rounded-xl p-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 rounded-xl text-lg font-semibold"
            >
              {loading ? "Creating diet plan..." : "Generate Nutrition Plan"}
            </button>
          </form>
        </div>

        {plan && (
          <div className="mt-8 bg-white rounded-3xl shadow-lg p-8 space-y-6">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-indigo-600">
                  {plan.goal} plan
                </h2>
                <p className="text-gray-600 mt-2">{plan.summary}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {plan.city}
                  {plan.state ? `, ${plan.state}` : ""} • {plan.dietType} •{" "}
                  {plan.dailyCalories} kcal/day
                </p>
              </div>
              <div className="bg-indigo-50 rounded-2xl p-4 min-w-[220px]">
                <p className="text-sm text-gray-500">Monthly food cost</p>
                <p className="text-2xl font-bold">₹{plan.estimatedMonthlyCost}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Weekly ₹{plan.estimatedWeeklyGroceryCost} • Budget ₹
                  {plan.budget || form.budget}
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

            {plan.days?.map((day) => (
              <div key={day.day} className="border rounded-2xl p-4">
                <div className="flex justify-between gap-3">
                  <h3 className="font-bold">{day.day}</h3>
                  <p className="text-sm text-gray-500">
                    {day.totalCalories} kcal • ₹{day.estCost}
                  </p>
                </div>
                <div className="mt-3 space-y-2">
                  {day.meals?.map((meal, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-3">
                      <p className="font-semibold">{meal.name}</p>
                      <p className="text-gray-700">{meal.items}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {meal.calories} kcal • ₹{meal.estCost}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {plan.shoppingFocus?.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-2">Shopping focus</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  {plan.shoppingFocus.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {plan.tips?.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-2">Tips</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  {plan.tips.map((tip, index) => (
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

export default Nutrition;
