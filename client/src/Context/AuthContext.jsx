import { createContext, useEffect, useState, useContext } from "react";
import api from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
      setIsLoggedIn(true);
      setLoading(false);
    } else {
      getUser(); // Fetch from API if not in storage
    }
  }, []);

  const getUser = async () => {
    try {
      const response = await api.get(`/getProfile`);
      if (response.data) {
        setUser(response.data.user);
        setRole(response.data.user.role);
        setIsLoggedIn(true);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("role", response.data.user.role);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, setUser, setRole, loading, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);