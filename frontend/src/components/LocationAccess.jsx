import { useEffect } from "react";
import { isLoggedIn } from "../utils/userStore";
import { requestLocationAfterLogin } from "../utils/locationAccess";

function LocationAccess() {
  useEffect(() => {
    if (!isLoggedIn()) return;
    requestLocationAfterLogin();
  }, []);

  return null;
}

export default LocationAccess;
