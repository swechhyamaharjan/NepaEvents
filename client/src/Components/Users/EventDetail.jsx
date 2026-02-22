import React, { useState, useEffect } from 'react';
import api from "../../api/api";
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaArrowLeft, FaInfoCircle, FaFileAlt } from 'react-icons/fa';
import VenueLocationMap from '../VenueLocationMap';

export const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await api.get(`/api/event/${id}`);
        setEvent(response.data.event);
      } catch (error) {
        console.log(error);
      }
    }
    if (id) fetchEvent();
  }, [id]); // Added 'id' as a dependency

  const handleTicketChange = (count) => {
    setTicketCount(Math.max(1, count));
  };

  if (!event) {
    return <div className="text-center py-10 text-xl">Loading event details...</div>;
  }

  const totalPrice = ticketCount * event.price;

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-800">
        <img
          src={`${api.defaults.baseURL}/${event.image}`}
          alt={event.title}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <Link to="/event" className="inline-flex items-center text-white bg-[#ED4A43]/80 hover:bg-[#ED4A43] px-4 py-2 rounded-lg mb-4 transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to Events
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{event.title}</h1>

          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
              <FaCalendarAlt className="text-[#ED4A43] mr-2" />
              <span>{new Date(event.date).toLocaleString()}</span>
            </div>
            <div className="flex items-center bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
              <FaMapMarkerAlt className="text-[#ED4A43] mr-2" />
              <span>{event.venue.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex border-b">
                {['description', 'details', 'terms'].map((tab) => (
                  <button
                    key={tab}
                    className={`flex-1 py-4 px-6 font-semibold text-center transition-colors ${activeTab === tab ? 'text-[#ED4A43] border-b-2 border-[#ED4A43]' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'description' && (
                  <div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Event</h2>
                      <p className="text-gray-700 leading-relaxed">{event.description}</p>
                    </div>
                    <div>
                      {console.log(event)};
                      <VenueLocationMap existingCoordinates={event.venue.locationCoordinates} />
                    </div>
                  </div>
                )}
                {activeTab === 'details' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                      <FaInfoCircle className="text-[#ED4A43] mr-2" />
                      Event Details
                    </h2>
                    <p className="text-gray-700">Category: {event.category}</p>
                    <p className="text-gray-700">Organizer: {event.organizer.fullName}</p>
                  </div>
                )}
                {activeTab === 'terms' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                      <FaFileAlt className="text-[#ED4A43] mr-2" />
                      Terms & Conditions
                    </h2>
                    <p className="text-gray-700">No refund after booking. Event rules apply.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ticket Booking */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-6">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Book Tickets</h2>
                <div className="flex items-center text-lg text-[#ED4A43] font-bold">
                  ${event.price.toFixed(2)} <span className="text-gray-500 text-sm font-normal ml-1">per ticket</span>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Ticket quantity */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Number of Tickets</label>
                  <div className="flex items-center justify-between">
                    <button
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      onClick={() => handleTicketChange(ticketCount - 1)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={ticketCount}
                      onChange={(e) => handleTicketChange(parseInt(e.target.value))}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md text-gray-800 text-center"
                    />
                    <button
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      onClick={() => handleTicketChange(ticketCount + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price calculation */}
                <div className="space-y-2 pt-3 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price ({ticketCount} tickets)</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Book button */}
                <button className="w-full py-4 bg-[#ED4A43] hover:bg-[#D43C35] text-white font-bold rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center text-lg">
                  <FaTicketAlt className="mr-2" />
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EventDetail;
