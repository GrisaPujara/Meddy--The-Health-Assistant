import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, loadProfileData } from "../utils/userStore";
import { saveDetectedLocation } from "../utils/locationAccess";

function Profile() {
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

  // -----------------------------
  // Helper
  // -----------------------------

  const showValue = (value, suffix = "") => {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return "--";
    }

    return `${value}${suffix}`;
  };

  // -----------------------------
  // BMI Calculation
  // -----------------------------

  const height = Number(user.healthDetails.height || 0);
  const weight = Number(user.healthDetails.weight || 0);

  const bmi =
    height > 0 && weight > 0
      ? (
          weight /
          ((height / 100) * (height / 100))
        ).toFixed(1)
      : "--";

  // -----------------------------
  // BMI Status
  // -----------------------------

  const getBMIStatus = () => {
    if (bmi === "--") return "";

    const value = Number(bmi);

    if (value < 18.5) return "Underweight";
    if (value < 25) return "Normal";
    if (value < 30) return "Overweight";

    return "Obesity range";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">

      <div className="max-w-5xl mx-auto">

        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-indigo-600">
            Holaa, {user.personalInfo.fullName || user.fullName || user.email || "User"} 👋
          </h1>

          <p className="text-gray-500 mt-2">
            Your personal, health and lifestyle information
          </p>

          <button
            type="button"
            onClick={() => navigate("/personal-info?edit=1")}
            className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-xl font-semibold"
          >
            Edit profile
          </button>

        </div>


        {/* ========================= */}
        {/* PERSONAL INFORMATION */}
        {/* ========================= */}

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">

          <h2 className="text-2xl font-bold mb-6">
            👤 Personal Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="text-gray-500 text-sm">
                Full Name
              </p>

              <p className="font-semibold text-lg">
                {showValue(user.personalInfo.fullName)}
              </p>
            </div>


            <div>
              <p className="text-gray-500 text-sm">
                Date of Birth
              </p>

              <p className="font-semibold text-lg">
                {showValue(user.personalInfo.dob)}
              </p>
            </div>


            <div>
              <p className="text-gray-500 text-sm">
                Age
              </p>

              <p className="font-semibold text-lg">
                {showValue(user.personalInfo.age)}
              </p>
            </div>


            <div>
              <p className="text-gray-500 text-sm">
                Gender
              </p>

              <p className="font-semibold text-lg">
                {showValue(user.personalInfo.gender)}
              </p>
            </div>

          </div>

        </div>


        {/* ========================= */}
        {/* LOCATION */}
        {/* ========================= */}

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">

          <h2 className="text-2xl font-bold mb-6">
            📍 Location
          </h2>

          <button
            type="button"
            onClick={async () => {
              try {
                await saveDetectedLocation();
                setUser(loadProfileData());
              } catch {
                alert("Allow location in the browser, or edit it in your profile.");
              }
            }}
            className="mb-6 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-semibold"
          >
            Update from GPS
          </button>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="text-gray-500 text-sm">
                Country
              </p>

              <p className="font-semibold text-lg">
                {showValue(user.location.country)}
              </p>
            </div>


            <div>
              <p className="text-gray-500 text-sm">
                State
              </p>

              <p className="font-semibold text-lg">
                {showValue(user.location.state)}
              </p>
            </div>


            <div>
              <p className="text-gray-500 text-sm">
                City
              </p>

              <p className="font-semibold text-lg">
                {showValue(user.location.city)}
              </p>
            </div>


            <div>
              <p className="text-gray-500 text-sm">
                PIN Code
              </p>

              <p className="font-semibold text-lg">
                {showValue(user.location.pinCode)}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                GPS
              </p>

              <p className="font-semibold text-lg">
                {user.location.lat
                  ? `${Number(user.location.lat).toFixed(4)}, ${Number(user.location.lng).toFixed(4)}`
                  : "--"}
              </p>
            </div>

          </div>

        </div>


        {/* ========================= */}
        {/* HEALTH DETAILS */}
        {/* ========================= */}

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">

          <h2 className="text-2xl font-bold mb-6">
            ❤️ Health Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="text-gray-500 text-sm">
                Height
              </p>

              <p className="font-semibold text-lg">
                {showValue(user.healthDetails.height, " cm")}
              </p>
            </div>


            <div>
              <p className="text-gray-500 text-sm">
                Weight
              </p>

              <p className="font-semibold text-lg">
                {showValue(user.healthDetails.weight, " kg")}
              </p>
            </div>


            <div>
              <p className="text-gray-500 text-sm">
                Blood Group
              </p>

              <p className="font-semibold text-lg">
                {showValue(user.healthDetails.bloodGroup)}
              </p>
            </div>


            <div>
              <p className="text-gray-500 text-sm">
                BMI
              </p>

              <p className="font-semibold text-lg">
                {bmi}
              </p>

              {getBMIStatus() && (
                <p className="text-sm text-indigo-600 mt-1">
                  {getBMIStatus()}
                </p>
              )}
            </div>


            <div>
              <p className="text-gray-500 text-sm">
                Medical Condition
              </p>

              <p className="font-semibold text-lg">
                {user.healthDetails.medicalCondition || "None"}
              </p>
            </div>


            <div>
              <p className="text-gray-500 text-sm">
                Allergies
              </p>

              <p className="font-semibold text-lg">
                {user.healthDetails.allergies || "None"}
              </p>
            </div>


            <div className="md:col-span-2">

              <p className="text-gray-500 text-sm">
                Current Medicines
              </p>

              <p className="font-semibold text-lg">
                {user.healthDetails.medicines || "None"}
              </p>

            </div>

          </div>

        </div>


        {/* ========================= */}
        {/* LIFESTYLE */}
        {/* ========================= */}

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">

          <h2 className="text-2xl font-bold mb-6">
            🌱 Lifestyle
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="text-gray-500 text-sm">
                Food Preference
              </p>

              <p className="font-semibold text-lg">
                {showValue(user.lifestyle.foodPreference)}
              </p>
            </div>


            <div>
              <p className="text-gray-500 text-sm">
                Activity Level
              </p>

              <p className="font-semibold text-lg">
                {showValue(user.lifestyle.activityLevel)}
              </p>
            </div>


            <div>
              <p className="text-gray-500 text-sm">
                Fitness Goal
              </p>

              <p className="font-semibold text-lg">
                {showValue(user.lifestyle.fitnessGoal)}
              </p>
            </div>


            <div>
              <p className="text-gray-500 text-sm">
                Family Members
              </p>

              <p className="font-semibold text-lg">
                {showValue(user.lifestyle.familyMembers)}
              </p>
            </div>

          </div>

        </div>


        {/* ========================= */}
        {/* PROFILE SUMMARY */}
        {/* ========================= */}

        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-8">

          <h2 className="text-xl font-bold text-indigo-700 mb-2">
            🩺 Meddy Profile Summary
          </h2>

          <p className="text-gray-700">
            Meddy can use your health and lifestyle information
            to provide more personalized nutrition and grocery
            planning recommendations.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Profile;