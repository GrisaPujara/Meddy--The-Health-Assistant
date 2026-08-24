import { useNavigate } from "react-router-dom";
import { useState } from "react";

function HealthDetails() {
  const navigate = useNavigate();

  const [health, setHealth] = useState({
    height: "",
    weight: "",
    bloodGroup: "",
    medicalCondition: "",
    allergies: "",
    medicines: "",
  });

  const handleChange = (e) => {
    setHealth({
      ...health,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save health details
    localStorage.setItem("healthDetails", JSON.stringify(health));

    // Go to Lifestyle page
    navigate("/lifestyle");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-2xl">

        <h1 className="text-4xl font-bold text-center text-indigo-600">
          🌿 Meddy
        </h1>

        <h2 className="text-3xl font-bold text-center mt-6">
          Step 3 • Health Details
        </h2>

        <p className="text-center text-gray-500 mt-2">
          This information helps Meddy provide personalized health recommendations.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          <input
            type="number"
            name="height"
            placeholder="Height (cm)"
            value={health.height}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            required
          />

          <input
            type="number"
            name="weight"
            placeholder="Weight (kg)"
            value={health.weight}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            required
          />

          <select
            name="bloodGroup"
            value={health.bloodGroup}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            required
          >
            <option value="">Select Blood Group</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
            <option>O+</option>
            <option>O-</option>
          </select>

          <textarea
            name="medicalCondition"
            placeholder="Medical Conditions (Optional)"
            rows="3"
            value={health.medicalCondition}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          <textarea
            name="allergies"
            placeholder="Allergies (Optional)"
            rows="3"
            value={health.allergies}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          <textarea
            name="medicines"
            placeholder="Current Medicines (Optional)"
            rows="3"
            value={health.medicines}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          <div className="flex gap-4">

            <button
              type="button"
              onClick={() => navigate("/location")}
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

export default HealthDetails;