import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt, FaHome, FaDownload, FaEnvelope, FaBuilding, FaUsers } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';

export const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [paymentDetail, setPaymentDetail] = useState(null);
  const bookingDetails = {
    bookingNumber: 'VB-20250322-5432',
    venueName: 'Kamaladi Hall',
    eventTitle: 'Annual Conference',
    eventCategory: 'Conference',
    date: 'April 15, 2025',
    location: 'Kamaladi, Kathmandu',
    capacity: 300,
    totalAmount: 4000
  };

  useEffect(() => {
    async function fetchDetail() {
      const id = localStorage.getItem('bookingId');
      try {
        const response = await axios.get(`http://localhost:3000/api/venue-bookings/${id}`);
        setPaymentDetail(response.data.booking);
        localStorage.removeItem('bookingId');
      } catch (error) {
        console.log(error);
      }
    }
    fetchDetail();
  }, []);


  return (
    <div className="bg-gray-50 py-12 px-4 md:px-12 lg:px-20 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Success Card with enhanced visual appeal */}
        <div className="bg-white rounded-xl overflow-hidden shadow-xl transform transition-all animate-fadeIn">
          {/* Enhanced header with wave shape */}
          <div className="relative bg-[#ED4A43] pt-12 pb-16 text-center">
            <div className="relative z-10">
              <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-5 shadow-lg border-4 border-white">
                <FaCheckCircle className="text-[#ED4A43] text-5xl" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Booking Successful!</h1>
              <p className="text-white text-opacity-90 text-lg">Your venue booking has been confirmed</p>
            </div>

            {/* Wave shape at bottom of header */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
                <path
                  fill="#ffffff"
                  fillOpacity="1"
                  d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
                ></path>
              </svg>
            </div>
          </div>

          {/* Booking Details with improved layout */}
          <div className="px-8 pb-8 -mt-6">
            <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
                <span className="inline-block w-8 h-8 rounded-full bg-[#ED4A43] bg-opacity-10 mr-3 flex items-center justify-center">
                  <FaBuilding className="text-[#ED4A43]" />
                </span>
                Booking Details
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Booking Id:</span>
                  <span className="text-gray-800 font-semibold bg-gray-100 px-3 py-1 rounded-full text-sm">{paymentDetail._id}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Venue:</span>
                  <span className="text-gray-800 font-semibold">{paymentDetail.venue.name}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Event Title:</span>
                  <span className="text-gray-800 font-semibold">{paymentDetail.eventDetails.title}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Event Category:</span>
                  <span className="text-gray-800 font-semibold">{paymentDetail.eventDetails.category.name}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium flex items-center">
                    <FaCalendarAlt className="text-[#ED4A43] mr-2" />
                    Date:
                  </span>
                  <span className="text-gray-800 font-semibold">{paymentDetail.eventDetails.date}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium flex items-center">
                    <FaMapMarkerAlt className="text-[#ED4A43] mr-2" />
                    Location:
                  </span>
                  <span className="text-gray-800 font-semibold">{paymentDetail.venue.location}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium flex items-center">
                    <FaUsers className="text-[#ED4A43] mr-2" />
                    Capacity:
                  </span>
                  <span className="text-gray-800 font-semibold">{paymentDetail.venue.capacity} people</span>
                </div>

                <div className="mt-2 pt-4 flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                  <span className="text-gray-800 font-bold">Total Amount:</span>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold text-[#ED4A43]">Rs. {paymentDetail.venue.price.toFixed(2)}</span>
                    <span className="text-xs text-green-600 font-medium">Payment Completed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message box */}
            <div className="bg-[#ED4A43] bg-opacity-5 border border-[#ED4A43] border-opacity-20 rounded-lg p-4 mb-6 flex items-start">
              <FaEnvelope className="text-[#ED4A43] mt-1 mr-3 flex-shrink-0" />
              <p className="text-gray-700">
                A confirmation email has been sent to your registered email address.
                You will be notified once your booking is approved by the venue admin.
              </p>
            </div>

            {/* Action buttons with enhanced design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Link
                to="/mybookings"
                className="py-3.5 bg-[#ED4A43] hover:bg-[#D43C35] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center transform hover:-translate-y-1"
              >
                <FaBuilding className="mr-2" />
                My Bookings
              </Link>

              <Link
                to="/"
                className="py-3.5 bg-white border-2 border-[#ED4A43] text-[#ED4A43] font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center transform hover:-translate-y-1"
              >
                <FaHome className="mr-2" />
                Browse Venues
              </Link>
            </div>

            <button
              className="w-full py-3 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              <FaDownload className="mr-2" />
              Download Booking Details
            </button>
          </div>
        </div>

        {/* Additional message */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>Thank you for using our platform. We hope your event is a great success!</p>
          {sessionId && <p className="mt-2">Session ID: {sessionId}</p>}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;