import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle, FaSignOutAlt, FaCog, FaEdit } from "react-icons/fa";
import logo from "./logo.png";
import { useAuth } from "../../Context/AuthContext";

export const NavBar = () => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("home");
  const [profileOpen, setProfileOpen] = useState(false);
  const { user } = useAuth();

  const handleNavClick = (link) => {
    setActiveLink(link);
    navigate(`/${link}`);
  };

  const toggleProfileMenu = () => {
    setProfileOpen(!profileOpen);
  };

  return (
    <nav className="bg-white text-[#697787] shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-12 h-12" />
          <h1 className="ml-3 text-xl font-semibold text-[#ED4A43]">NepaEvents</h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          {["HomePage", "Event", "AboutUs", "ContactUs"].map((link) => (
            <button
              key={link}
              className={`text-lg capitalize ${activeLink === link ? "text-[#ED4A43] font-semibold" : "hover:text-[#ED4A43]"
                }`}
              onClick={() => handleNavClick(link)}
            >
              {link.replace(/([A-Z])/g, " $1").trim()}
            </button>
          ))}
        </div>

        {/* Action Buttons & Profile */}
        {user && (
          <div className="flex items-center space-x-6">
            {/* Notifications */}
            <button className="relative p-2 text-[#697787] hover:text-[#ED4A43]">
              <FaBell size={22} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button onClick={toggleProfileMenu} className="p-2 text-[#697787] hover:text-[#ED4A43]">
                <FaUserCircle size={24} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100" onClick={() => navigate("/profile")}>
                    <FaEdit /> Edit Profile
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100" onClick={() => navigate("/settings")}>
                    <FaCog /> Settings
                  </button>
                  <hr />
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-500 hover:bg-gray-100" onClick={() => navigate("/logout")}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
            <button className='logoutbtn bg-[#ED4A43] text-white py-4 px-6 rounded-lg'>Create Event</button>
            <button className='logoutbtn text-[#ED4A43] bg-white py-4 px-6 rounded-lg border border-[#ED4A43]'>Book Venue</button>
          </div>
        )}
      </div>
    </nav>
  );
};