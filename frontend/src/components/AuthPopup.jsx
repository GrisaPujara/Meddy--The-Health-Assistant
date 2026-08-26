import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hasCompletedProfile, loginAccount, registerAccount } from "../utils/userStore";
import { requestLocationAfterLogin } from "../utils/locationAccess";

function AuthPopup({ onClose }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const afterAuth = (user, isNew) => {
    requestLocationAfterLogin();
    if (isNew || !hasCompletedProfile(user)) {
      navigate("/health-profile");
      return;
    }
    navigate("/dashboard");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = loginAccount(loginForm.email, loginForm.password);
      afterAuth(user, false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const user = registerAccount({
        fullName: registerForm.fullName,
        email: registerForm.email,
        password: registerForm.password,
      });
      afterAuth(user, true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-400 text-2xl"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold text-indigo-600 text-center">🌿 Meddy</h2>
        <p className="text-center text-gray-500 mt-2">
          Login or create an account to continue
        </p>

        <div className="grid grid-cols-2 gap-2 mt-6 bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`py-2 rounded-lg font-semibold ${
              mode === "login" ? "bg-white text-indigo-600 shadow" : "text-gray-500"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
            }}
            className={`py-2 rounded-lg font-semibold ${
              mode === "register" ? "bg-white text-indigo-600 shadow" : "text-gray-500"
            }`}
          >
            Create account
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              className="w-full border rounded-xl p-3"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              className="w-full border rounded-xl p-3"
              required
            />
            {error && (
              <p className="text-red-600 bg-red-50 rounded-xl p-3 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold"
            >
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Full name"
              value={registerForm.fullName}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, fullName: e.target.value })
              }
              className="w-full border rounded-xl p-3"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, email: e.target.value })
              }
              className="w-full border rounded-xl p-3"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, password: e.target.value })
              }
              className="w-full border rounded-xl p-3"
              required
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={registerForm.confirmPassword}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full border rounded-xl p-3"
              required
            />
            {error && (
              <p className="text-red-600 bg-red-50 rounded-xl p-3 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold"
            >
              Create account
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthPopup;
