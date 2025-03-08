import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import logo from "./logo.png";
import { useAuth } from "../../Context/AuthContext";

export const NavBar = () => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("Home");
  const { user } = useAuth();

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
    <nav className="bg-white border-b border-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-10 h-10" />
            <h1 className="text-xl font-bold text-[#ED4A43]">NepaEvents</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {["Home", "Event", "Venue", "AboutUs", "ContactUs"].map((link) => (
              <button
                key={link}
                className={`text-sm font-medium ${
                  activeLink === link 
                    ? "text-[#ED4A43] border-b-2 border-[#ED4A43]" 
                    : "text-gray-600 hover:text-[#ED4A43]"
                }`}
                onClick={() => handleNavClick(link)}
              >
                {link.replace(/([A-Z])/g, " $1").trim()}
              </button>
            ))}
          </div>

          {/* Action Buttons & Profile */}
          <div className="flex items-center space-x-4">
            {/* Favorite Icon */}
            <button className="text-gray-500 hover:text-[#ED4A43]">
              <FiHeart size={20} />
            </button>

            {/* Notifications */}
            <button className="text-gray-500 hover:text-[#ED4A43]">
              <FaBell size={20} />
            </button>

            {/* Create Event Button */}
            <button
              className="bg-white text-[#ED4A43] border border-[#ED4A43] px-4 py-1.5 text-sm font-medium hover:bg-[#FFF5F4] transition-colors"
              onClick={() => navigate("/createEvent")} 
            >
              CREATE EVENT
            </button>

            {/* Login Button */}
            <button
              className="bg-[#ED4A43] text-white px-4 py-1.5 text-sm font-medium hover:bg-[#D43C35] transition-colors"
              onClick={() => navigate("/login")} 
            >
              LOG IN
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};