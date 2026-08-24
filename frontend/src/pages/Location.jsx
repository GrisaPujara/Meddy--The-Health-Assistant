import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Location() {
  const navigate = useNavigate();

  const [location, setLocation] = useState({
    country: "",
    state: "",
    city: "",
    pinCode: "",
  });

  const handleChange = (e) => {
    setLocation({
      ...location,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save location data
    localStorage.setItem("location", JSON.stringify(location));

    // Go to next page
    navigate("/health-details");
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
          Help Meddy personalize your grocery and nutrition recommendations.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

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
              onClick={() => navigate("/personal-info")}
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