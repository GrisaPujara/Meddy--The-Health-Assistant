import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isLoggedIn, loadProfileData, logout } from "../utils/userStore";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    personalInfo: {},
    location: {},
    healthDetails: {},
    lifestyle: {},
  });

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    setUser(loadProfileData());
  }, [navigate]);

  const height = Number(user.healthDetails.height || 0);
  const weight = Number(user.healthDetails.weight || 0);

  const bmi =
    height > 0
      ? (
          weight /
          ((height / 100) * (height / 100))
        ).toFixed(1)
      : "--";

  const calories =
    weight > 0 ? Math.round(weight * 30) : "--";

  const waterGoal =
    weight > 0
      ? Math.max(6, Math.round(weight * 0.033 * 4))
      : 8;

  const healthScore =
    bmi !== "--" && bmi >= 18.5 && bmi <= 24.9
      ? 95
      : 80;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}

      <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">

        <h1 className="text-3xl font-bold text-indigo-600">
          🌿 Meddy
        </h1>

        <div className="flex gap-6">

          <Link to="/nutrition" className="hover:text-indigo-600">
            Nutrition
          </Link>

          <Link to="/grocery" className="hover:text-indigo-600">
            Grocery
          </Link>

          <Link to="/family-health" className="hover:text-indigo-600">
            Family
          </Link>

          <Link to="/chat" className="hover:text-indigo-600">
            AI Chat
          </Link>

          <Link to="/profile" className="hover:text-indigo-600">
            Profile
          </Link>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="hover:text-indigo-600"
          >
            Logout
          </button>

        </div>

      </nav>

      <div className="max-w-7xl mx-auto p-8">

        {/* Welcome Card */}

        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-3xl p-10">

          <h2 className="text-4xl font-bold">
            Holaa, {user.personalInfo.fullName || user.fullName || user.email || "User"} 👋
          </h2>

          <p className="mt-4 text-lg">
            {user.location.city || "--"},{" "}
            {user.location.state || "--"}
          </p>

          <p className="mt-2">
            Age : {user.personalInfo.age || "--"} | Gender :{" "}
            {user.personalInfo.gender || "--"}
          </p>

          <button
            type="button"
            onClick={() => navigate("/personal-info?edit=1")}
            className="mt-6 bg-white text-indigo-600 px-5 py-2 rounded-xl font-semibold"
          >
            Edit profile
          </button>

        </div>

        {/* Dashboard Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h3 className="text-xl font-bold">
              ❤️ Health Score
            </h3>

            <p className="text-4xl mt-4 font-bold text-green-600">
              {healthScore}%
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h3 className="text-xl font-bold">
              💧 Daily Water Goal
            </h3>

            <p className="text-4xl mt-4 font-bold text-blue-600">
              {waterGoal} Glasses
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h3 className="text-xl font-bold">
              🥗 Daily Calories
            </h3>

            <p className="text-4xl mt-4 font-bold text-orange-600">
              {calories} kcal
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h3 className="text-xl font-bold">
              📏 BMI
            </h3>

            <p className="text-4xl mt-4 font-bold text-purple-600">
              {bmi}
            </p>

          </div>

        </div>

        {/* Health Summary */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-10">

          <h2 className="text-3xl font-bold mb-6">
            👤 Health Summary
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <strong>Blood Group:</strong>{" "}
              {user.healthDetails.bloodGroup || "--"}
            </div>

            <div>
              <strong>Height:</strong>{" "}
              {user.healthDetails.height || "--"} cm
            </div>

            <div>
              <strong>Weight:</strong>{" "}
              {user.healthDetails.weight || "--"} kg
            </div>

            <div>
              <strong>Food Preference:</strong>{" "}
              {user.lifestyle.foodPreference || "--"}
            </div>

            <div>
              <strong>Activity Level:</strong>{" "}
              {user.lifestyle.activityLevel || "--"}
            </div>

            <div>
              <strong>Fitness Goal:</strong>{" "}
              {user.lifestyle.fitnessGoal || "--"}
            </div>

            <div>
              <strong>Medical Condition:</strong>{" "}
              {user.healthDetails.medicalCondition || "None"}
            </div>

            <div>
              <strong>Allergies:</strong>{" "}
              {user.healthDetails.allergies || "None"}
            </div>

            <div>
              <strong>Current Medicines:</strong>{" "}
              {user.healthDetails.medicines || "None"}
            </div>

            <div>
              <strong>Family Members:</strong>{" "}
              {user.lifestyle.familyMembers || "--"}
            </div>

          </div>

        </div>

        {/* Quick Actions */}

        <h2 className="text-3xl font-bold mt-12 mb-6">
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <Link
            to="/chat"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition"
          >
            <div className="text-5xl">🤖</div>

            <h3 className="text-xl font-bold mt-4">
              Ask Meddy AI
            </h3>

          </Link>

          <Link
            to="/nutrition"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition"
          >
            <div className="text-5xl">🥗</div>

            <h3 className="text-xl font-bold mt-4">
              Nutrition Planner
            </h3>

          </Link>

          <Link
            to="/grocery"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition"
          >
            <div className="text-5xl">🛒</div>

            <h3 className="text-xl font-bold mt-4">
              Grocery Planner
            </h3>

          </Link>

          <Link
            to="/family-health"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition"
          >
            <div className="text-5xl">👨‍👩‍👧</div>

            <h3 className="text-xl font-bold mt-4">
              Family Health
            </h3>

          </Link>

          <Link
            to="/disease-library"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition"
          >
            <div className="text-5xl">📚</div>

            <h3 className="text-xl font-bold mt-4">
              Disease Library
            </h3>

          </Link>

          <Link
            to="/profile"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition"
          >
            <div className="text-5xl">👤</div>

            <h3 className="text-xl font-bold mt-4">
              My Profile
            </h3>

          </Link>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;