import React, { useState } from "react";
import { FaEdit, FaTrashAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import eventImage from "/public/images/event1.png";

export const AdminEventPage = () => {
  const [events, setEvents] = useState([
    { id: 1, name: "Concert X", date: "December 31, 2024", location: "Hyatt Regency", price: 1000, isApproved: null, image: eventImage },
    { id: 2, name: "Live Performance", date: "January 5, 2025", location: "Bhrikuti Mandap", price: 800, isApproved: null, image: eventImage },
    { id: 3, name: "Dancing Show", date: "January 10, 2025", location: "Pragya Hall", price: 500, isApproved: null, image: eventImage },
    { id: 4, name: "Comedy Show", date: "January 15, 2025", location: "Tudikhel", price: 700, isApproved: null, image: eventImage },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    location: "",
    price: "",
    image: eventImage,
  });

  // Add or Edit Event
  const handleSaveEvent = () => {
    if (!newEvent.name || !newEvent.date || !newEvent.location || !newEvent.price) {
      alert("All fields are required!");
      return;
    }
    if (selectedEvent) {
      setEvents(events.map(event => (event.id === selectedEvent.id ? { ...newEvent, id: event.id } : event)));
    } else {
      setEvents([...events, { id: events.length + 1, ...newEvent, isApproved: null }]);
    }
    setShowModal(false);
    setSelectedEvent(null);
    setNewEvent({ name: "", date: "", location: "", price: "", image: eventImage });
  };

  // Open Edit Modal
  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setNewEvent(event);
    setShowModal(true);
  };

  // Delete Event
  const handleDeleteEvent = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((event) => event.id !== eventId));
    }
  };

  // Approve Event
  const handleApproveEvent = (eventId) => {
    setEvents(events.map((event) => (event.id === eventId ? { ...event, isApproved: true } : event)));
  };

  // Reject Event
  const handleRejectEvent = (eventId) => {
    setEvents(events.map((event) => (event.id === eventId ? { ...event, isApproved: false } : event)));
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEvent((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-4xl font-bold text-center text-[#ED4A43] mb-8">Manage Events</h2>

      <div className="mb-8 text-right">
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#ED4A43] text-white px-6 py-2 rounded-lg hover:bg-[#D43C35]"
        >
          Add New Event
        </button>
      </div>

      {/* Event List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div key={event.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow relative">
            <img src={event.image} alt={event.name} className="w-full h-48 mb-4 object-cover rounded-md" />
            <h3 className="text-xl font-semibold text-gray-800 mb-1">{event.name}</h3>
            <p className="text-md text-gray-600">{event.date}</p>
            <p className="text-md text-gray-600">{event.location}</p>
            <p className="text-lg font-semibold text-gray-800 mt-2">Rs.{event.price}</p>

            {/* Event Approval Status */}
            {event.isApproved === true ? (
              <p className="text-green-600 font-bold mt-2">✔ Approved</p>
            ) : event.isApproved === false ? (
              <p className="text-red-600 font-bold mt-2">✖ Rejected</p>
            ) : (
              <p className="text-yellow-600 font-bold mt-2">Pending</p>
            )}

            {/* Approval Buttons (only for existing events) */}
            {!selectedEvent && (
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleApproveEvent(event.id)}
                  className={`px-4 py-2 rounded-md ${event.isApproved === true ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"} text-white`}
                  disabled={event.isApproved === true}
                >
                  <FaCheckCircle className="inline mr-2" /> Approve
                </button>

                <button
                  onClick={() => handleRejectEvent(event.id)}
                  className={`px-4 py-2 rounded-md ${event.isApproved === false ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"} text-white`}
                  disabled={event.isApproved === false}
                >
                  <FaTimesCircle className="inline mr-2" /> Reject
                </button>
              </div>
            )}

            {/* Edit and Delete Buttons */}
            <div className="absolute top-4 right-4 flex space-x-4">
              <button
                onClick={() => handleEditEvent(event)}
                className="bg-[#F9C74F] text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
              >
                <FaEdit size={20} />
              </button>

              <button
                onClick={() => handleDeleteEvent(event.id)}
                className="bg-[#ED4A43] text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
              >
                <FaTrashAlt size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adding/Editing Event */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h3 className="text-3xl font-semibold text-center text-[#ED4A43] mb-4">
              {selectedEvent ? "Edit Event" : "Add New Event"}
            </h3>
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">Event Name</label>
              <input type="text" name="name" value={newEvent.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">Date</label>
              <input type="date" name="date" value={newEvent.date} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">Location</label>
              <input type="text" name="location" value={newEvent.location} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">Price</label>
              <input type="number" name="price" value={newEvent.price} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">Event Image</label>
              <input type="file" onChange={handleImageChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
            <div className="flex justify-between">
              <button onClick={() => setShowModal(false)} className="px-6 py-2 bg-gray-500 text-white rounded-md">Cancel</button>
              <button onClick={handleSaveEvent} className="px-6 py-2 bg-[#ED4A43] text-white rounded-md">{selectedEvent ? "Save Changes" : "Add Event"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
