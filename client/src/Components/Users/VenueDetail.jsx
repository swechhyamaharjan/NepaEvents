import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaMapMarkerAlt, 
  FaUsers, 
  FaBuilding, 
  FaHeart, 
  FaCalendarAlt, 
  FaInfoCircle, 
  FaArrowLeft, 
  FaWifi, 
  FaParking, 
  FaAccessibleIcon, 
  FaUtensils, 
  FaMusic,
  FaMapMarked
} from "react-icons/fa";
import venueImage from "/public/images/event1.png";

export const VenueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [mapLoaded, setMapLoaded] = useState(false);

  // In a real application, you would fetch the venue by ID
  // For now, we'll simulate getting venue data
  const venue = {
    id: parseInt(id) || 1,
    name: "Kamaladi Hall",
    price: 4000,
    img: venueImage,
    location: "Kamaladi, Kathmandu",
    coordinates: {
      lat: 27.7063, 
      lng: 85.3209
    },
    capacity: 300,
    rating: 4.8,
    reviewCount: 124,
    description: "Kamaladi Hall is a premium event venue located in the heart of Kathmandu. With its spacious interiors, state-of-the-art facilities, and convenient location, it's the perfect choice for corporate events, weddings, and social gatherings. The venue features modern architecture, excellent acoustics, and customizable lighting to suit your event's needs.",
    amenities: [
      { name: "Free Wi-Fi", icon: <FaWifi /> },
      { name: "Parking Available", icon: <FaParking /> },
      { name: "Wheelchair Accessible", icon: <FaAccessibleIcon /> },
      { name: "Catering Services", icon: <FaUtensils /> },
      { name: "Sound System", icon: <FaMusic /> },
    ],
    details: {
      size: "5000 sq ft",
      maxCapacity: 300,
      minimumBookingHours: 4,
      availableTimes: "8:00 AM - 10:00 PM",
      setupOptions: "Theater, Classroom, Banquet, Reception",
      audioVisual: "Projector, Screen, Microphones, Speakers",
      parking: "Available for up to 50 vehicles",
      additionalServices: "Catering, Decoration, Photography"
    },
    termsAndConditions: [
      "Booking requires a 50% advance payment.",
      "Cancellations made 7 days or more before the event date will receive a 75% refund.",
      "Cancellations made less than 7 days before the event date will receive a 25% refund.",
      "No-shows will not receive any refund.",
      "The venue must be vacated by the agreed end time or additional charges will apply.",
      "Any damage to the venue or equipment will be charged to the client.",
      "Outside food and beverages are not permitted without prior arrangement.",
      "The venue reserves the right to cancel bookings in case of force majeure.",
      "Noise levels must be maintained within legal limits.",
      "The client is responsible for obtaining any necessary permits or licenses for their event."
    ],
    similarVenues: [
      { id: 2, name: "Baneshwor Hall", price: 4500, img: venueImage, location: "Baneshwor, Kathmandu" },
      { id: 3, name: "Bhrikuti Mandap Hall", price: 5000, img: venueImage, location: "Pradarshani Marg, Kathmandu" },
    ]
  };

  // Map initialization
  useEffect(() => {
    // This would be replaced with actual map initialization code
    const loadMap = async () => {
      // Simulate map loading
      setTimeout(() => {
        setMapLoaded(true);
      }, 1000);
    };

    loadMap();
  }, []);

  // Open booking modal
  const handleBookNow = () => {
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setIsBookingConfirmed(false);
  };

  // Handle booking confirmation
  const handleBookingConfirmation = (e) => {
    e.preventDefault();
    setIsBookingConfirmed(true);
  };

  // Toggle favorite status
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Go back to venues list
  const goBack = () => {
    navigate(-1);
  };

  // Render stars for rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`star-${i}`} className="text-yellow-400">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half-star" className="text-yellow-400">★</span>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-star-${i}`} className="text-gray-300">★</span>);
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <button 
          onClick={goBack}
          className="flex items-center text-gray-600 hover:text-[#ED4A43] mb-8 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Venues
        </button>

        {/* Venue Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
          <div className="relative">
            <img 
              src={venue.img} 
              alt={venue.name}
              className="w-full h-96 object-cover object-center"
            />
            <button
              onClick={toggleFavorite}
              className="absolute top-6 right-6 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
            >
              <FaHeart
                size={22}
                className={isFavorite ? "text-[#ED4A43]" : "text-gray-400"}
              />
            </button>
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
              {/* Venue Info */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{venue.name}</h1>
                
                <div className="flex items-center mb-3">
                  <div className="flex items-center mr-3">
                    {renderStars(venue.rating)}
                    <span className="ml-2 text-gray-600">{venue.rating}</span>
                  </div>
                  <span className="text-gray-500">({venue.reviewCount} reviews)</span>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-[#ED4A43]" />
                    <span>{venue.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaUsers className="mr-2 text-[#ED4A43]" />
                    <span>Capacity: {venue.capacity} people</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaBuilding className="mr-2 text-[#ED4A43]" />
                    <span className="font-semibold">Venue</span>
                  </div>
                </div>
              </div>

              {/* Price and Book Now */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col items-center">
                <p className="text-lg mb-1 text-gray-500">Price per day</p>
                <p className="text-3xl font-bold text-[#ED4A43] mb-4">Rs. {venue.price}</p>
                <button
                  onClick={handleBookNow}
                  className="w-full bg-[#ED4A43] text-white py-3 px-6 rounded-lg font-bold hover:bg-[#c93a34] transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-1 duration-200"
                >
                  Book Now
                </button>
              </div>
            </div>
            
            {/* Amenities */}
            <div className="mt-8 border-t border-gray-100 pt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {venue.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <div className="text-[#ED4A43] mr-2">
                      {amenity.icon}
                    </div>
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Location Map Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
          <div className="p-8">
            <div className="flex items-center mb-6">
              <FaMapMarked className="text-[#ED4A43] mr-2 text-xl" />
              <h3 className="text-2xl font-bold text-gray-800">Location</h3>
            </div>
            
            <div className="bg-gray-100 rounded-xl overflow-hidden">
              <div 
                id="venue-map" 
                className="w-full h-96 relative"
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: mapLoaded ? '#e5e7eb' : '#f3f4f6' 
                }}
              >
                {!mapLoaded ? (
                  <div className="text-center">
                    <div className="inline-block w-8 h-8 border-4 border-[#ED4A43] border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-gray-500">Loading map...</p>
                  </div>
                ) : (
                  <>
                    {/* This is a placeholder for the actual map */}
                    <div className="absolute inset-0 bg-gray-200">
                      <img 
                        src="/api/placeholder/800/400" 
                        alt="Map placeholder" 
                        className="w-full h-full object-cover opacity-75"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-[#ED4A43] text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
                          <FaMapMarkerAlt className="mr-2" />
                          <span>Kamaladi Hall</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold text-gray-700 mb-2">Address</h4>
              <p className="text-gray-600">{venue.location}</p>
              <p className="text-gray-600 mt-4">
                Coordinates: {venue.coordinates.lat}, {venue.coordinates.lng}
              </p>
              
              <div className="mt-6">
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${venue.coordinates.lat},${venue.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-[#ED4A43] text-white py-2 px-4 rounded-lg hover:bg-[#c93a34] transition-colors shadow-md"
                >
                  <FaMapMarkerAlt className="mr-2" />
                  View on Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Details, Description and T&C */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("description")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm md:text-base ${
                  activeTab === "description"
                    ? "border-[#ED4A43] text-[#ED4A43]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm md:text-base ${
                  activeTab === "details"
                    ? "border-[#ED4A43] text-[#ED4A43]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Venue Details
              </button>
              <button
                onClick={() => setActiveTab("terms")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm md:text-base ${
                  activeTab === "terms"
                    ? "border-[#ED4A43] text-[#ED4A43]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Terms & Conditions
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === "description" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed">{venue.description}</p>
              </div>
            )}

            {activeTab === "details" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Venue Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Size</h4>
                    <p className="text-gray-600">{venue.details.size}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Maximum Capacity</h4>
                    <p className="text-gray-600">{venue.details.maxCapacity} people</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Minimum Booking Hours</h4>
                    <p className="text-gray-600">{venue.details.minimumBookingHours} hours</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Available Times</h4>
                    <p className="text-gray-600">{venue.details.availableTimes}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Setup Options</h4>
                    <p className="text-gray-600">{venue.details.setupOptions}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Audio Visual Equipment</h4>
                    <p className="text-gray-600">{venue.details.audioVisual}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Parking</h4>
                    <p className="text-gray-600">{venue.details.parking}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Additional Services</h4>
                    <p className="text-gray-600">{venue.details.additionalServices}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "terms" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Terms & Conditions</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  {venue.termsAndConditions.map((term, index) => (
                    <li key={index}>{term}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Similar Venues */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Similar Venues</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {venue.similarVenues.map((similarVenue) => (
              <div
                key={similarVenue.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={similarVenue.img}
                    alt={similarVenue.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2 text-gray-800">{similarVenue.name}</h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FaMapMarkerAlt className="mr-2 text-[#ED4A43]" />
                    <span>{similarVenue.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-[#ED4A43]">Rs. {similarVenue.price}</p>
                    <button
                      onClick={() => navigate(`/venues/${similarVenue.id}`)}
                      className="bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Form Modal - Same as in BookVenue.jsx */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-[#ED4A43] to-[#FF7A6E] p-6 text-white">
              <h3 className="text-2xl font-bold">
                {isBookingConfirmed ? "Booking Confirmed" : `Book ${venue.name}`}
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
                        <strong>Name:</strong> {venue.name}<br />
                        <strong>Location:</strong> {venue.location}<br />
                        <strong>Capacity:</strong> {venue.capacity} people<br />
                        <strong>Price:</strong> Rs. {venue.price}
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
                  <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Booking Successful!</h3>
                <p className="text-lg text-gray-700 mb-8">
                  Thank you for booking! We will notify you once your booking is approved by the admin.
                </p>
                <p className="text-gray-600 mb-8">
                  <strong>Venue:</strong> {venue.name}<br />
                  <strong>Location:</strong> {venue.location}
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
export default VenueDetail;