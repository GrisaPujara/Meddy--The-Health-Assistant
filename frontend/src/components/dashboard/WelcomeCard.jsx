function WelcomeCard() {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl">

      <h1 className="text-4xl font-bold">
        Holaaa Buddy 👋
      </h1>

      <p className="mt-2 text-lg text-indigo-100">
        Welcome to Meddy.
      </p>

      <p className="mt-6 text-indigo-100">
        Your AI Health Assistant is ready to help you with nutrition,
        disease information, grocery planning, and personalized health
        recommendations.
      </p>

    </div>
  );
}

export default WelcomeCard;