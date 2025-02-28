import { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getProfile`);
        console.log(response);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }
    getUser();
    console.log(user, 'vjhkhhbhbjjj');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, role, setUser, setLoading, setRole }}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );  
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
