import React, { useState } from 'react';

const MyBooking = () => {
  // Sample booking data (replace with real data from your backend or state)
  const initialBookings = [
    {
      id: 1,
      eventName: "Summer Music Festival",
      location: "Central Park, New York",
      date: "2023-08-15",
      time: "14:00 - 22:00",
      status: "Confirmed",
    },
    {
      id: 2,
      eventName: "Tech Conference 2023",
      location: "San Francisco, CA",
      date: "2023-09-20",
      time: "09:00 - 17:00",
      status: "Pending",
    },
    {
      id: 3,
      eventName: "Art Exhibition",
      location: "London, UK",
      date: "2023-10-05",
      time: "10:00 - 18:00",
      status: "Cancelled",
    },
  ];

  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState('All');

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
        return "✓";
      case "Pending":
        return "⏱";
      case "Cancelled":
        return "✕";
      default:
        return "";
    }
  };

  // Filter bookings based on selected filter
  const filteredBookings = filter === 'All' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <div className="bg-white rounded-lg shadow px-4 py-2">
            <span className="text-sm text-gray-600 mr-2">Filter:</span>
            <select 
              className="text-sm border-0 focus:ring-0"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>All</option>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>
        
        {filteredBookings.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="border-l-4 border-l-[#ED4A43] p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {booking.eventName}
                      </h2>
                      <div className="flex items-center text-gray-600 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {booking.location}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(booking.date).toLocaleDateString()} 
                        <span className="mx-1">•</span> 
                        {booking.time}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      <span className="mr-1">{getStatusIcon(booking.status)}</span>
                      {booking.status}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    {booking.status !== "Cancelled" && (
                      <button className="px-4 py-2 text-sm bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                        View Details
                      </button>
                    )}
                    {booking.status === "Confirmed" && (
                      <button className="px-4 py-2 text-sm bg-[#ED4A43] text-white rounded hover:bg-red-600">
                        Download Ticket
                      </button>
                    )}
                    {booking.status === "Pending" && (
                      <button className="px-4 py-2 text-sm bg-[#ED4A43] text-white rounded hover:bg-red-600">
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooking;