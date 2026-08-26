import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/sections/HeroSection";
import ServicesSection from "../components/sections/ServicesSection";
import AuthPopup from "../components/AuthPopup";
import { isLoggedIn } from "../utils/userStore";

function Home() {
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      setShowAuth(true);
    }
  }, []);

  return (
    <>
      <Navbar />
      <HeroSection />
      <ServicesSection />
      {showAuth && <AuthPopup onClose={() => setShowAuth(false)} />}
    </>
  );
}

export default Home;
