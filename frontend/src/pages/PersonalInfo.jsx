import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser, updateCurrentUser } from "../utils/userStore";

function PersonalInfo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get("edit") === "1";
  const nextQuery = isEdit ? "?edit=1" : "";

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    age: "",
    gender: "",
  });

  useEffect(() => {
    const user = getCurrentUser();
    const saved = user.personalInfo || {};

    setFormData({
      fullName: saved.fullName || user.fullName || "",
      dob: saved.dob || "",
      age: saved.age || "",
      gender: saved.gender || "",
    });
  }, []);

  // -----------------------------------------
  // Handle input changes
  // -----------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Automatically calculate age when DOB changes
    if (name === "dob") {
      const birthDate = new Date(value);
      const today = new Date();

      let calculatedAge =
        today.getFullYear() - birthDate.getFullYear();

      const monthDifference =
        today.getMonth() - birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 &&
          today.getDate() < birthDate.getDate())
      ) {
        calculatedAge--;
      }

      setFormData({
        ...formData,
        dob: value,
        age: calculatedAge >= 0 ? calculatedAge : "",
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // -----------------------------------------
  // Submit
  // -----------------------------------------

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save personal information
    updateCurrentUser({
      fullName: formData.fullName,
      personalInfo: formData,
    });

    // Go to Location page
    navigate(`/location${nextQuery}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl p-10">

        {/* Logo */}

        <h1 className="text-4xl font-bold text-indigo-600 text-center">
          🌿 Meddy
        </h1>

        {/* Heading */}

        <h2 className="text-2xl font-bold mt-6 text-center">
          Step 1 • Personal Information
        </h2>

        <p className="text-center text-gray-500 mt-2">
          {isEdit
            ? "Edit your details. Your saved information is already filled in."
            : "Tell us a little about yourself."}
        </p>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* Full Name */}

          <div>
            <label className="block font-semibold mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              className="w-full border rounded-xl p-3"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>


          {/* Date of Birth */}

          <div>
            <label className="block font-semibold mb-2">
              Date of Birth
            </label>

            <input
              type="date"
              name="dob"
              className="w-full border rounded-xl p-3"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>


          {/* Age - Automatically calculated */}

          <div>
            <label className="block font-semibold mb-2">
              Age
            </label>

            <input
              type="number"
              name="age"
              placeholder="Age will be calculated automatically"
              className="w-full border rounded-xl p-3 bg-gray-100"
              value={formData.age}
              readOnly
            />

            <p className="text-sm text-gray-500 mt-1">
              Age is automatically calculated from your date of birth.
            </p>
          </div>


          {/* Gender */}

          <div>
            <label className="block font-semibold mb-2">
              Gender
            </label>

            <select
              name="gender"
              className="w-full border rounded-xl p-3"
              value={formData.gender}
              onChange={handleChange}
              required
            >

              <option value="">
                Select Gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Other">
                Other
              </option>

              <option value="Prefer not to say">
                Prefer not to say
              </option>

            </select>
          </div>


          {/* Continue Button */}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {isEdit ? "Save and continue →" : "Continue →"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default PersonalInfo;