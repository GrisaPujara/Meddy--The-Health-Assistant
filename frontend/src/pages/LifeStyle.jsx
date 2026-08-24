import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Lifestyle() {
  const navigate = useNavigate();

  const [lifestyle, setLifestyle] = useState({
    foodPreference: "",
    activityLevel: "",
    fitnessGoal: "",
    familyMembers: "",
  });

  const handleChange = (e) => {
    setLifestyle({
      ...lifestyle,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save Lifestyle Data
    localStorage.setItem("lifestyle", JSON.stringify(lifestyle));

    // Finish setup
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-2xl">

        <h1 className="text-4xl font-bold text-center text-indigo-600">
          🌿 Meddy
        </h1>

        <h2 className="text-3xl font-bold text-center mt-6">
          Step 4 • Lifestyle
        </h2>

        <p className="text-center text-gray-500 mt-2">
          Tell Meddy about your lifestyle.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          <select
            name="foodPreference"
            value={lifestyle.foodPreference}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            required
          >
            <option value="">Select Food Preference</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Eggetarian">Eggetarian</option>
          </select>

          <select
            name="activityLevel"
            value={lifestyle.activityLevel}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            required
          >
            <option value="">Select Activity Level</option>
            <option value="Sedentary">Sedentary</option>
            <option value="Lightly Active">Lightly Active</option>
            <option value="Moderately Active">Moderately Active</option>
            <option value="Very Active">Very Active</option>
          </select>

          <select
            name="fitnessGoal"
            value={lifestyle.fitnessGoal}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            required
          >
            <option value="">Select Fitness Goal</option>
            <option value="Weight Loss">Weight Loss</option>
            <option value="Weight Gain">Weight Gain</option>
            <option value="Maintain Weight">Maintain Weight</option>
            <option value="Muscle Gain">Muscle Gain</option>
            <option value="General Wellness">General Wellness</option>
          </select>

          <input
            type="number"
            name="familyMembers"
            placeholder="Number of Family Members"
            value={lifestyle.familyMembers}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            required
          />

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/health-details")}
              className="w-1/2 bg-gray-300 hover:bg-gray-400 py-3 rounded-xl font-semibold"
            >
              ← Back
            </button>

            <button
              type="submit"
              className="w-1/2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
            >
              Finish Setup 🌿
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default Lifestyle;