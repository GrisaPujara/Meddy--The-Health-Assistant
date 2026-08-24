function ServicesSection() {
  const services = [
    {
      icon: "💬",
      title: "AI Health Chat",
      description:
        "Ask health-related questions and receive AI-powered guidance.",
    },
    {
      icon: "🥗",
      title: "Nutrition Planner",
      description:
        "Get personalized meal recommendations based on your goals.",
    },
    {
      icon: "🛒",
      title: "Grocery Planner",
      description:
        "Plan healthy groceries while staying within your budget.",
    },
  ];

  return (
    <section className="bg-white py-20 px-6">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
        What Meddy Can Do For You
      </h2>

      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        {services.map((service) => (
          <div
            key={service.title}
            className="bg-[#F8F7F4] rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition"
          >
            <div className="text-5xl mb-5">{service.icon}</div>

            <h3 className="text-2xl font-semibold mb-3">
              {service.title}
            </h3>

            <p className="text-gray-600">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ServicesSection;