import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="w-full px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold text-indigo-600"
        >
          🌿 Meddy
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8">

          <Link to="/" className="hover:text-indigo-600">
            Home
          </Link>

          <Link to="/dashboard" className="hover:text-indigo-600">
            Dashboard
          </Link>

          <Link to="/chat" className="hover:text-indigo-600">
            AI Chat
          </Link>

          <Link to="/nutrition" className="hover:text-indigo-600">
            Nutrition
          </Link>

          <Link to="/grocery" className="hover:text-indigo-600">
            Grocery
          </Link>

          <Link to="/family-health" className="hover:text-indigo-600">
            Family
          </Link>

          <Link to="/profile" className="hover:text-indigo-600">
            Profile
          </Link>

          <Link
            to="/login"
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
          >
            Login
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;