import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-hot-toast";
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

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
      <div className="flex flex-col bg-white p-8 sm:p-10 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Create an Account</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            id='fullName'
            name="fullName"
            placeholder="Full Name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED4A43] text-gray-600"
          />
          <input
            type="email"
            id='email'
            name="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED4A43] text-gray-600"
          />
          <input
            id='password'
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED4A43] text-gray-600"
          />
          
          {/* Role Selection */}
          <div className="relative">
            <label className="block text-gray-600 mb-1">Select Role</label>
            <select name="role" id="role" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED4A43] text-gray-600">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#ED4A43] text-white font-medium rounded-md hover:bg-[#D43C35] transition"
          >
            Sign Up
          </button>
        </form>

        <span className="text-center mt-4 text-sm text-gray-600">
          By signing up, you agree to our Terms & Conditions.
        </span>
        <hr className="my-4" />

        {/* Social Authentication Buttons */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-2 bg-[#FFF5F4] text-gray-600 font-medium rounded-md border border-[#ED4A43] hover:bg-white transition"
        >
          <FcGoogle className="text-xl" /> Sign up with Google
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-2 bg-[#1877F2] text-white font-medium rounded-md hover:bg-[#145DBF] transition mt-2"
        >
          <FaFacebook className="text-xl" /> Sign up with Facebook
        </button>
        
        <button
          type="button"
          className="w-full py-2 bg-[#FFF5F4] text-gray-600 font-medium rounded-md border border-[#ED4A43] hover:bg-white mt-4"
          onClick={() => navigate('/login')}
        >
          Already have an account? Sign In
        </button>
      </div>
    </div>
  );
};
