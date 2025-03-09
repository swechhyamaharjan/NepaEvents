import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-hot-toast";
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { useAuth } from '../../Context/AuthContext.jsx';

export const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData.entries());
    try {
      const res = await axios.post('http://localhost:3000/login', values, {
        withCredentials: true,
      });
      if (res) {
        setUser(res.data);
        toast.success(res.message);
        if (res.data.user.role === "user") {
          navigate('/')
        } else {
          navigate('/admin/home')
        }
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      console.error("Error posting data:", error);
    }
  };

  const handleGuestLogin = () => {
    navigate('/');
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center px-4 bg-[#F9FAFB]">
      <div className="flex flex-col bg-white p-8 sm:p-10 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Log In</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Email address or phone number"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED4A43] text-gray-600"
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED4A43] text-gray-600"
          />
          <button
            type="submit"
            className="w-full py-2 bg-[#ED4A43] text-white font-medium rounded-md hover:bg-[#D43C35] transition"
          >
            Log In
          </button>
        </form>
        <span className="text-center mt-4 text-sm text-red-400 hover:underline cursor-pointer">
          Forgot Password?
        </span>
        <hr className="my-4" />

        {/* Social Authentication Buttons */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-2 bg-[#FFF5F4] text-gray-600 font-medium rounded-md border border-[#ED4A43] hover:bg-white transition"
        >
          <FcGoogle className="text-xl" /> Log in with Google
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-2 bg-[#1877F2] text-white font-medium rounded-md hover:bg-[#145DBF] transition mt-2"
        >
          <FaFacebook className="text-xl" /> Log in with Facebook
        </button>

        <button
          type="button"
          className="w-full py-2 bg-[#FFF5F4] text-gray-600 font-medium rounded-md border border-[#ED4A43] hover:bg-white mt-4"
          onClick={() => navigate('/signup')}
        >
          Create Account
        </button>
        <button
          type="button"
          className="w-full py-2 bg-[#F1F1F1] text-gray-600 font-medium rounded-md border border-[#ED4A43] hover:bg-white mt-4"
          onClick={handleGuestLogin}
        >
          Log in as Guest
        </button>
      </div>
    </div>
  );
};