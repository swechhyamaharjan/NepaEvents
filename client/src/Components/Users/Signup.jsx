import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-hot-toast";

export const Signup = () => {
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData.entries());
    try {
      const { data } = await axios.post('http://localhost:3000/register', values);
      if (data) {
        toast.success(data.message);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      console.error("Error posting data:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center px-4 bg-[#F9FAFB]">

      {/* Right Section */}
      <div className="flex flex-col bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            id='fullName'
            name="fullName"
            placeholder="Full Name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED4A43]"
          />
          <input
            type="email"
            id='email'
            name="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED4A43]"
          />
          <input
            id='password'
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED4A43]"
          />
          {/* <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED4A43]"
          /> */}
          <button
            type="submit"
            className="w-full py-2 bg-[#ED4A43] text-white font-medium rounded-md hover:bg-[#D43C35]"
          >
            Sign Up
          </button>
        </form>
        <span className="text-center mt-4 text-sm text-[#697787]">
          By signing up, you agree to our Terms & Conditions.
        </span>
        <hr className="my-4" />
        <button
          type="button"
          className="w-full py-2 bg-[#FFF5F4] text-[#697787] font-medium rounded-md border border-[#ED4A43] hover:bg-white"
          onClick={() => navigate('/')}
        >
          Already have an account? Sign In
        </button>
      </div>
    </div>
  );
};
