import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth no puede ser usado sin AuthProvider");
  }

  return context;
};

export default useAuth;
