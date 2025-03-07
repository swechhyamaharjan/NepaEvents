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
    <nav className="bg-white text-[#697787] shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="w-12 h-12" />
          <h1 className="text-2xl font-bold text-[#ED4A43]">NepaEvents</h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-10 font-medium fontsize-lg">
          {["Home", "Event", "Venue", "AboutUs", "ContactUs"].map((link) => (
            <button
              key={link}
              className={`${
                activeLink === link ? "text-[#ED4A43]" : "hover:text-[#ED4A43]"
              }`}
              onClick={() => handleNavClick(link)}
            >
              {link.replace(/([A-Z])/g, " $1").trim()}
            </button>
          ))}
        </div>

        {/* Action Buttons & Profile */}
        <div className="flex items-center space-x-2">
          {/* Favorite Icon */}
          <button className="p-2 text-[#697787] hover:text-[#ED4A43]">
            <FiHeart size={22} />
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-[#697787] hover:text-[#ED4A43]">
            <FaBell size={22} />
          </button>

          {/* Buttons */}
          <button
            className="bg-[#ED4A43] text-white flex items-center gap-2 py-2 px-6 rounded-full shadow-md hover:bg-red-600 transition"
            onClick={() => navigate("/createEvent")} 
          >
            📅 CREATE EVENT
          </button>

          <button
            className="text-[#ED4A43] border border-[#ED4A43] flex items-center gap-2 py-2 px-6 rounded-full shadow-md hover:bg-[#ED4A43] hover:text-white transition"
            onClick={() => navigate("/login")} 
          >
            👤 LOG IN
          </button>
        </div>
      </div>
    </nav>
  );
};
