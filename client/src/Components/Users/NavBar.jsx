import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle, FaCog, FaHistory, FaSignOutAlt, FaEdit } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import logo from "./logo.png";
import { useAuth } from "../../Context/AuthContext";

export const NavBar = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 py-4 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
            <h1 className="text-xl font-bold text-[#ED4A43]">NepaEvents</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-10">
            {[
              { name: "Home", path: "/" },
              { name: "Event", path: "/event" },
              { name: "Venue", path: "/bookvenue" },
              { name: "About Us", path: "/aboutus" },
              { name: "Contact Us", path: "/contactus" },
            ].map((link) => (
              <button
                key={link.name}
                className="text-sm font-medium text-gray-600 hover:text-[#ED4A43] transition-all duration-200"
                onClick={() => navigate(link.path)}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Icons & Profile */}
          <div className="flex items-center space-x-5">
            {/* Favorite Icon */}
            <button
              className="text-gray-500 hover:text-[#ED4A43] transition-colors relative"
              onClick={() => navigate("/favourites")}
            >
              <FiHeart size={20} />
            </button>

            {/* Notifications */}
            <button className="text-gray-500 hover:text-[#ED4A43] transition-colors relative"
            onClick={() => navigate("/notifications")}>
              <FaBell size={20} />
              <span className="absolute -top-1.5 -right-1.5 bg-[#ED4A43] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </button>

            {/* Profile Dropdown */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  className="flex items-center space-x-2 bg-[#ED4A43] text-white px-4 py-2 rounded-full hover:bg-[#D43C35] transition-colors"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span className="bg-[#4CAF50] text-white font-medium rounded-full w-8 h-8 flex items-center justify-center">
                    {user?.fullName?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase()}
                  </span>
                  <span className="font-medium">{user?.fullName || user?.username}</span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg overflow-hidden">
                    <button
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => navigate("/profile")}
                    >
                      <FaEdit className="mr-2 text-purple-600" />
                      Edit Profile
                    </button>

                    <button
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => navigate("/settings")}
                    >
                      <FaCog className="mr-2 text-blue-600" />
                      Settings
                    </button>

                    <button
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => navigate("/history")}
                    >
                      <FaHistory className="mr-2 text-yellow-600" />
                      History
                    </button>

                    <button
                      className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-gray-100"
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/login");
                      }}
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="bg-[#ED4A43] text-white px-5 py-2 rounded-md hover:bg-[#D43C35] transition-colors"
                onClick={() => navigate("/login")}
              >
                LOG IN
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
