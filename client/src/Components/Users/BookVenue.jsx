import React, { useState } from "react";
import venueImage from "/public/images/event1.png";
import { FaMapMarkerAlt, FaUsers, FaBuilding, FaHeart, FaSearch, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";

export const BookVenue = () => {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);

  // Example venue data
  const venues = [
    {
      id: 1,
      name: "Kamaladi Hall",
      price: 4000,
      img: venueImage,
      location: "Kamaladi, Kathmandu",
      capacity: 300,
    },
    {
      id: 2,
      name: "Baneshwor Hall",
      price: 4500,
      img: venueImage,
      location: "Baneshwor, Kathmandu",
      capacity: 250,
    },
    {
      id: 3,
      name: "Bhrikuti Mandap Hall",
      price: 5000,
      img: venueImage,
      location: "Pradarshani Marg, Kathmandu",
      capacity: 1000,
    },
    {
      id: 4,
      name: "Tudikhel Grounds",
      price: 6000,
      img: venueImage,
      location: "Tudikhel, Kathmandu",
      capacity: 1500,
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

  // Toggle favorite status
  const toggleFavorite = (venueId) => {
    if (favorites.includes(venueId)) {
      setFavorites(favorites.filter(id => id !== venueId));
    } else {
      setFavorites([...favorites, venueId]);
    }
  };

  // Filter venues based on search term
  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ED4A43] to-[#ED4A43] mb-2 text-center">Book a Venue</h2>
        <p className="text-center text-gray-500 mb-12">Find and book the perfect venue for your event</p>

        {/* Search and Filter Section */}
        <div className="mb-10 max-w-lg mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search venues by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-12 bg-white border-2 border-red-100 rounded-full focus:outline-none focus:border-[#ED4A43] shadow-lg"
            />
            <FaSearch className="absolute left-4 top-4 text-gray-400" />
          </div>
        </div>

        {/* Venue List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 w-full">
                    <button
                      onClick={() => handleBookNow(venue)}
                      className="w-full bg-[#ED4A43] text-white py-3 rounded-lg font-bold hover:bg-[#c93a34] transition-all"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
                <img
                  src={venue.img}
                  alt={venue.name}
                  className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <button
                  onClick={() => toggleFavorite(venue.id)}
                  className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
                >
                  <FaHeart
                    size={18}
                    className={favorites.includes(venue.id) ? "text-[#ED4A43]" : "text-gray-400"}
                  />
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{venue.name}</h3>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-[#ED4A43]" />
                    <span>{venue.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaUsers className="mr-2 text-[#ED4A43]" />
                    <span>Capacity: {venue.capacity}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaBuilding className="mr-2 text-[#ED4A43]" />
                    <span className="font-semibold">Venue</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-[#ED4A43]">Rs. {venue.price}</p>
                  <button
                    onClick={() => handleBookNow(venue)}
                    className="bg-[#ED4A43] text-white py-2 px-4 rounded-lg hover:bg-[#c93a34] transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredVenues.length === 0 && (
          <div className="text-center py-10">
            <FaInfoCircle className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-700">No venues found</h3>
            <p className="text-gray-500 mt-2">Try changing your search criteria</p>
          </div>
        )}
      </div>

      {/* Booking Form Modal */}
      {isModalOpen && selectedVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-[#ED4A43] to-[#FF7A6E] p-6 text-white">
              <h3 className="text-2xl font-bold">
                {isBookingConfirmed ? "Booking Confirmed" : `Book ${selectedVenue.name}`}
              </h3>
              <p className="text-red-100 text-sm mt-1">
                {isBookingConfirmed ? "Thank you for your booking" : "All fields marked are required to complete your booking"}
              </p>
            </div>

            {!isBookingConfirmed ? (
              <form onSubmit={handleBookingConfirmation} className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Event Title */}
                    <div>
                      <label htmlFor="title" className="block text-gray-700 font-medium mb-1">
                        Event Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Enter event title"
                        className="w-full p-3 bg-red-50 border-2 border-red-100 rounded-xl focus:outline-none focus:border-[#ED4A43] transition-colors"
                        required
                      />
                    </div>

                    {/* Event Description */}
                    <div>
                      <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
                        Event Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Enter event description"
                        rows="3"
                        className="w-full p-3 bg-red-50 border-2 border-red-100 rounded-xl focus:outline-none focus:border-[#ED4A43] transition-colors"
                        required
                      ></textarea>
                    </div>

                    {/* Event Category */}
                    <div>
                      <label htmlFor="category" className="block text-gray-700 font-medium mb-1">
                        Event Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        className="w-full p-3 bg-red-50 border-2 border-red-100 rounded-xl focus:outline-none focus:border-[#ED4A43] transition-colors"
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="conference">Conference</option>
                        <option value="wedding">Wedding</option>
                        <option value="concert">Concert</option>
                        <option value="workshop">Workshop</option>
                      </select>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Event Date and Time Section */}
                    <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                      <h3 className="text-gray-700 font-semibold mb-4 flex items-center">
                        <FaCalendarAlt className="h-5 w-5 mr-2 text-[#ED4A43]" />
                        Event Details
                      </h3>

                      {/* Date Input */}
                      <div className="mb-4">
                        <label htmlFor="date" className="block text-gray-700 font-medium mb-1 text-sm">
                          Event Date
                        </label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          className="w-full p-2 bg-white border border-red-200 rounded-lg focus:outline-none focus:border-[#ED4A43]"
                          required
                        />
                      </div>

                    </div>
                    {/* Venue Information */}
                    <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                      <h3 className="text-gray-700 font-semibold mb-4 flex items-center">
                        <FaInfoCircle className="h-5 w-5 mr-2 text-[#ED4A43]" />
                        Venue Information
                      </h3>
                      <p className="text-sm text-gray-600">
                        <strong>Name:</strong> {selectedVenue.name}<br />
                        <strong>Location:</strong> {selectedVenue.location}<br />
                        <strong>Capacity:</strong> {selectedVenue.capacity} people<br />
                        <strong>Price:</strong> Rs. {selectedVenue.price}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button Area */}
                <div className="mt-10 text-center flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-10 py-4 bg-[#ED4A43] text-white font-semibold rounded-xl shadow-lg hover:bg-[#D43C35] transform hover:-translate-y-1 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#ED4A43] focus:ring-offset-2"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                  <FaCheckCircle className="text-green-500 text-4xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Booking Successful!</h3>
                <p className="text-lg text-gray-700 mb-8">
                  Thank you for booking! We will notify you once your booking is approved by the admin.
                </p>
                <p className="text-gray-600 mb-8">
                  <strong>Venue:</strong> {selectedVenue.name}<br />
                  <strong>Location:</strong> {selectedVenue.location}
                </p>
                <button
                  onClick={closeModal}
                  className="px-10 py-4 bg-[#ED4A43] text-white rounded-xl hover:bg-[#c93a34] transition-all"
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