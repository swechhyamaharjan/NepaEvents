import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import { Signup } from "./Components/Users/Signup";
import { HomePage } from "./Components/Users/HomePage";
import { NavBar } from "./Components/Users/NavBar";
import { Footer } from "./Components/Users/Footer";
import { Event } from "./Components/Users/Event";
import { AboutUs } from "./Components/Users/AboutUs";
import { ContactUs } from "./Components/Users/ContactUs";
import { CreateEvent } from "./Components/Users/CreateEvent";
import { BookVenue } from "./Components/Users/BookVenue";
import { Login } from "./Components/Users/Login";

import { AdminEventPage } from "./Components/Admin/AdminEventPage";
import { AdminHome } from "./Components/Admin/AdminHome";
import { AdminSidebar } from "./Components/Admin/AdminSidebar";
import { AdminVenuePage } from "./Components/Admin/AdminVenuePage";
import { AuthProvider } from "./Context/AuthContext";
import { ProtectedRoute } from "./Middleware/ProtectedRoutes"; // Import ProtectedRoute

// Layout for Users
const UserLayout = ({ children }) => (
  <>
    <NavBar />
    {children}
    <Footer />
  </>
);

// Layout for Admin
const AdminLayout = ({ children }) => (
  <div className="flex">
    <AdminSidebar />
    <div className="ml-64 p-8 w-full">{children}</div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public User Routes */}
          <Route path="/login" element={<UserLayout><Login /></UserLayout>} />
          <Route path="/signup" element={<UserLayout><Signup /></UserLayout>} />
          <Route path="/" element={<UserLayout><HomePage /></UserLayout>} />
          <Route path="/event" element={<UserLayout><Event /></UserLayout>} />
          <Route path="/aboutus" element={<UserLayout><AboutUs /></UserLayout>} />
          <Route path="/contactus" element={<UserLayout><ContactUs /></UserLayout>} />
          <Route path="/createevent" element={<UserLayout><CreateEvent /></UserLayout>} />
          <Route path="/bookvenue" element={<UserLayout><BookVenue /></UserLayout>} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin/home" element={<AdminLayout><AdminHome /></AdminLayout>} />
            <Route path="/admin/events" element={<AdminLayout><AdminEventPage /></AdminLayout>} />
            <Route path="/admin/venues" element={<AdminLayout><AdminVenuePage /></AdminLayout>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;