import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import logo from './logo.png';

export const Signup = () => {
  const navigate = useNavigate(); 

  return (
    <div className="container flex flex-col md:flex-row justify-center items-center mt-12 md:mt-48 px-4">
      {/* Left Section */}
      <div className="left text-center mb-8 md:mb-0 md:mr-8">
        <img className="w-40 sm:w-48 md:w-60 mx-auto" src={logo} alt="Logo" />
        <p className="mt-2 text-gray-700 text-sm sm:text-base">
          Your Ultimate Event Booking
        </p>
      </div>

      {/* Right Section */}
      <div className="right flex flex-col bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            type="submit"
            className="w-full py-2 bg-pink-400 text-white font-medium rounded-md hover:bg-pink-500"
          >
            Sign Up
          </button>
        </form>
        <span className="text-center mt-4 text-sm text-blue-500 hover:underline cursor-pointer">
          By signing up, you agree to our Terms & Conditions.
        </span>
        <hr className="my-4" />
        <button
          type="button"
          className="w-full py-2 bg-purple-500 text-white font-medium rounded-md hover:bg-purple-500"
          onClick={() => navigate('/login')} 
        >
          Already have an account? Sign In
        </button>
      </div>
    </div>
  );
};
