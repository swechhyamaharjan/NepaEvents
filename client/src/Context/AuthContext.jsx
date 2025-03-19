import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/getProfile`, {
          withCredentials: true, // Required for cookies-based auth
        });
        if (response.data) {
          setUser(response.data.user);
          setRole(response.data.user.role); 
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false); 
      }
    };

    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, setUser, setRole, loading , isLoggedIn}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);