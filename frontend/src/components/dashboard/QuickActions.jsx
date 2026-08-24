import { Link } from "react-router-dom";

function QuickActions() {
  const actions = [
    {
      title: "AI Chat",
      description: "Ask Meddy anything",
      icon: "🤖",
      path: "/chat",
    },
    {
      title: "Nutrition",
      description: "Plan your meals",
      icon: "🥗",
      path: "/nutrition",
    },
    {
      title: "Grocery",
      description: "Manage your grocery budget",
      icon: "🛒",
      path: "/grocery",
    },
    {
      title: "Family Health",
      description: "Manage your family's health",
      icon: "👨‍👩‍👧",
      path: "/family-health",
    },
    {
      title: "Disease Encyclopedia",
      description: "Search diseases instantly",
      icon: "📚",
      path: "/disease-library",
    },
    {
      title: "Profile",
      description: "View your account",
      icon: "👤",
      path: "/profile",
    },
  ];

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold mb-6">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6"
          >
            <div className="text-5xl">{action.icon}</div>

            <h3 className="text-xl font-bold mt-4">
              {action.title}
            </h3>

            <p className="text-gray-600 mt-2">
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;