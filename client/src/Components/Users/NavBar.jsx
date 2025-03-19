import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import logo from "./logo.png";
import { useAuth } from "../../Context/AuthContext";

export const NavBar = () => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("Home");
  const { user, isLoggedIn } = useAuth();

  const handleNavClick = (link) => {
    setActiveLink(link);
    if (link === "Home") {
      navigate("/");
    } else if (link === "Event") {
      navigate("/event");
    } else if (link === "Venue") {
      navigate("/bookvenue");
    } else if (link === "AboutUs") {
      navigate("/aboutus");
    } else if (link === "ContactUs") {
      navigate("/contactus");
    } else if (link === "CreateEvent") {
      navigate("/createEvent");
    }
  };

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
            {["Home", "Event", "Venue", "AboutUs", "ContactUs"].map((link) => (
              <button
                key={link}
                className={`text-sm font-medium transition-all duration-200 pb-1 ${activeLink === link
                  ? "text-[#ED4A43] border-b-2 border-[#ED4A43]"
                  : "text-gray-600 hover:text-[#ED4A43] hover:border-b-2 hover:border-[#ED4A43]/30"
                  }`}
                onClick={() => handleNavClick(link)}
              >
                {link.replace(/([A-Z])/g, " $1").trim()}
              </button>
            ))}
          </div>

          {/* Action Buttons & Profile */}
          <div className="flex items-center">

            {/* Icons and Buttons Group */}
            <div className="flex items-center space-x-5">
              {/* Favorite Icon */}
              <button className="text-gray-500 hover:text-[#ED4A43] transition-colors relative">
                <FiHeart size={20} />
                {/* You can add a badge here if needed */}
              </button>

              {/* Notifications */}
              <button className="text-gray-500 hover:text-[#ED4A43] transition-colors relative">
                <FaBell size={20} />
                {/* Notification badge example */}
                <span className="absolute -top-1.5 -right-1.5 bg-[#ED4A43] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  2
                </span>
              </button>

              {/* Create Event Button */}
              {user && (
                <button
                  className="bg-white text-[#ED4A43] border border-[#ED4A43] px-4 py-1.5 text-sm font-medium rounded-md hover:bg-[#FFF5F4] transition-colors"
                  onClick={() => navigate("/createEvent")}
                >
                  CREATE EVENT
                </button>
              )}
              {!user && (
                <button
                  className="bg-[#ED4A43] text-white px-5 py-1.5 text-sm font-medium rounded-md hover:bg-[#D43C35] transition-colors"
                  onClick={() => navigate("/login")}
                >
                  LOG IN
                </button>
              )}


              {/* Welcome Message - Only shown when user is logged in */}
              {user && (
                <div className="mr-5 hidden md:block">
                  <span className="text-gray-700 font-medium text-md">
                    Welcome, <span className="text-[#ED4A43]">{user.fullName || user.username || "User"}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};