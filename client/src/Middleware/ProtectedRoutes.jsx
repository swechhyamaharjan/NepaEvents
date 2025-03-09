import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, role } = useAuth();


  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!adminOnly && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
