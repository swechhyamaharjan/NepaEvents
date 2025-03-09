import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaCheckCircle, FaTimesCircle, FaMapMarkerAlt, FaUsers, FaBuilding } from "react-icons/fa";
import venueImage from "/public/images/event1.png"; 
import axios from "axios";
import { toast } from "react-hot-toast";

export const AdminVenuePage = () => {
  const [venues, setVenues] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [newVenue, setNewVenue] = useState({
    name: "",
    location: "",
    capacity: "",
    image: "",
  });

  // Add or Edit Venue
  const handleSaveVenue = async () => {
    const formData = new FormData();
    formData.append("name", newVenue.name);
    formData.append("location", newVenue.location);
    formData.append("capacity", newVenue.capacity);
    if(newVenue.image){
      formData.append("image", newVenue.image)
    }
    try {
      const response = await axios.post("http://localhost:3000/api/venue", formData, {
        headers: { "Content-Type": "multipart/form-data"},
        withCredentials: true
      })
      toast.success("Venue added successfully!");
      setShowModal(false);
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error("Failed to add venue. Please try again!");
    }
  };
  useEffect(()=>{
    async function fetchVenues(){
      try {
        const response = await axios.get("http://localhost:3000/api/venue");
        setVenues(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    }
fetchVenues();
  },[])

  // Open Edit Modal
  const handleEditVenue = (venue) => {
    setSelectedVenue(venue);
    setNewVenue(venue);
    setShowModal(true);
  };

  // Delete Venue
  const handleDeleteVenue = (venueId) => {
    if (window.confirm("Are you sure you want to delete this venue?")) {
      setVenues(venues.filter((venue) => venue.id !== venueId));
    }
  };

  // Approve Venue
  const handleApproveVenue = (venueId) => {
    setVenues(venues.map((venue) => (venue.id === venueId ? { ...venue, isApproved: true } : venue)));
  };

  // Reject Venue
  const handleRejectVenue = (venueId) => {
    setVenues(venues.map((venue) => (venue.id === venueId ? { ...venue, isApproved: false } : venue)));
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVenue((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setNewVenue((prev) => ({ ...prev, image: file }));
      }
  };

  const getStatusColor = (status) => {
    if (status === true) return "bg-green-100 text-green-800 border-green-300";
    if (status === false) return "bg-red-100 text-red-800 border-red-300";
    return "bg-yellow-100 text-yellow-800 border-yellow-300";
  };

  const getStatusText = (status) => {
    if (status === true) return "Approved";
    if (status === false) return "Rejected";
    return "Pending";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ED4A43] to-[#ED4A43] mb-2 text-center">Venue Dashboard</h2>
        <p className="text-center text-gray-500 mb-12">Manage and organize your venues in one place</p>

        <div className="flex justify-end mb-10">
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#ED4A43] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center"
          >
            <span className="mr-2">+</span> Create New Venue
          </button>
        </div>

        {/* Venue List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {venues.map((venue)=>(
            <div 
            key={venue.id} 
            className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group relative"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-6 w-full">
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleEditVenue(venue)}
                      className="bg-white/90 text-[#ED4A43] p-3 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteVenue(venue.id)}
                      className="bg-white/90 text-[#ED4A43] p-3 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
                    >
                      <FaTrashAlt size={18} />
                    </button>
                  </div>
                </div>
              </div>
              <img 
                src={`http://localhost:3000/${venue.image}`} 
                alt={venue.name} 
                className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div 
                className={`absolute top-4 right-4 px-3 py-1 rounded-full border ${getStatusColor(venue.isApproved)} text-xs font-bold`}
              >
                {getStatusText(venue.isApproved)}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold mb-3 text-gray-800">{venue.name}</h3>
              
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
                  <span className="font-semibold">{venue.name}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={() => handleApproveVenue(venue.id)}
                  className={`px-4 py-3 rounded-lg flex items-center justify-center ${
                    venue.isApproved === true 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-md"
                  }`}
                  disabled={venue.isApproved === true}
                >
                  <FaCheckCircle className="mr-2" /> Approve
                </button>
                <button
                  onClick={() => handleRejectVenue(venue.id)}
                  className={`px-4 py-3 rounded-lg flex items-center justify-center ${
                    venue.isApproved === false 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-[#ED4A43] text-white hover:shadow-md"
                  }`}
                  disabled={venue.isApproved === false}
                >
                  <FaTimesCircle className="mr-2" /> Reject
                </button>
              </div>
            </div>
          </div>
          ))}
        </div>
      </div>

      {/* Modal for Adding/Editing Venue */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-[#ED4A43] to-[#FF7A6E] p-6 text-white">
              <h3 className="text-2xl font-bold">
                {selectedVenue ? "Update Venue Details" : "Create Your Venue"}
              </h3>
              <p className="text-red-100 text-sm mt-1">
                All fields marked are required to create your venue
              </p>
            </div>
            
            <form className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Venue Name */}
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                      Venue Name
                    </label>
                    <input 
                      type="text" 
                      id="name"
                      name="name" 
                      value={newVenue.name} 
                      onChange={handleChange} 
                      placeholder="Enter venue name"
                      className="w-full p-3 bg-red-50 border-2 border-red-100 rounded-xl focus:outline-none focus:border-[#ED4A43] transition-colors" 
                    />
                  </div>
                  
                  {/* Venue Location */}
                  <div>
                    <label htmlFor="location" className="block text-gray-700 font-medium mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={newVenue.location}
                      onChange={handleChange}
                      placeholder="Enter venue location"
                      className="w-full p-3 bg-red-50 border-2 border-red-100 rounded-xl focus:outline-none focus:border-[#ED4A43] transition-colors"
                    />
                  </div>
                  
                  {/* Venue Image */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Venue Image
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="w-full flex items-center justify-center p-3 border-2 border-dashed border-red-300 bg-red-50 rounded-xl cursor-pointer hover:bg-red-100 transition-colors"
                      >
                        <div className="text-center">
                          <svg className="mx-auto h-10 w-10 text-[#ED4A43]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="mt-1 text-sm text-[#ED4A43]">Click to upload image</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Venue Details Section */}
                  <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                    <h3 className="text-gray-700 font-semibold mb-4 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-[#ED4A43]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Venue Details
                    </h3>

                    {/* Capacity Input */}
                    <div>
                      <label htmlFor="capacity" className="block text-gray-700 font-medium mb-1 text-sm">
                        Capacity
                      </label>
                      <input
                        type="number"
                        id="capacity"
                        name="capacity"
                        value={newVenue.capacity}
                        onChange={handleChange}
                        placeholder="Enter venue capacity"
                        className="w-full p-2 bg-white border border-red-200 rounded-lg focus:outline-none focus:border-[#ED4A43]"
                      />
                    </div>
                  </div>

                  {/* Additional Information about the venue could go here */}
                  <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                    <h3 className="text-gray-700 font-semibold mb-4 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-[#ED4A43]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Important Information
                    </h3>
                    <p className="text-sm text-gray-600">
                      Venues must be approved by an administrator before they can be used for events. 
                      Make sure all information is accurate and the image clearly shows the venue.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button Area */}
              <div className="mt-10 text-center flex justify-center space-x-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)} 
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSaveVenue} 
                  className="px-10 py-4 bg-[#ED4A43] text-white font-semibold rounded-xl shadow-lg hover:bg-[#D43C35] transform hover:-translate-y-1 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#ED4A43] focus:ring-offset-2"
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {selectedVenue ? "Save Changes" : "Create Venue"}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};