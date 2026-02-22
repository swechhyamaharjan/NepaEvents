import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { FaEdit, FaTrashAlt, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave, FaUser, FaTag } from "react-icons/fa";
import toast from "react-hot-toast";

export const AdminEventPage = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [venues, setVenues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
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
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    fetchVenues();
    fetchCategories();
    fetchEvents();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await api.get("/api/venue");
      setVenues(response.data);
    } catch (error) {
      toast.error("Failed to fetch venues");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/category");
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/event");
      setEvents(response.data);
    } catch (error) {
      toast.error("Failed to fetch events");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", newEvent.name);
    formData.append("date", newEvent.date);
    formData.append("description", newEvent.description);
    formData.append("venue", newEvent.venue);
    formData.append("price", newEvent.price);
    formData.append("artist", newEvent.artist);
    formData.append("category", newEvent.category);
    if (newEvent.image && typeof newEvent.image !== 'string') {
      formData.append("image", newEvent.image);
    }

    try {
      if (selectedEvent) {
        await api.patch(`/api/event/${selectedEvent._id}`, formData);
        toast.success("Event updated successfully!");
      } else {
        await api.post("/api/event", formData);
        toast.success("Event created successfully!");
      }
      fetchEvents();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to save event");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedEvent(null);
    setImagePreview(null);
    setNewEvent({
      name: "",
      date: "",
      description: "",
      venue: "",
      price: "",
      artist: "",
      category: "",
      image: "",
    });
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setImagePreview(event.image ? `${api.defaults.baseURL}/${event.image}` : null);
    setNewEvent({
      name: event.title,
      date: event.date ? event.date.split('T')[0] : '',
      description: event.description,
      venue: event.venue,
      price: event.price,
      artist: event.artist,
      category: event.category,
      image: event.image
    });
    setShowModal(true);
  };

  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;
    setIsLoading(true);
    try {
      await api.delete(`/api/event/${eventToDelete}`);
      toast.success("Event deleted successfully!");
      fetchEvents();
      setShowDeleteModal(false);
      setEventToDelete(null);
    } catch (error) {
      toast.error("Failed to delete event");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewEvent(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const getCategoryName = (id) => categories.find(c => c._id === id)?.name || "N/A";
  const getVenueName = (id) => venues.find(v => v._id === id)?.name || "N/A";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#ED4A43] mb-8">Event Dashboard</h2>
        <div className="flex justify-end mb-6">
          <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-[#ED4A43] text-white px-6 py-2 rounded-lg font-bold">
            + Create New Event
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.length > 0 ? (
            events.filter(e => !e.isRequested).map((event) => (
              <div key={event._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <img src={`${api.defaults.baseURL}/${event.image}`} alt={event.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                  <div className="text-sm text-gray-600 mb-4 space-y-1">
                    <p className="flex items-center"><FaCalendarAlt className="mr-2 text-[#ED4A43]" /> {new Date(event.date).toLocaleDateString()}</p>
                    <p className="flex items-center"><FaMapMarkerAlt className="mr-2 text-[#ED4A43]" /> {getVenueName(event.venue)}</p>
                    <p className="flex items-center font-bold font-semibold"><FaMoneyBillWave className="mr-2 text-[#ED4A43]" /> Rs. {event.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditEvent(event)} className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm">Edit</button>
                    <button onClick={() => { setEventToDelete(event._id); setShowDeleteModal(true); }} className="flex-1 bg-[#ED4A43] text-white py-2 rounded-lg text-sm">Delete</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400">No events found.</p>
          )}
        </div>
      </div>

      {/* Simplified Modal Logic */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-bold mb-4">{selectedEvent ? "Edit Event" : "Create Event"}</h3>
            <form onSubmit={handleSaveEvent} className="space-y-4">
              <input name="name" value={newEvent.name} onChange={e => setNewEvent(p => ({ ...p, name: e.target.value }))} placeholder="Title" className="w-full p-2 border rounded" required />
              <textarea name="description" value={newEvent.description} onChange={e => setNewEvent(p => ({ ...p, description: e.target.value }))} placeholder="Description" className="w-full p-2 border rounded" required />
              <div className="grid grid-cols-2 gap-4">
                <input type="date" name="date" value={newEvent.date} onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))} className="p-2 border rounded" required />
                <input type="number" name="price" value={newEvent.price} onChange={e => setNewEvent(p => ({ ...p, price: e.target.value }))} placeholder="Price" className="p-2 border rounded" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select name="venue" value={newEvent.venue} onChange={e => setNewEvent(p => ({ ...p, venue: e.target.value }))} className="p-2 border rounded" required>
                  <option value="">Select Venue</option>
                  {venues.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
                </select>
                <select name="category" value={newEvent.category} onChange={e => setNewEvent(p => ({ ...p, category: e.target.value }))} className="p-2 border rounded" required>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <input name="artist" value={newEvent.artist} onChange={e => setNewEvent(p => ({ ...p, artist: e.target.value }))} placeholder="Artist" className="w-full p-2 border rounded" />
              <input type="file" onChange={handleImageChange} className="w-full p-2" />
              {imagePreview && <img src={imagePreview} className="h-32 object-cover rounded" alt="Preview" />}
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" disabled={isLoading} className="px-6 py-2 bg-[#ED4A43] text-white rounded font-bold">
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-bold">Delete Event</h3>
            <p className="text-gray-600 my-4">Are you sure?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={confirmDeleteEvent} className="px-4 py-2 bg-[#ED4A43] text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEventPage;