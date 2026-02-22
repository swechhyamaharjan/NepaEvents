import React, { useState, useEffect } from "react";
import api from '../../api/api';
import { FaEdit, FaTrashAlt, FaCheckCircle, FaTimesCircle, FaMapMarkerAlt, FaUsers, FaBuilding } from "react-icons/fa";
import { toast } from "react-hot-toast";

export const AdminVenuePage = () => {
  const [venues, setVenues] = useState([]);
  const [activeTab, setActiveTab] = useState("adminVenues");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [newVenue, setNewVenue] = useState({
    name: "",
    location: "",
    capacity: "",
    image: "",
    price: "",
  });

  useEffect(() => {
    fetchVenues();
    fetchBookingRequests();
  }, [refreshTrigger]);

  const fetchVenues = async () => {
    try {
      const response = await api.get('/api/venue');
      setVenues(response.data);
    } catch (error) {
      toast.error("Failed to load venues");
    }
  };

  const fetchBookingRequests = async () => {
    try {
      const response = await api.get("/api/venue-bookings");
      setBookingRequests(response.data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleSaveVenue = async () => {
    const formData = new FormData();
    formData.append("name", newVenue.name);
    formData.append("location", newVenue.location);
    formData.append("capacity", newVenue.capacity);
    formData.append("price", newVenue.price);
    if (newVenue.image && typeof newVenue.image !== 'string') {
      formData.append("image", newVenue.image);
    }

    try {
      if (selectedVenue) {
        await api.patch(`/api/venue/${selectedVenue._id}`, formData);
        toast.success("Venue updated!");
      } else {
        await api.post('/api/venue', formData);
        toast.success("Venue added!");
      }
      setShowModal(false);
      setRefreshTrigger(p => p + 1);
    } catch (error) {
      toast.error("Failed to save venue");
    }
  };

  const handleDeleteVenue = async (id) => {
    if (!window.confirm("Delete this venue?")) return;
    try {
      await api.delete(`/api/venue/${id}`);
      toast.success("Venue deleted!");
      setRefreshTrigger(p => p + 1);
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.put(`/api/venue-bookings/${id}/${action}`);
      toast.success(`Venue ${action}ed!`);
      setRefreshTrigger(p => p + 1);
    } catch (error) {
      toast.error(`Failed to ${action}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#ED4A43] mb-8">Venue Dashboard</h2>
        <div className="flex justify-center mb-8 gap-4">
          <button onClick={() => setActiveTab("adminVenues")} className={`px-6 py-2 rounded-full ${activeTab === "adminVenues" ? "bg-[#ED4A43] text-white" : "bg-white text-gray-600"}`}>Admin Venues</button>
          <button onClick={() => setActiveTab("requestedVenues")} className={`px-6 py-2 rounded-full ${activeTab === "requestedVenues" ? "bg-[#ED4A43] text-white" : "bg-white text-gray-600"}`}>User Requests</button>
        </div>

        {activeTab === "adminVenues" ? (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => { setSelectedVenue(null); setNewVenue({ name: "", location: "", capacity: "", price: "" }); setImagePreview(null); setShowModal(true); }} className="bg-[#ED4A43] text-white px-6 py-2 rounded-lg">+ Add Venue</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {venues.map(v => (
                <div key={v._id} className="bg-white rounded-xl shadow overflow-hidden">
                  <img src={`${api.defaults.baseURL}/${v.image}`} className="w-full h-48 object-cover" alt={v.name} />
                  <div className="p-4 text-left">
                    <h3 className="font-bold">{v.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{v.location}</p>
                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedVenue(v); setNewVenue(v); setImagePreview(`${api.defaults.baseURL}/${v.image}`); setShowModal(true); }} className="flex-1 bg-blue-500 text-white py-1 rounded">Edit</button>
                      <button onClick={() => handleDeleteVenue(v._id)} className="flex-1 bg-red-500 text-white py-1 rounded">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookingRequests.map(b => (
              <div key={b._id} className="bg-white rounded-xl shadow p-4 text-left">
                <h3 className="font-bold">{b.venue?.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{b.organizer?.fullName}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleAction(b._id, "approve")} className="flex-1 bg-green-500 text-white py-1 rounded">Approve</button>
                  <button onClick={() => handleAction(b._id, "reject")} className="flex-1 bg-[#ED4A43] text-white py-1 rounded">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="font-bold text-lg mb-4">{selectedVenue ? "Edit Venue" : "Add Venue"}</h3>
            <div className="space-y-3">
              <input value={newVenue.name} onChange={e => setNewVenue({ ...newVenue, name: e.target.value })} placeholder="Name" className="w-full p-2 border rounded" />
              <input value={newVenue.location} onChange={e => setNewVenue({ ...newVenue, location: e.target.value })} placeholder="Location" className="w-full p-2 border rounded" />
              <input value={newVenue.capacity} onChange={e => setNewVenue({ ...newVenue, capacity: e.target.value })} placeholder="Capacity" className="w-full p-2 border rounded" />
              <input type="file" onChange={e => { const f = e.target.files[0]; if (f) { setNewVenue({ ...newVenue, image: f }); setImagePreview(URL.createObjectURL(f)); } }} className="w-full" />
              {imagePreview && <img src={imagePreview} className="h-20 object-cover" alt="preview" />}
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button onClick={handleSaveVenue} className="px-6 py-2 bg-[#ED4A43] text-white rounded">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVenuePage;