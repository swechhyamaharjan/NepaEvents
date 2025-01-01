// import React, { useState } from 'react';
// import { FaCalendarAlt } from 'react-icons/fa';
// import eventImage from './event1.png'; // Example event image

// export const Event = () => {
//   const [ticketCount, setTicketCount] = useState(1);
//   const [promoCode, setPromoCode] = useState('');
//   const [discount, setDiscount] = useState(0);
//   const [totalPrice, setTotalPrice] = useState(100); // Example price per ticket

//   // Handle changes to the ticket count
//   const handleTicketChange = (e) => {
//     const count = parseInt(e.target.value);
//     setTicketCount(count);
//     setTotalPrice(count * 100 - discount); // Recalculate total price based on count and discount
//   };

//   // Apply promo code for discount
//   const handlePromoCode = () => {
//     if (promoCode === 'DISCOUNT10') {
//       setDiscount(10); // 10% discount
//     } else if (promoCode === 'GROUPDISCOUNT') {
//       setDiscount(20); // 20% discount for group booking
//     } else {
//       setDiscount(0);
//     }
//     setTotalPrice(ticketCount * 100 - discount); // Recalculate total price after discount
//   };

//   return (
//     <div className="py-8 px-4 md:px-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Event Details Section */}
//         <div className="flex flex-col md:flex-row mb-8">
//           <div className="w-full md:w-1/2">
//             <img
//               src={eventImage}
//               alt="Event"
//               className="w-full h-96 object-cover rounded-lg"
//             />
//           </div>
//           <div className="w-full md:w-1/2 md:pl-8 mt-4 md:mt-0">
//             <h2 className="text-3xl font-semibold text-gray-800">Concert X</h2>
//             <div className="flex items-center space-x-4 mt-2">
//               <FaCalendarAlt className="text-3xl text-[#ED4A43]" />
//               <div>
//                 <p className="text-lg font-semibold text-gray-800">December 31, 2024</p>
//                 <p className="text-sm text-gray-600">Hyatt Regency</p>
//               </div>
//             </div>
//             <p className="text-lg text-gray-700 mt-4">
//               Enjoy an unforgettable night at "Concert X," featuring top artists and an electrifying atmosphere. Don't miss it!
//             </p>
//           </div>
//         </div>

//         {/* Ticket Selection */}
//         <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//           <h3 className="text-2xl font-semibold text-gray-800 mb-4">Select Tickets</h3>
//           <div className="flex items-center space-x-4">
//             <label className="text-lg font-medium text-gray-700" htmlFor="ticket-count">
//               Number of Tickets:
//             </label>
//             <input
//               type="number"
//               id="ticket-count"
//               min="1"
//               value={ticketCount}
//               onChange={handleTicketChange}
//               className="w-16 px-4 py-2 border rounded-md text-lg text-gray-800"
//             />
//           </div>
//           <p className="mt-4 text-lg text-gray-800">
//             Price: ${totalPrice} (per ticket: $100)
//           </p>
//         </div>

//         {/* Promo Code Section */}
//         <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//           <h3 className="text-2xl font-semibold text-gray-800 mb-4">Apply Promo Code</h3>
//           <div className="flex items-center space-x-4">
//             <input
//               type="text"
//               placeholder="Enter Promo Code"
//               value={promoCode}
//               onChange={(e) => setPromoCode(e.target.value)}
//               className="px-4 py-2 w-72 rounded-md text-lg text-[#697787] border border-gray-300"
//             />
//             <button
//               onClick={handlePromoCode}
//               className="px-6 py-2 bg-[#ED4A43] hover:bg-[#D43C35] text-white font-semibold rounded-md"
//             >
//               Apply
//             </button>
//           </div>
//           {discount > 0 && (
//             <p className="mt-4 text-lg text-gray-700">Discount Applied: {discount}%</p>
//           )}
//         </div>

//         {/* Final Booking Section */}
//         <div className="bg-white p-6 rounded-lg shadow-md text-center">
//           <button className="px-8 py-3 bg-[#ED4A43] hover:bg-[#D43C35] text-white font-semibold rounded-md w-full">
//             Book Tickets
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import eventImage from './event1.png'; // Example event image

export const Event = () => {
  // Example event data
  const events = [
    {
      id: 1,
      img: eventImage,
      name: "Concert X",
      date: "December 31, 2024",
      location: "Hyatt Regency",
      price: 100,
    },
    {
      id: 2,
      img: eventImage,
      name: "Live Performance",
      date: "January 5, 2025",
      location: "Bhrikuti Mandap",
      price: 80,
    },
    {
      id: 3,
      img: eventImage,
      name: "Dancing Show",
      date: "January 10, 2025",
      location: "Pragya Hall",
      price: 90,
    },
    {
      id: 4,
      img: eventImage,
      name: "Comedy Show",
      date: "January 15, 2025",
      location: "Tudikhel",
      price: 70,
    },
  ];

  const [ticketCounts, setTicketCounts] = useState({});
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Handle ticket count change
  const handleTicketChange = (eventId, count) => {
    setTicketCounts((prev) => ({
      ...prev,
      [eventId]: count,
    }));
  };

  // Apply promo code
  const handlePromoCode = () => {
    if (promoCode === 'DISCOUNT10') {
      setDiscount(10); // 10% discount 
    } else if (promoCode === 'GROUPDISCOUNT') {
      setDiscount(20); // 20% discount for group booking
    } else {
      setDiscount(0);
    }
  };

  // Apply group discount (20% off for 5 or more tickets)
  const applyGroupDiscount = (ticketCount) => {
    const groupThreshold = 5;
    if (ticketCount >= groupThreshold) {
      return 20;
    }
    return 0;
  };

  return (
    <div className="py-8 px-4 md:px-8">
      <h2 className="text-4xl font-extrabold text-[#ED4A43] mb-8 text-center">
          Events
        </h2>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => {
            const ticketCount = ticketCounts[event.id] || 1;
            const groupDiscount = applyGroupDiscount(ticketCount);
            const finalDiscount = Math.max(discount, groupDiscount); // Prioritize group discount
            const totalPrice = ticketCount * event.price * (1 - finalDiscount / 100);

            return (
              <div key={event.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow relative">
                {/* Group Discount Badge */}
                <div className="absolute top-2 right-2 bg-[#ED4A43] text-white text-sm font-semibold py-1 px-3 rounded-lg">
                  20% OFF for 5+ Tickets
                </div>

                {/* Event Image */}
                <div className="w-full h-48 mb-4">
                  <img src={event.img} alt={event.name} className="w-full h-full object-cover rounded-md" />
                </div>

                {/* Event Details */}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{event.name}</h3>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaCalendarAlt className="text-xl text-[#ED4A43]" />
                    <p>{event.date}</p>
                  </div>
                  <p className="text-md text-gray-600">{event.location}</p>
                </div>

                {/* Ticket Count Input */}
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700" htmlFor={`ticket-count-${event.id}`}>
                    Tickets:
                  </label>
                  <input
                    type="number"
                    id={`ticket-count-${event.id}`}
                    min="1"
                    value={ticketCount}
                    onChange={(e) => handleTicketChange(event.id, parseInt(e.target.value))}
                    className="w-20 px-4 py-2 border border-gray-300 rounded-md text-lg text-gray-800"
                  />
                  <p className="mt-2 text-md text-gray-800">Total Price: ${totalPrice.toFixed(2)}</p>
                </div>

                {/* Promo Code Section */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Promo Code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="px-4 py-2 w-full border border-gray-300 rounded-md text-lg text-[#697787]"
                  />
                  <button
                    onClick={handlePromoCode}
                    className="px-6 py-2 mt-2 bg-[#ED4A43] hover:bg-[#D43C35] text-white font-semibold rounded-md w-full"
                  >
                    Apply Promo Code
                  </button>
                  {finalDiscount > 0 && (
                    <p className="mt-4 text-md text-gray-700">Discount Applied: {finalDiscount}%</p>
                  )}
                </div>

                {/* Book Button */}
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
