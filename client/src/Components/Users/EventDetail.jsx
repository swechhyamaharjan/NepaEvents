import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaClock, FaArrowLeft, FaInfoCircle, FaFileAlt } from 'react-icons/fa';
import eventImage from "/public/images/event1.png";

export const EventDetail = () => {
  const { id } = useParams();
  
  // Mock event data (in a real app this would be fetched based on the id)
  const event = {
    id: parseInt(id) || 1,
    img: eventImage,
    name: "Concert X",
    date: "December 31, 2024",
    time: "7:00 PM - 10:00 PM",
    location: "Hyatt Regency",
    address: "Boudha Sadak, Kathmandu",
    price: 100,
    description: "Join us for an unforgettable night of music and entertainment at Concert X. This will be the biggest event of the year featuring top artists and performers. Don't miss out on this once-in-a-lifetime experience!",
    details: [
      "Doors open at 6:00 PM",
      "VIP guests will have early entry at 5:30 PM",
      "Food and beverages will be available for purchase",
      "Limited parking available, we recommend using ride-sharing services",
      "Event is suitable for all ages, but minors must be accompanied by an adult"
    ],
    terms: [
      "No refunds or exchanges once tickets are purchased",
      "Event will proceed rain or shine",
      "Management reserves the right to refuse entry",
      "Professional cameras and recording equipment are not permitted",
      "Tickets are non-transferable and must be presented at entry"
    ]
  };

  const [ticketCount, setTicketCount] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleTicketChange = (count) => {
    setTicketCount(count);
  };

  const handlePromoCode = () => {
    if (promoCode === 'DISCOUNT10') {
      setDiscount(10);
    } else if (promoCode === 'GROUPDISCOUNT') {
      setDiscount(20);
    } else {
      setDiscount(0);
    }
  };

  const applyGroupDiscount = (ticketCount) => (ticketCount >= 5 ? 20 : 0);
  
  const groupDiscount = applyGroupDiscount(ticketCount);
  const finalDiscount = Math.max(discount, groupDiscount);
  const totalPrice = ticketCount * event.price * (1 - finalDiscount / 100);

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-800">
        <img 
          src={event.img} 
          alt={event.name} 
          className="w-full h-full object-cover opacity-70" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <Link to="/event" className="inline-flex items-center text-white bg-[#ED4A43]/80 hover:bg-[#ED4A43] px-4 py-2 rounded-lg mb-4 transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to Events
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{event.name}</h1>
          
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
              <FaCalendarAlt className="text-[#ED4A43] mr-2" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
              <FaClock className="text-[#ED4A43] mr-2" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
              <FaMapMarkerAlt className="text-[#ED4A43] mr-2" />
              <span>{event.location}</span>
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
                <button 
                  className={`flex-1 py-4 px-6 font-semibold text-center transition-colors ${
                    activeTab === 'description' ? 'text-[#ED4A43] border-b-2 border-[#ED4A43]' : 'text-gray-500 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button 
                  className={`flex-1 py-4 px-6 font-semibold text-center transition-colors ${
                    activeTab === 'details' ? 'text-[#ED4A43] border-b-2 border-[#ED4A43]' : 'text-gray-500 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveTab('details')}
                >
                  Event Details
                </button>
                <button 
                  className={`flex-1 py-4 px-6 font-semibold text-center transition-colors ${
                    activeTab === 'terms' ? 'text-[#ED4A43] border-b-2 border-[#ED4A43]' : 'text-gray-500 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveTab('terms')}
                >
                  Terms & Conditions
                </button>
              </div>
              
              <div className="p-6">
                {activeTab === 'description' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Event</h2>
                    <p className="text-gray-700 leading-relaxed">{event.description}</p>
                  </div>
                )}
                
                {activeTab === 'details' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                      <FaInfoCircle className="text-[#ED4A43] mr-2" />
                      Event Details
                    </h2>
                    <ul className="space-y-3">
                      {event.details.map((detail, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-[#ED4A43] rounded-full mt-2 mr-3"></span>
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {activeTab === 'terms' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                      <FaFileAlt className="text-[#ED4A43] mr-2" />
                      Terms & Conditions
                    </h2>
                    <ul className="space-y-3">
                      {event.terms.map((term, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-[#ED4A43] rounded-full mt-2 mr-3"></span>
                          <span className="text-gray-700">{term}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {/* Location */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaMapMarkerAlt className="text-[#ED4A43] mr-2" />
                  Location
                </h2>
                <p className="text-gray-700 mb-4">{event.location} - {event.address}</p>
                
                {/* This would be a real map in production */}
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 font-medium">Interactive map would appear here</p>
                </div>
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
                      onClick={() => handleTicketChange(Math.max(1, ticketCount - 1))}
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
                
                {/* Promo code */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Promo Code</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#ED4A43] focus:border-transparent"
                    />
                    <button 
                      onClick={handlePromoCode}
                      className="px-4 py-2 bg-gray-800 text-white font-medium rounded-r-md hover:bg-gray-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Try "DISCOUNT10" for 10% off</p>
                </div>
                
                {/* Group discount notification */}
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Group Discount:</span> Book 5 or more tickets and get 20% off automatically!
                  </p>
                </div>
                
                {/* Price calculation */}
                <div className="space-y-2 pt-3 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price ({ticketCount} tickets)</span>
                    <span className="font-medium">${(ticketCount * event.price).toFixed(2)}</span>
                  </div>
                  
                  {finalDiscount > 0 && (
                    <div className="flex justify-between text-[#ED4A43]">
                      <span>Discount ({finalDiscount}%)</span>
                      <span>-${(ticketCount * event.price * finalDiscount / 100).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-xl font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
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