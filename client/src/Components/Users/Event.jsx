import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
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
    <div className="py-8 px-4 md:px-12 lg:px-20">
      <h2 className="text-4xl font-extrabold text-[#ED4A43] mb-8 text-center">Events</h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-3 bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Search for an Event</h3>
          <input type="text" placeholder="Search..." className="w-full p-2 border border-gray-300 rounded-md mb-4" />
          
          <h3 className="text-lg font-semibold mb-2">Sort By</h3>
          <div className="mb-4">
            <label className="block"><input type="radio" name="sort" className="mr-2" /> Price</label>
            <label className="block"><input type="radio" name="sort" className="mr-2" checked /> Date</label>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Date</h3>
          <div className="mb-4">
            <label className="block"><input type="radio" name="date" className="mr-2" /> Today</label>
            <label className="block"><input type="radio" name="date" className="mr-2" checked /> Tomorrow</label>
            <label className="block"><input type="radio" name="date" className="mr-2" /> This weekend</label>
            <label className="block"><input type="radio" name="date" className="mr-2" /> Next Week</label>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Price</h3>
          <div className="mb-4">
            <label className="block"><input type="radio" name="price" className="mr-2" /> Free</label>
            <label className="block"><input type="radio" name="price" className="mr-2" checked /> Paid</label>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Event Type</h3>
          <div>
            <label className="block"><input type="radio" name="type" className="mr-2" /> Concert</label>
            <label className="block"><input type="radio" name="type" className="mr-2" checked /> Sports</label>
            <label className="block"><input type="radio" name="type" className="mr-2" /> Art Exhibition</label>
            <label className="block"><input type="radio" name="type" className="mr-2" /> Standup Comedy</label>
            <label className="block"><input type="radio" name="type" className="mr-2" /> Theatre</label>
            <label className="block"><input type="radio" name="type" className="mr-2" /> Parties</label>
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
              <div key={event.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow relative">
                <div className="absolute top-2 right-2 bg-[#ED4A43] text-white text-sm font-semibold py-1 px-3 rounded-lg">
                  20% OFF for 5+ Tickets
                </div>
                <div className="w-full h-48 mb-4">
                  <img src={event.img} alt={event.name} className="w-full h-full object-cover rounded-md" />
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{event.name}</h3>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaCalendarAlt className="text-xl text-[#ED4A43]" />
                    <p>{event.date}</p>
                  </div>
                  <p className="text-md text-gray-600">{event.location}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">Tickets:</label>
                  <input
                    type="number"
                    min="1"
                    value={ticketCount}
                    onChange={(e) => handleTicketChange(event.id, parseInt(e.target.value))}
                    className="w-20 px-4 py-2 border border-gray-300 rounded-md text-lg text-gray-800"
                  />
                  <p className="mt-2 text-md text-gray-800">Total Price: ${totalPrice.toFixed(2)}</p>
                </div>
                <button className="w-full px-8 py-3 bg-[#ED4A43] hover:bg-[#D43C35] text-white font-semibold rounded-md mt-4">
                  Book Now
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
