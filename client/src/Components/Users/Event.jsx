import React, { useState } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaSearch, FaRegCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import eventImage from "/public/images/event1.png";

export const Event = () => {
  const events = [
    { id: 1, img: eventImage, name: "Concert X", date: "December 31, 2024", location: "Hyatt Regency", price: 100 },
    { id: 2, img: eventImage, name: "Live Performance", date: "January 5, 2025", location: "Bhrikuti Mandap", price: 80 },
    { id: 3, img: eventImage, name: "Dancing Show", date: "January 10, 2025", location: "Pragya Hall", price: 90 },
    { id: 4, img: eventImage, name: "Comedy Show", date: "January 15, 2025", location: "Tudikhel", price: 70 },
  ];

  const [ticketCounts, setTicketCounts] = useState({});
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleTicketChange = (eventId, count) => {
    setTicketCounts((prev) => ({ ...prev, [eventId]: count }));
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

  return (
    <div className="bg-gray-50 py-12 px-4 md:px-12 lg:px-20 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-extrabold text-[#ED4A43] mb-8 text-center relative">
          <span className="relative inline-block">
            Events
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-md">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <FaSearch className="mr-2 text-[#ED4A43]" />
                Find Events
              </h3>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED4A43] focus:border-transparent" 
                />
                <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-5 divide-y divide-gray-100">
              <div className="pb-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Sort By</h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="sort" className="form-radio text-[#ED4A43] mr-2" /> 
                    <span>Price</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="sort" className="form-radio text-[#ED4A43] mr-2" defaultChecked /> 
                    <span>Date</span>
                  </label>
                </div>
              </div>
              
              <div className="py-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                  <FaRegCalendarAlt className="mr-2 text-[#ED4A43]" />
                  Date
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="date" className="form-radio text-[#ED4A43] mr-2" /> 
                    <span>Today</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="date" className="form-radio text-[#ED4A43] mr-2" defaultChecked /> 
                    <span>Tomorrow</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="date" className="form-radio text-[#ED4A43] mr-2" /> 
                    <span>This weekend</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="date" className="form-radio text-[#ED4A43] mr-2" /> 
                    <span>Next Week</span>
                  </label>
                </div>
              </div>
              
              <div className="py-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                  <FaTicketAlt className="mr-2 text-[#ED4A43]" />
                  Price
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="price" className="form-radio text-[#ED4A43] mr-2" /> 
                    <span>Free</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="price" className="form-radio text-[#ED4A43] mr-2" defaultChecked /> 
                    <span>Paid</span>
                  </label>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Event Type</h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="type" className="form-radio text-[#ED4A43] mr-2" /> 
                    <span>Concert</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="type" className="form-radio text-[#ED4A43] mr-2" defaultChecked /> 
                    <span>Sports</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="type" className="form-radio text-[#ED4A43] mr-2" /> 
                    <span>Art Exhibition</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="type" className="form-radio text-[#ED4A43] mr-2" /> 
                    <span>Standup Comedy</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="type" className="form-radio text-[#ED4A43] mr-2" /> 
                    <span>Theatre</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="type" className="form-radio text-[#ED4A43] mr-2" /> 
                    <span>Parties</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const ticketCount = ticketCounts[event.id] || 1;
              const groupDiscount = applyGroupDiscount(ticketCount);
              const finalDiscount = Math.max(discount, groupDiscount);
              const totalPrice = ticketCount * event.price * (1 - finalDiscount / 100);

              return (
                <div key={event.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 relative group">
                  {/* Using Link component for reliable navigation */}
                  <Link to={`/event/${event.id}`} className="absolute inset-0 z-10">
                    <span className="sr-only">View details for {event.name}</span>
                  </Link>
                  
                  {/* Discount Badge */}
                  <div className="absolute top-3 right-3 bg-[#ED4A43] text-white text-sm font-semibold py-1.5 px-3 rounded-full z-20 shadow-md">
                    20% OFF for 5+ Tickets
                  </div>
                  
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.img} 
                      alt={event.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#ED4A43] transition-colors duration-300">{event.name}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <FaCalendarAlt className="text-[#ED4A43] mr-2" />
                        <p>{event.date}</p>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaMapMarkerAlt className="text-[#ED4A43] mr-2" />
                        <p>{event.location}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <label className="font-medium text-gray-700">Tickets:</label>
                        <input
                          type="number"
                          min="1"
                          value={ticketCount}
                          onChange={(e) => handleTicketChange(event.id, parseInt(e.target.value))}
                          onClick={(e) => e.stopPropagation()}
                          className="w-20 px-3 py-2 border border-gray-200 rounded-md text-gray-800 text-center focus:outline-none focus:ring-2 focus:ring-[#ED4A43] focus:border-transparent relative z-20"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-gray-700">Total:</span>
                        <span className="text-lg font-bold text-[#ED4A43]">${totalPrice.toFixed(2)}</span>
                      </div>
                      
                      <Link 
                        to={`/event/${event.id}`} 
                        className="w-full py-3 bg-[#ED4A43] hover:bg-[#D43C35] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center relative z-20"
                      >
                        <FaTicketAlt className="mr-2" />
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};