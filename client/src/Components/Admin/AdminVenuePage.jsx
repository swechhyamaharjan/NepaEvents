import React, { useState } from "react";
import { FaEdit, FaTrashAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import venueImage from "/public/images/event1.png"; 
import axios from "axios";

export const AdminVenuePage = () => {
  const [venues, setVenues] = useState([
    { id: 1, name: "Hyatt Regency", location: "Kathmandu", capacity: 500, isApproved: null, image: venueImage },
    { id: 2, name: "Bhrikuti Mandap", location: "Kathmandu", capacity: 1000, isApproved: null, image: venueImage },
    { id: 3, name: "Pragya Hall", location: "Pokhara", capacity: 200, isApproved: null, image: venueImage },
    { id: 4, name: "Tudikhel", location: "Kathmandu", capacity: 1500, isApproved: null, image: venueImage },
    // Simulating user-requested venues
    { id: 5, name: "Requested Venue", location: "City Hall", capacity: 300, isApproved: null, image: venueImage },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [newVenue, setNewVenue] = useState({
    name: "",
    location: "",
    capacity: "",
    image: venueImage,
  });

  // Add or Edit Venue
  const handleSaveVenue = async () => {
    setShowModal(false);
    setSelectedVenue(null);
    console.log(newVenue)
    try {
      const response = await axios.post("http://localhost:3000/api/venue", newVenue)
      console.log(response);
    } catch (error) {
      console.log("Error: ", error);
      
    }
  };

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

  // Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewVenue((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-4xl font-bold text-center text-[#ED4A43] mb-8">Manage Venues</h2>

      <div className="mb-8 text-right">
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#ED4A43] text-white px-6 py-2 rounded-lg hover:bg-[#D43C35]"
        >
          Add New Venue
        </button>
      </div>

      {/* Venue List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {venues.map((venue) => (
          <div key={venue.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow relative">
            <img src={venue.image} alt={venue.name} className="w-full h-48 mb-4 object-cover rounded-md" />
            <h3 className="text-xl font-semibold text-gray-800 mb-1">{venue.name}</h3>
            <p className="text-md text-gray-600">{venue.location}</p>
            <p className="text-md text-gray-600">Capacity: {venue.capacity}</p>

            {/* Venue Approval Status */}
            {venue.isApproved === true ? (
              <p className="text-green-600 font-bold mt-2">✔ Approved</p>
            ) : venue.isApproved === false ? (
              <p className="text-red-600 font-bold mt-2">✖ Rejected</p>
            ) : (
              <p className="text-yellow-600 font-bold mt-2">Pending</p>
            )}

            {/* Approval Buttons (only for venues pending approval) */}
            {venue.isApproved === null && (
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleApproveVenue(venue.id)}
                  className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white"
                >
                  <FaCheckCircle className="inline mr-2" /> Approve
                </button>

                <button
                  onClick={() => handleRejectVenue(venue.id)}
                  className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
                >
                  <FaTimesCircle className="inline mr-2" /> Reject
                </button>
              </div>
            )}

            {/* Edit and Delete Buttons */}
            <div className="absolute top-4 right-4 flex space-x-4">
              <button
                onClick={() => handleEditVenue(venue)}
                className="bg-[#F9C74F] text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
              >
                <FaEdit size={20} />
              </button>

              <button
                onClick={() => handleDeleteVenue(venue.id)}
                className="bg-[#ED4A43] text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
              >
                <FaTrashAlt size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adding/Editing Venue */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[600px]">
            <h3 className="text-3xl font-semibold text-center text-[#ED4A43] mb-4">
              {selectedVenue ? "Edit Venue" : "Add New Venue"}
            </h3>
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">Venue Name</label>
              <input onChange={(e) => setNewVenue({name: e.target.value})} type="text" name="name" value={newVenue.name} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">Location</label>
              <input onChange={(e) => setNewVenue({location: e.target.value})} type="text" name="location" value={newVenue.location} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">Capacity</label>
              <input onChange={(e) => setNewVenue({capacity: e.target.value})} type="number" name="capacity" value={newVenue.capacity} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">Venue Image</label>
              <input type="file" onChange={handleImageChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
            <div className="flex justify-between">
              <button onClick={() => setShowModal(false)} className="px-6 py-2 bg-gray-500 text-white rounded-md">Cancel</button>
              <button onClick={handleSaveVenue} className="px-6 py-2 bg-[#ED4A43] text-white rounded-md">{selectedVenue ? "Save Changes" : "Add Venue"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
