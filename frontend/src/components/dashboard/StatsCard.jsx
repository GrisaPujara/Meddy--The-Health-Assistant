function StatsCard() {
  const stats = [
    {
      title: "Health Score",
      value: "92%",
      icon: "❤️",
      color: "bg-red-100",
    },
    {
      title: "Water Intake",
      value: "2.3 L",
      icon: "💧",
      color: "bg-blue-100",
    },
    {
      title: "Calories",
      value: "1750 kcal",
      icon: "🥗",
      color: "bg-green-100",
    },
    {
      title: "Steps",
      value: "8,450",
      icon: "🚶",
      color: "bg-yellow-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {stats.map((item, index) => (
        <div
          key={index}
          className={`${item.color} rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300`}
        >
          <div className="text-4xl">{item.icon}</div>

          <h2 className="mt-4 text-gray-600 font-medium">
            {item.title}
          </h2>

          <p className="text-3xl font-bold mt-2">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export default StatsCard;