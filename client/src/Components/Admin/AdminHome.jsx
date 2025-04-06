import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export const AdminHome = () => {
const navigate = useNavigate();
const {user} = useAuth();

// Logout function
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/logout", {}, { withCredentials: true });
      localStorage.clear();
      toast.success("Logged out successfully");
      navigate("/login");
      window.location.reload();
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to logout.";
      toast.error(errorMessage);
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:30px_30px] pointer-events-none" />
      
      {/* Admin Header */}
      <div className='w-full flex items-center justify-end pb-10'>
        <div className='mr-8 bg-white px-6 py-3 rounded-lg shadow-md'>
          <h2 className="text-gray-700 font-medium">Welcome, <span className="text-gray-900 font-bold">{user?.fullName}</span></h2>
        </div>
        <button 
          className='logoutbtn bg-[#ED4A43] text-white py-3 px-8 rounded-lg shadow-md hover:shadow-lg hover:bg-opacity-90 transition-all duration-300' 
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* Total Events */}
        <div className="bg-white text-gray-800 p-8 rounded-lg shadow-md border-l-4 border-[#ED4A43] hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold uppercase tracking-wider">Total Events</h2>
            <div className="bg-[#ED4A43] p-2 rounded-full">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-6xl font-bold mt-4 text-gray-900">1</p>
          <div className="mt-4 h-1 w-full bg-gray-200 rounded-full">
            <div className="h-1 w-2/3 bg-[#ED4A43] rounded-full"></div>
          </div>
        </div>
        
        {/* Total Users */}
        <div className="bg-white text-gray-800 p-8 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold uppercase tracking-wider">Total Users</h2>
            <div className="bg-blue-500 p-2 rounded-full">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
          </div>
          <p className="text-6xl font-bold mt-4 text-gray-900">11</p>
          <div className="mt-4 h-1 w-full bg-gray-200 rounded-full">
            <div className="h-1 w-1/2 bg-blue-500 rounded-full"></div>
          </div>
        </div>
        
        {/* Pending Payments */}
        <div className="bg-white text-gray-800 p-8 rounded-lg shadow-md border-l-4 border-amber-500 hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold uppercase tracking-wider">Pending Payments</h2>
            <div className="bg-amber-500 p-2 rounded-full">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-6xl font-bold mt-4 text-gray-900">2,000</p>
          <div className="mt-4 h-1 w-full bg-gray-200 rounded-full">
            <div className="h-1 w-3/4 bg-amber-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* Event Attendance */}
        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-bold text-[#ED4A43]">Event Attendance</h2>
            <div className="bg-gray-100 rounded-full p-2">
              <svg className="w-5 h-5 text-[#ED4A43]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
          </div>
          <p className="text-5xl font-bold text-gray-900 mt-6">50</p>
          <div className="mt-6 flex items-center space-x-2">
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div className="h-2 w-2/3 bg-[#ED4A43] rounded-full"></div>
            </div>
            <span className="text-xs text-gray-500">67%</span>
          </div>
          <p className="text-sm mt-4 text-gray-600">Total attendance across all events</p>
        </div>

        {/* New Users */}
        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-bold text-blue-500">New Users</h2>
            <div className="bg-gray-100 rounded-full p-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </div>
          </div>
          <p className="text-5xl font-bold text-gray-900 mt-6">5</p>
          <div className="mt-6 flex items-center space-x-2">
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div className="h-2 w-1/2 bg-blue-500 rounded-full"></div>
            </div>
            <span className="text-xs text-gray-500">50%</span>
          </div>
          <p className="text-sm mt-4 text-gray-600">New signups this week</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-bold text-amber-500">Total Revenue</h2>
            <div className="bg-gray-100 rounded-full p-2">
              <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-5xl font-bold text-gray-900 mt-6">1000</p>
          <div className="mt-6 flex items-center space-x-2">
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div className="h-2 w-3/4 bg-amber-500 rounded-full"></div>
            </div>
            <span className="text-xs text-gray-500">75%</span>
          </div>
          <p className="text-sm mt-4 text-gray-600">Revenue from ticket sales</p>
        </div>
      </div>
    </div>
  );
};