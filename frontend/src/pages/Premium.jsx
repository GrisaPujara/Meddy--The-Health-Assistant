import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isLoggedIn, loadProfileData } from "../utils/userStore";

const FEATURES = [
  {
    title: "Reports & online doctors",
    text: "Share health issues and reports with a doctor on a video consult.",
  },
  {
    title: "Signed e-prescription",
    text: "Get a digital prescription after the consultation, with the doctor’s signature.",
  },
  {
    title: "Nearby lab test booking",
    text: "Book tests at laboratories near the location we captured at login.",
  },
];

function Premium() {
  const navigate = useNavigate();
  const [user, setUser] = useState(loadProfileData());

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    setUser(loadProfileData());
  }, [navigate]);

  const place = [user.location?.city, user.location?.state]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard" className="text-indigo-600 font-semibold">
          ← Dashboard
        </Link>

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-6">
          <p className="text-sm font-semibold text-indigo-600 uppercase">
            Premium (coming next)
          </p>
          <h1 className="text-4xl font-bold mt-2">Meddy Premium</h1>
          <p className="text-gray-600 mt-3">
            Location access after login is the base for nearby doctors and labs.
            {place
              ? ` We currently have you in ${place}.`
              : " Allow location when the browser asks so we can find nearby labs later."}
          </p>
        </div>

        <div className="grid md:grid-cols-1 gap-4 mt-6">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">{feature.title}</h2>
                  <p className="text-gray-600 mt-2">{feature.text}</p>
                </div>
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-xl h-fit text-sm font-semibold">
                  Premium
                </span>
              </div>
              <button
                type="button"
                disabled
                className="mt-4 w-full bg-gray-200 text-gray-500 py-3 rounded-xl font-semibold"
              >
                Coming soon
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Premium;
