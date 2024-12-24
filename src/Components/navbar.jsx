import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png";

export const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white text-[#697787]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-12 h-12" />
          <h1 className="ml-3 text-xl font-semibold text-[#ED4A43]">
            NepaEvents
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <a
            href="#home"
            className="text-lg hover:text-[#ED4A43]"
            onClick={(e) => {
              e.preventDefault(); 
              navigate("/HomePage"); // Navigate to home page
            }}
          >
            Home
          </a>
          <a href="#events" className="text-lg hover:text-[#ED4A43]"
          onClick={(e) => {
            e.preventDefault(); 
            navigate("/Event"); // Navigate to event page
          }}>
            Events
          </a>
          <a href="#about" className="text-lg hover:text-[#ED4A43]">
            About Us
          </a>
          <a href="#contact" className="text-lg hover:text-[#ED4A43]">
            Contact Us
          </a>
        </div>

        {/* Action Buttons */}
        <div className="space-x-4">
          <button
            onClick={() => navigate("/create-event")}
            className="bg-[#ED4A43] text-white px-6 py-2 rounded-md hover:bg-[#D43C35]"
          >
            Create Event
          </button>
          <button
            onClick={() => navigate("/book")}
            className="bg-[#FFF5F4] text-[#697787] px-6 py-2 rounded-md border border-[#ED4A43] hover:bg-white"
          >
            Book a venue
          </button>
        </div>
      </div>
    </nav>
  );
};
