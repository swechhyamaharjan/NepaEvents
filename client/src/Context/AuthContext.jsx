import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/getProfile`, {
          withCredentials: true, // Required for cookies-based auth
        });
        if (response.data) {
          setUser(response.data.user);
          setRole(response.data.user.role); // Set role correctly
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    };

    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, setUser, setRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);