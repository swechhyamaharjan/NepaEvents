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
        toast.success("Logged in successfully");
        if (res.data.user.role === "user") {
          navigate('/')
          window.location.reload();
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg backdrop-blur-sm bg-white/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header Section with Wave Design */}
        <div className="relative h-32 bg-gradient-to-r from-[#ED4A43] to-[#F27A74]">
          <div className="absolute bottom-0 left-0 w-full">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0V120Z" fill="white" fillOpacity="0.8" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white absolute top-8 left-0 w-full text-center">Welcome Back</h2>
        </div>

        {/* Form Section */}
        <div className="px-8 py-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="text"
                id="email"
                name="email"
                placeholder=" "
                className="w-full bg-transparent pt-5 pb-2 px-3 border-b-2 border-gray-300 focus:border-[#ED4A43] focus:outline-none peer transition"
              />
              <label htmlFor="email" className="absolute left-3 top-4 text-gray-500 transition-all duration-300 transform -translate-y-3 scale-75 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#ED4A43]">
                Email address or phone number
              </label>
            </div>
            
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                placeholder=" "
                className="w-full bg-transparent pt-5 pb-2 px-3 border-b-2 border-gray-300 focus:border-[#ED4A43] focus:outline-none peer transition"
              />
              <label htmlFor="password" className="absolute left-3 top-4 text-gray-500 transition-all duration-300 transform -translate-y-3 scale-75 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#ED4A43]">
                Password
              </label>
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-[#ED4A43] text-white font-medium rounded-full hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
            >
              Sign In
            </button>
          </form>
          
          <div className="text-right mt-2">
            <span className="text-sm text-[#ED4A43] font-medium hover:text-red-700 cursor-pointer">
              Forgot Password?
            </span>
          </div>
          
          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <div className="px-3 text-sm text-gray-500">or continue with</div>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          {/* Social Authentication */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 bg-[#FFF5F4] text-gray-700 font-medium rounded-full border border-[#ED4A43] hover:bg-white hover:shadow-md transition"
            >
              <FcGoogle className="text-xl" /> Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 bg-[#1877F2] text-white font-medium rounded-full hover:bg-blue-700 hover:shadow-md transition"
            >
              <FaFacebook className="text-xl" /> Facebook
            </button>
          </div>
          
          {/* Additional Options */}
          <div className="space-y-3 mt-5">
            <button
              type="button"
              className="w-full py-2.5 bg-[#ED4A43] text-white font-medium rounded-full hover:shadow-lg transition duration-300"
              onClick={() => navigate('/signup')}
            >
              Create New Account
            </button>
            <button
              type="button"
              className="w-full py-2.5 bg-[#FFF5F4] text-gray-700 font-medium rounded-full border border-[#ED4A43] hover:bg-white transition"
              onClick={handleGuestLogin}
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
