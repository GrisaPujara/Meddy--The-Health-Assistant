import { useNavigate } from "react-router-dom";

function HealthProfile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-2xl">

        <div className="text-center">
          <h1 className="text-5xl font-bold text-indigo-600">
            🌿 Meddy
          </h1>

          <h2 className="text-3xl font-bold mt-6">
            Health Profile Setup
          </h2>

          <p className="text-gray-500 mt-3">
            Let's personalize Meddy for you.
          </p>

          <p className="text-gray-500">
            This information is collected only once and helps Meddy provide
            personalized nutrition, grocery planning, and health recommendations.
          </p>
        </div>

        <div className="mt-10">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step 1 of 4</span>
            <span>25%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-indigo-600 h-3 rounded-full w-1/4"></div>
          </div>
        </div>

        <button
          onClick={() => navigate("/personal-info")}
          className="mt-10 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-lg font-semibold transition"
        >
          Start Setup →
        </button>

      </div>

    </div>
  );
}

export default HealthProfile;