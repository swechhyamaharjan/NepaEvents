import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png";

export const NavBar = () => {
  const navigate = useNavigate();
  
  // State to track active link
  const [activeLink, setActiveLink] = useState('home');

  const handleNavClick = (link) => {
    setActiveLink(link);
    if (link === 'home') {
      navigate("/HomePage"); 
    } else if (link === 'events') {
      navigate("/Event"); 
    }
    else if (link === 'aboutus') {
      navigate("/AboutUs"); 
    }
    else if (link === 'contactus') {
      navigate("/ContactUs"); 
    }
  };

  return (
    <nav className="bg-white text-[#697787]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-12 h-12" />
          <h1 className="ml-3 text-xl font-semibold text-[#ED4A43]">NepaEvents</h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <a
            href="#home"
            className={`text-lg ${activeLink === 'home' ? 'text-[#ED4A43] font-semibold' : 'hover:text-[#ED4A43]'}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
          >
            Home
          </a>
          <a
            href="#events"
            className={`text-lg ${activeLink === 'events' ? 'text-[#ED4A43] font-semibold' : 'hover:text-[#ED4A43]'}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('events');
            }}
          >
            Events
          </a>
          <a
            href="#aboutus"
            className={`text-lg ${activeLink === 'aboutus' ? 'text-[#ED4A43] font-semibold' : 'hover:text-[#ED4A43]'}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('aboutus');
            }}
          >
            About Us
          </a>
          <a
            href="#contactus"
            className={`text-lg ${activeLink === 'contactus' ? 'text-[#ED4A43] font-semibold' : 'hover:text-[#ED4A43]'}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('contactus');
            }}
          >
            Contact Us
          </a>
        </div>

        {/* Action Buttons */}
        <div className="space-x-4">
          <button
            onClick={() => navigate("/CreateEvent")}
            className="bg-[#ED4A43] text-white px-6 py-2 rounded-md hover:bg-[#D43C35]"
          >
            Create Event
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-[#FFF5F4] text-[#697787] px-6 py-2 rounded-md border border-[#ED4A43] hover:bg-white"
          >
            Book a venue
          </button>
        </div>
      </div>
    </nav>
  );
};
