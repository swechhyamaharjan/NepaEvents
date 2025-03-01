import React from 'react';
import { useNavigate } from 'react-router-dom';

export const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* Admin Stats */}
      <div className='w-full flex items-center justify-end pb-8'>
        <div className='mr-10'>
          <h2>Welcome, Swekchya</h2>
        </div>
      <button className='logoutbtn bg-[#ED4A43] text-white py-4 px-6 rounded-lg'>Logout</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
        {/* Total Events */}
        <div className="bg-gradient-to-r from-[#ED4A43] to-[#FF7D70] text-white p-12 rounded-lg shadow-lg hover:scale-105 transition-transform">
          <h2 className="text-3xl font-semibold">Total Events</h2>
          <p className="text-6xl font-bold mt-4">15</p>
        </div>
        {/* Total Users */}
        <div className="bg-gradient-to-r from-[#4A90E2] to-[#6EC5FF] text-white p-12 rounded-lg shadow-lg hover:scale-105 transition-transform">
          <h2 className="text-3xl font-semibold">Total Users</h2>
          <p className="text-6xl font-bold mt-4">50</p>
        </div>
        {/* Pending Payments */}
        <div className="bg-gradient-to-r from-[#F9C74F] to-[#FFD34E] text-white p-12 rounded-lg shadow-lg hover:scale-105 transition-transform">
          <h2 className="text-3xl font-semibold">Pending Payments</h2>
          <p className="text-6xl font-bold mt-4">2,000</p>
        </div>
      </div>

       {/* Analytics Section */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
        {/* Event Attendance */}
        <div className="bg-white p-8 rounded-lg shadow-lg hover:scale-105 transition-transform">
          <h2 className="text-2xl font-semibold text-[#ED4A43]">Event Attendance</h2>
          <p className="text-5xl font-bold mt-4">1,000</p>
          <p className="text-lg mt-2 text-gray-600">Total attendance across all events</p>
        </div>

        {/* New Users */}
        <div className="bg-white p-8 rounded-lg shadow-lg hover:scale-105 transition-transform">
          <h2 className="text-2xl font-semibold text-[#4A90E2]">New Users</h2>
          <p className="text-5xl font-bold mt-4">20</p>
          <p className="text-lg mt-2 text-gray-600">New signups this week</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-8 rounded-lg shadow-lg hover:scale-105 transition-transform">
          <h2 className="text-2xl font-semibold text-[#F9C74F]">Total Revenue</h2>
          <p className="text-5xl font-bold mt-4">10,500</p>
          <p className="text-lg mt-2 text-gray-600">Revenue from ticket sales</p>
        </div>
      </div>
    </div>
  );
};
