import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave, FaUsers, FaTags } from "react-icons/fa";
const logo = "/images/logo.png"; 

export const AdminSidebar = () => {
  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col fixed">
      {/* Logo and Name */}
      <div className="flex items-center space-x-2 p-5 border-b border-gray-700">
        <img src={logo} alt="NepaEvents Logo" className="h-10 w-10" />
        <h2 className="text-lg font-bold">NepaEvents</h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/admin/home"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-3 rounded-md transition ${
              isActive ? "bg-gray-800 text-[#ED4A43]" : "hover:bg-gray-800"
            }`
          }
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/admin/events"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-3 rounded-md transition ${
              isActive ? "bg-gray-800 text-[#ED4A43]" : "hover:bg-gray-800"
            }`
          }
        >
          <FaCalendarAlt />
          <span>Events</span>
        </NavLink>
        <NavLink
          to="/admin/venues"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-3 rounded-md transition ${
              isActive ? "bg-gray-800 text-[#ED4A43]" : "hover:bg-gray-800"
            }`
          }
        >
          <FaMapMarkerAlt />
          <span>Venues</span>
        </NavLink>
        <NavLink
          to="/admin/category"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-3 rounded-md transition ${
              isActive ? "bg-gray-800 text-[#ED4A43]" : "hover:bg-gray-800"
            }`
          }
        >
          <FaTags />
          <span>Category</span>
        </NavLink>
        <NavLink
          to="/admin/payments"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-3 rounded-md transition ${
              isActive ? "bg-gray-800 text-[#ED4A43]" : "hover:bg-gray-800"
            }`
          }
        >
          <FaMoneyBillWave />
          <span>Payments</span>
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-3 rounded-md transition ${
              isActive ? "bg-gray-800 text-[#ED4A43]" : "hover:bg-gray-800"
            }`
          }
        >
          <FaUsers />
          <span>Users</span>
        </NavLink>
      </nav>
    </div>
  );
};
