import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-hot-toast";
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

export const Signup = () => {
  const navigate = useNavigate();
  
  const interestsOptions = [
    "music", "sports", "art", "technology", "food", 
    "education", "outdoor", "entertainment", "business", "other"
  ];

  const [showInterestModal, setShowInterestModal] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [selectedInterests, setSelectedInterests] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData.entries());
    setFormValues(values);
    setShowInterestModal(true); // Show interest selection popup
  };

  const handleFinalSubmit = async () => {
    const valuesWithInterests = {
      ...formValues,
      interests: selectedInterests
    };

    try {
      const { data } = await axios.post('http://localhost:3000/register', valuesWithInterests);
      if (data) {
        toast.success(data.message);
        setShowInterestModal(false);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      console.error("Error posting data:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg backdrop-blur-sm bg-white/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-r from-[#ED4A43] to-[#F27A74]">
          <div className="absolute bottom-0 left-0 w-full">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0V120Z" fill="white" fillOpacity="0.8" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white absolute top-8 left-0 w-full text-center">Create an Account</h2>
        </div>

        {/* Form */}
        <div className="px-8 py-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder=" "
                className="w-full bg-transparent pt-5 pb-2 px-3 border-b-2 border-gray-300 focus:border-[#ED4A43] focus:outline-none peer transition"
              />
              <label htmlFor="fullName" className="absolute left-3 top-4 text-gray-500 transition-all duration-300 transform -translate-y-3 scale-75 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#ED4A43]">
                Full Name
              </label>
            </div>

            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                placeholder=" "
                className="w-full bg-transparent pt-5 pb-2 px-3 border-b-2 border-gray-300 focus:border-[#ED4A43] focus:outline-none peer transition"
              />
              <label htmlFor="email" className="absolute left-3 top-4 text-gray-500 transition-all duration-300 transform -translate-y-3 scale-75 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#ED4A43]">
                Email Address
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

            <div className="relative pt-3">
              <label className="block text-gray-600 text-sm mb-1">Select Role</label>
              <select 
                name="role" 
                id="role" 
                className="w-full bg-transparent py-2 px-3 border-b-2 border-gray-300 focus:border-[#ED4A43] focus:outline-none transition appearance-none rounded-none text-gray-700"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#ED4A43] text-white font-medium rounded-full hover:shadow-lg transition duration-300 transform hover:-translate-y-1 mt-4"
            >
              Sign Up
            </button>
          </form>

          <div className="text-center mt-2">
            <span className="text-sm text-gray-600">
              By signing up, you agree to our Terms & Conditions.
            </span>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <div className="px-3 text-sm text-gray-500">or continue with</div>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

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

          <div className="mt-5">
            <button
              type="button"
              className="w-full py-2.5 bg-[#FFF5F4] text-gray-700 font-medium rounded-full border border-[#ED4A43] hover:bg-white transition"
              onClick={() => navigate('/login')}
            >
              Already have an account? Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Interests */}
      {showInterestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full">
            <h3 className="text-xl font-semibold text-center mb-4">Choose Your Interests</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {interestsOptions.map((interest) => (
                <label key={interest} className={`flex items-center justify-center py-2 px-3 border rounded-full cursor-pointer transition
                  ${selectedInterests.includes(interest)
                    ? 'bg-[#FFF5F4] text-[#ED4A43] border-[#ED4A43]'
                    : 'bg-white text-gray-700 border-gray-300'}
                `}>
                  <input
                    type="checkbox"
                    value={interest}
                    className="hidden"
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      setSelectedInterests(prev =>
                        checked ? [...prev, value] : prev.filter(i => i !== value)
                      );
                    }}
                    checked={selectedInterests.includes(interest)}
                  />
                  {interest.charAt(0).toUpperCase() + interest.slice(1)}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowInterestModal(false)}
                className="py-2 px-4 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalSubmit}
                className="py-2 px-4 bg-[#ED4A43] text-white rounded-full hover:shadow-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
