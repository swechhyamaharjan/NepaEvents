import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('All');
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user?._id) return;

    async function fetchBooking() {
      try {
        const response = await axios.get('http://localhost:3000/api/venue-bookings');
        const currentUserBooking = response?.data?.bookings?.filter(
          (booking) => booking?.organizer?._id === user?._id
        );
        setBookings(currentUserBooking || []);
      } catch (error) {
        console.log('Error fetching bookings:', error);
      }
    }

    fetchBooking();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return '✓';
      case 'pending':
        return '⏱';
      case 'rejected':
        return '✕';
      default:
        return '';
    }
  };

  const handleStripePayment = async (id) => {
    try {
      const response = await axios.post('http://localhost:3000/api/venue-bookings/pay', { bookingId: id });
      localStorage.setItem('bookingId', id);
      window.open(response.data.url, '_blank');
    } catch (error) {
      console.log(error);
    }
  };

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

        <div className="space-y-6">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div
                key={booking?._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="border-l-4 border-l-[#ED4A43] p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {booking?.eventDetails?.title || 'Unknown Event'}
                      </h2>
                      <div className="flex items-center text-gray-600 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {booking?.venue?.location || 'Unknown Location'}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {booking?.eventDetails?.date ? new Date(booking.eventDetails.date).toLocaleDateString() : 'Unknown Date'}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(booking?.status)}`}>
                      <span className="mr-1">{getStatusIcon(booking?.status)}</span>
                      {booking?.paymentStatus === "paid" ? "Venue Booked" : booking?.status || 'Unknown Status'}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    {booking?.status === 'approved' && booking?.paymentStatus === 'pending' ? (
                      <button
                        className="px-4 py-2 text-sm bg-[#ED4A43] text-white rounded hover:bg-red-600"
                        onClick={() => handleStripePayment(booking?._id)}
                      >
                        Pay Now
                      </button>
                    ) : null}
                    {booking?.paymentStatus === "paid" && (
                      <button
                        className="px-4 py-2 text-sm bg-[#ED4A43] text-white rounded hover:bg-red-600"
                        onClick={() => navigate(`/eventRevenue/${booking.eventDetails.title}`)}
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No bookings found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBooking;