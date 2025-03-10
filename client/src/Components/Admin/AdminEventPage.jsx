import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";
import eventImage from "/public/images/event1.png";
import axios from "axios";
import toast from "react-hot-toast";

export const AdminEventPage = () => {
  const [events, setEvents] = useState([
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [venues, setVenues] = useState(null);
  const [categories, setCategories] = useState(null);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    description: "",
    venue: "",
    price: "",
    artist: "",
    category: "",
    image: "",
  });

  useEffect(()=>{
    async function fetchData(){
    try {
      const response = await axios.get("http://localhost:3000/api/venue");
      setVenues(response.data);
    } catch (error) {
       console.log(error);
    }
  }
  fetchData();
  },[])

  useEffect(()=>{
    async function fetchData(){
    try {
      const response = await axios.get("http://localhost:3000/api/category");
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  }
    fetchData();
  }, [])


  // Add or Edit Event
  const handleSaveEvent = async(e) => {
    e.preventDefault();
    console.log(newEvent);
    const formData = new FormData();
    formData.append("title", newEvent.name);
    formData.append("date", newEvent.date);
    formData.append("description", newEvent.description);
    formData.append("venue", newEvent.venue);
    formData.append("price", newEvent.price);
    formData.append("artist", newEvent.artist);
    formData.append("category", newEvent.category);
    if (newEvent.image){
      formData.append("image", newEvent.image);
    }
    console.log(formData);
    try {
      const response = await axios.post("http://localhost:3000/api/event", formData, {
          headers: { "Content-Type": "multipart/form-data"},
          withCredentials: true
      });
      toast.success("Event created successfully!");
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error("Event failed to create!");
    }
    setShowModal(false);
  };
  useEffect(()=>{
    async function fetchEvents(){
      try {
        const response = await axios.get("http://localhost:3000/api/event");
        setEvents(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    }
fetchEvents();
  },[])

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
        setNewEvent((prev) => ({ ...prev, image:file }));
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
        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ED4A43] to-[#ED4A43] mb-2 text-center">Event Dashboard</h2>
        <p className="text-center text-gray-500 mb-12">Manage and organize your events in one place</p>

        <div className="flex justify-end mb-10">
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#ED4A43] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center"
          >
            <span className="mr-2">+</span> Create New Event
          </button>
        </div>

        {/* Event List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 w-full">
                    <div className="flex justify-between">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="bg-white/90 text-[#ED4A43] p-3 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="bg-white/90 text-[#ED4A43] p-3 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
                      >
                        <FaTrashAlt size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                <img 
                  src={`http://localhost:3000/${event.image}`} 
                  alt={event.name} 
                  className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div 
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full border ${getStatusColor(event.isApproved)} text-xs font-bold`}
                >
                  {getStatusText(event.isApproved)}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800">{event.name}</h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="mr-2 text-[#ED4A43]" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-[#ED4A43]" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaMoneyBillWave className="mr-2 text-[#ED4A43]" />
                    <span className="font-semibold">Rs. {event.price}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    onClick={() => handleApproveEvent(event.id)}
                    className={`px-4 py-3 rounded-lg flex items-center justify-center ${
                      event.isApproved === true 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-md"
                    }`}
                    disabled={event.isApproved === true}
                  >
                    <FaCheckCircle className="mr-2" /> Approve
                  </button>
                  <button
                    onClick={() => handleRejectEvent(event.id)}
                    className={`px-4 py-3 rounded-lg flex items-center justify-center ${
                      event.isApproved === false 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "bg-[#ED4A43] text-white hover:shadow-md"
                    }`}
                    disabled={event.isApproved === false}
                  >
                    <FaTimesCircle className="mr-2" /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Adding/Editing Event - UPDATED TO MATCH CreateEvent STYLE */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-[#ED4A43] to-[#FF7A6E] p-6 text-white">
              <h3 className="text-2xl font-bold">
                {selectedEvent ? "Update Event Details" : "Create Your Event"}
              </h3>
              <p className="text-red-100 text-sm mt-1">
                All fields marked are required to create your event
              </p>
            </div>
            
            <form onSubmit={handleSaveEvent} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Event Title */}
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                      Event Title
                    </label>
                    <input 
                      type="text" 
                      id="name"
                      name="name" 
                      value={newEvent.name} 
                      onChange={handleChange} 
                      placeholder="Give your event a catchy title"
                      className="w-full p-3 bg-red-50 border-2 border-red-100 rounded-xl focus:outline-none focus:border-[#ED4A43] transition-colors" 
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
                      value={newEvent.description}
                      onChange={handleChange}
                      placeholder="Describe what makes your event special..."
                      rows="5"
                      className="w-full p-3 bg-red-50 border-2 border-red-100 rounded-xl focus:outline-none focus:border-[#ED4A43] transition-colors"
                    ></textarea>
                  </div>
                  
                  {/* Event Image */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Event Image
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
                  {/* Event Details Section */}
                  <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                    <h3 className="text-gray-700 font-semibold mb-4 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-[#ED4A43]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Event Details
                    </h3>

                    {/* Two Column Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Event Date */}
                      <div>
                        <label htmlFor="date" className="block text-gray-700 font-medium mb-1 text-sm">
                          Date
                        </label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={newEvent.date}
                          onChange={handleChange}
                          className="w-full p-2 bg-white border border-red-200 rounded-lg focus:outline-none focus:border-[#ED4A43]"
                        />
                      </div>

                      {/* Ticket Price */}
                      <div>
                        <label htmlFor="price" className="block text-gray-700 font-medium mb-1 text-sm">
                          Price (Rs.)
                        </label>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={newEvent.price}
                          onChange={handleChange}
                          placeholder="0.00"
                          className="w-full p-2 bg-white border border-red-200 rounded-lg focus:outline-none focus:border-[#ED4A43]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-gray-700 font-medium mb-1">
                      Event Category
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        name="category"
                        value={newEvent.category}
                        onChange={handleChange}
                        className="w-full p-3 bg-red-50 border-2 border-red-100 rounded-xl appearance-none focus:outline-none focus:border-[#ED4A43] transition-colors"
                      >
                        <option value="">Select Category</option>
                        {categories && categories.map((category, index) => (
                          <option key={index} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="h-5 w-5 text-[#ED4A43]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Artist */}
                  <div>
                    <label htmlFor="artist" className="block text-gray-700 font-medium mb-1">
                      Artist/Performer
                    </label>
                    <input
                      type="text"
                      id="artist"
                      name="artist"
                      value={newEvent.artist}
                      onChange={handleChange}
                      placeholder="Who's performing or presenting?"
                      className="w-full p-3 bg-red-50 border-2 border-red-100 rounded-xl focus:outline-none focus:border-[#ED4A43] transition-colors"
                    />
                  </div>

                  {/* Venue */}
                  <div>
                    <label htmlFor="venue" className="block text-gray-700 font-medium mb-1">
                      Venue
                    </label>
                    <div className="relative">
                      <select
                        id="venue"
                        name="venue"
                        value={newEvent.venue}
                        onChange={handleChange}
                        className="w-full p-3 bg-red-50 border-2 border-red-100 rounded-xl appearance-none focus:outline-none focus:border-[#ED4A43] transition-colors"
                      >
                        <option value="">Select Venue</option>
                        {venues && venues.map((venue, index) => (
                          <option key={index} value={venue._id}>
                            {venue.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="h-5 w-5 text-[#ED4A43]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button Area */}
              <div className="mt-10 text-center flex justify-center space-x-4">
                <button 
                  onClick={() => setShowModal(false)} 
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  className="px-10 py-4 bg-[#ED4A43] text-white font-semibold rounded-xl shadow-lg hover:bg-[#D43C35] transform hover:-translate-y-1 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#ED4A43] focus:ring-offset-2"
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {selectedEvent ? "Save Changes" : "Create Event"}
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