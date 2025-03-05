import React, { useState } from "react";
import venueImage from "/public/images/event1.png";

export const BookVenue = () => {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

  // Example venue data
  const venues = [
    {
      id: 1,
      name: "Kamaladi Hall",
      price: 4000,
      img: venueImage,
    },
    {
      id: 2,
      name: "Baneshwor Hall",
      price: 4500,
      img: venueImage,
    },
    {
      id: 3,
      name: "Bhrikuti Mandap Hall",
      price: 5000,
      img: venueImage,
    },
    {
      id: 4,
      name: "Tudikhel Grounds",
      price: 6000,
      img: venueImage,
    },
  ];

  // Open modal with selected venue details
  const handleBookNow = (venue) => {
    setSelectedVenue(venue);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVenue(null);
    setIsBookingConfirmed(false);
  };

  // Handle booking confirmation
  const handleBookingConfirmation = (e) => {
    e.preventDefault();
    setIsBookingConfirmed(true);
  };

  return (
    <div className="py-8 px-4 md:px-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Book a Venue
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {venues.map((venue) => (
          <div
            key={venue.id}
            className="bg-gray-200 p-4 rounded-md shadow-md text-center"
          >
            {/* Venue Image */}
            <div className="w-full h-48 mb-4">
              <img
                src={venue.img}
                alt={venue.name}
                className="w-full h-full object-cover rounded"
              />
            </div>

            {/* Venue Name */}
            <h3 className="text-lg font-bold text-gray-900">{venue.name}</h3>

            {/* Price */}
            <p className="text-gray-700 mt-2">Price: Rs. {venue.price}</p>

            {/* Book Now Button */}
            <button
              onClick={() => handleBookNow(venue)}
              className="mt-4 bg-[#ED4A43] text-white py-2 px-4 rounded hover:bg-[#c93a34] transition"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {/* Booking Form Modal */}
      {isModalOpen && selectedVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full relative">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Book {selectedVenue.name}
            </h3>
            {!isBookingConfirmed ? (
              <form onSubmit={handleBookingConfirmation}>
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Event Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Event Description
                  </label>
                  <textarea
                    id="description"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Event Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="time"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Event Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Duration (in hours)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    min="1"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Event Category
                  </label>
                  <select
                    id="category"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="conference">Conference</option>
                    <option value="wedding">Wedding</option>
                    <option value="concert">Concert</option>
                    <option value="workshop">Workshop</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#ED4A43] text-white rounded-md hover:bg-[#c93a34]"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <p className="text-lg text-gray-700">
                  Thank you for booking! We will notify you once approved by the
                  admin.
                </p>
                <button
                  onClick={closeModal}
                  className="mt-4 px-4 py-2 bg-[#ED4A43] text-white rounded-md hover:bg-[#c93a34]"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
