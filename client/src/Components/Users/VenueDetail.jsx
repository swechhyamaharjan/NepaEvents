import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaUserFriends,
  FaStar,
  FaInfoCircle,
  FaTv,
  FaWifi,
  FaParking,
  FaSnowflake,
  FaHome,
  FaArrowLeft,
  FaBuilding,
  FaUsers,
  FaHeart,
  FaSearch,
  FaTrashAlt, FaMapMarked
} from "react-icons/fa";
import api from '../../api/api';
import VenueLocationMap from "../VenueLocationMap";

export const VenueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState(null);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [venue, setVenue] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    artist: "",
    image: "",
    price: "",
  });

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await api.get(`/api/venue/${id}?date=${today}`);
        setVenue(response.data.data);
        setSelectedVenue(response.data.data);
      } catch (error) {
        console.error("Error fetching venue:", error);
      }
    };
    fetchVenue();
  }, [id]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await api.get("/api/category");
        setCategories(response.data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch categories");
      }
    }
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price' && value < 0) return;
    setBookingDetails((prev) => ({ ...prev, [name]: value }));
    if (name === 'date' && value) checkVenueAvailability(value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBookingDetails((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImagePreview(null);
    setBookingDetails((prev) => ({ ...prev, image: null }));
  };

  const checkVenueAvailability = async (date) => {
    try {
      const formattedDate = new Date(date).toISOString().split('T')[0];
      const response = await api.get(`/api/venue/${id}/availability/${formattedDate}`);
      if (!response.data.available) {
        toast.error("This venue is already booked for the selected date.");
        setVenue(prev => ({ ...prev, isBooked: true }));
        return false;
      }
      setVenue(prev => ({ ...prev, isBooked: false }));
      return true;
    } catch (error) {
      console.error("Error checking availability:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isAvailable = await checkVenueAvailability(bookingDetails.date);
      if (!isAvailable) return;

      const formData = new FormData();
      formData.append("venue", venue._id);
      formData.append("title", bookingDetails.title);
      formData.append("description", bookingDetails.description);
      formData.append("category", bookingDetails.category);
      formData.append("date", bookingDetails.date);
      formData.append("artist", bookingDetails.artist);
      formData.append("ticketPrice", bookingDetails.price);
      formData.append("image", bookingDetails.image);

      await api.post("/api/venue-bookings", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Booking request sent successfully!");
      setIsBookingConfirmed(true);
    } catch (error) {
      toast.error("Failed to submit booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookNow = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsBookingConfirmed(false);
  };
  const toggleFavorite = () => setIsFavorite(!isFavorite);
  const goBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <button onClick={goBack} className="flex items-center text-gray-600 hover:text-[#ED4A43] mb-8">
          <FaArrowLeft className="mr-2" /> Back to Venues
        </button>

        {venue && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
            <div className="relative">
              <img
                src={`${api.defaults.baseURL}/${venue.image}`}
                alt={venue.name}
                className="w-full h-96 object-cover"
              />
              <button onClick={toggleFavorite} className="absolute top-6 right-6 bg-white p-3 rounded-full shadow-lg">
                <FaHeart size={22} className={isFavorite ? "text-[#ED4A43]" : "text-gray-400"} />
              </button>
            </div>
            <div className="p-8">
              <h1 className="text-3xl font-bold mb-4">{venue.name}</h1>
              <div className="flex flex-col md:flex-row justify-between">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600"><FaMapMarkerAlt className="mr-2 text-[#ED4A43]" />{venue.location}</div>
                  <div className="flex items-center text-gray-600"><FaUsers className="mr-2 text-[#ED4A43]" />Capacity: {venue.capacity}</div>
                </div>
                <div className="mt-6 md:mt-0 text-center">
                  <p className="text-3xl font-bold text-[#ED4A43] mb-4">Rs. {venue.price}</p>
                  <button
                    onClick={handleBookNow}
                    disabled={venue.isBooked}
                    className={`bg-[#ED4A43] text-white px-8 py-3 rounded-lg font-medium ${venue.isBooked ? 'opacity-50' : 'hover:bg-[#d43c35]'}`}
                  >
                    {venue.isBooked ? 'Unavailable' : 'Book Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">
          <h3 className="text-2xl font-bold mb-6">Location</h3>
          <VenueLocationMap existingCoordinates={venue?.locationCoordinates} />
        </div>
      </div>

      {isModalOpen && selectedVenue && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {!isBookingConfirmed ? (
              <form onSubmit={handleSubmit} className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-[#ED4A43]">Book {selectedVenue.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" name="title" placeholder="Event Title" onChange={handleChange} className="p-3 border rounded-xl" required />
                  <input type="date" name="date" onChange={handleChange} className="p-3 border rounded-xl" required />
                  <textarea name="description" placeholder="Description" onChange={handleChange} className="p-3 border rounded-xl md:col-span-2" required />
                  <select name="category" onChange={handleChange} className="p-3 border rounded-xl" required>
                    <option value="">Select Category</option>
                    {categories?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                  <input type="number" name="price" placeholder="Price" onChange={handleChange} className="p-3 border rounded-xl" required />
                  <input type="text" name="artist" placeholder="Artist" onChange={handleChange} className="p-3 border rounded-xl" required />
                  <input type="file" onChange={handleImageChange} className="p-3 border rounded-xl md:col-span-2" required />
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button type="button" onClick={closeModal} className="px-6 py-2 bg-gray-200 rounded-lg">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[#ED4A43] text-white rounded-lg">
                    {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-12 text-center">
                <h3 className="text-2xl font-bold text-[#ED4A43] mb-4">Booking Confirmed!</h3>
                <button onClick={closeModal} className="px-8 py-2 bg-[#ED4A43] text-white rounded-lg">Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueDetail;