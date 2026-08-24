import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section className="bg-[#F8F7F4] min-h-[88vh] flex items-center justify-center">

      <div className="w-full max-w-5xl text-center px-6">

        {/* Logo */}
        <h1 className="text-7xl font-extrabold text-gray-900">
          🌿 Meddy
        </h1>

        {/* Quote */}
        <p className="mt-8 text-3xl text-gray-700 font-medium">
          "Feel Heard, Eat Smarter, Spend Wiser."
        </p>

        {/* Welcome */}
        <p className="mt-16 text-2xl text-gray-500">
          Welcome 👋
        </p>

        {/* Heading */}
        <h2 className="mt-4 text-5xl font-bold text-gray-900">
          What's on your mind today?
        </h2>

        {/* Button */}
        <Link to="/chat">
          <button
            className="mt-10 bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-semibold px-10 py-4 rounded-xl transition duration-300"
          >
            Start a Conversation
          </button>
        </Link>

      </div>

    </section>
  );
}

export default HeroSection;