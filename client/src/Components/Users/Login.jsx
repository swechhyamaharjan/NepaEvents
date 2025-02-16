import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-hot-toast"; 

export const Login = () => {
  const navigate = useNavigate(); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData.entries());
    try {
      const { data } = await axios.post('http://localhost:3000/login', values);
      if (data) {
        toast.success(data.message);
        navigate('/homepage')
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      console.error("Error posting data:", error);
    }
  }
  
  const handleGuestLogin = () => {
    console.log("Logged in as a guest");
    navigate('/homepage'); // Redirect to homepage 
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center px-4 bg-[#F9FAFB]"> {/* h-screen: makes div take full height of the viewport (100vh) */}

      {/* Right Section */}
      <div className="flex flex-col bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
        <form className="space-y-4"  onSubmit={handleSubmit}>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Email address or phone number"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED4A43]"
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED4A43]"
          />
          <button
            type="submit"
            className="w-full py-2 bg-[#ED4A43] text-white font-medium rounded-md hover:bg-[#D43C35]"
          >
            Log In
          </button>
        </form>
        <span className="text-center mt-4 text-sm text-red-400 hover:underline cursor-pointer">
          Forgot Password?
        </span>
        <hr className="my-4" />

        {/* Create Account Button */}
        <button
          type="button"
          className="w-full py-2 bg-[#FFF5F4] text-[#697787] font-medium rounded-md border border-[#ED4A43] hover:bg-white"
          onClick={() => navigate('/signup')} 
        >
          Create Account
        </button>

        {/* Guest Login Button */}
        <button
          type="button"
          className="w-full py-2 bg-[#F1F1F1] text-[#697787] font-medium rounded-md border border-[#ED4A43] hover:bg-white mt-4"
          onClick={handleGuestLogin}
        >
          Log in as Guest
        </button>
      </div>
    </div>
  );
};
