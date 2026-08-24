import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center px-4">

      <div className="bg-white shadow-xl rounded-3xl w-full max-w-md p-10">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600">
            🌿 Meddy
          </h1>

          <p className="text-gray-600 mt-3">
            Welcome back! Sign in to continue your health journey.
          </p>
        </div>

        <form className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition"
          >
            Login
          </button>

        </form>

        <div className="text-center mt-6">

          <p className="text-gray-600">
            Don't have an account?
          </p>

          <Link
            to="/register"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Create Account
          </Link>

        </div>

        <div className="text-center mt-8">

          <Link
            to="/"
            className="text-gray-500 hover:text-indigo-600"
          >
            ← Back to Home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;