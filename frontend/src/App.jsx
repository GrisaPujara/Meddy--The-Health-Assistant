import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Authentication
import Login from "./pages/Login";
import Register from "./pages/Register";
import HealthProfile from "./pages/HealthProfile";
import PersonalInfo from "./pages/PersonalInfo";
import Location from "./pages/Location";
import HealthDetails from "./pages/HealthDetails";
import Lifestyle from "./pages/Lifestyle";

// Main Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Nutrition from "./pages/Nutrition";
import Grocery from "./pages/Grocery";
import FamilyHealth from "./pages/FamilyHealth";
import DiseaseLibrary from "./pages/DiseaseLibrary";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Health Profile Setup */}
        <Route path="/health-profile" element={<HealthProfile />} />
        <Route path="/personal-info" element={<PersonalInfo />} />
        <Route path="/location" element={<Location />} />
        <Route path="/health-details" element={<HealthDetails />} />
        <Route path="/lifestyle" element={<Lifestyle />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Main Features */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/grocery" element={<Grocery />} />
        <Route path="/family-health" element={<FamilyHealth />} />
        <Route path="/disease-library" element={<DiseaseLibrary />} />
        <Route path="/profile" element={<Profile />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;