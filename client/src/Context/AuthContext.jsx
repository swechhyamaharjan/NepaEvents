import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get(
          `http://localhost:3000/getProfile`,
          { withCredentials: true } // FIX: Ensures cookies are sent
        );
        console.log("User Data:", response.data);
        setUser(response.data);
        setRole(response.data.role); // FIX: Set role
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }
    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, setUser, setRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
