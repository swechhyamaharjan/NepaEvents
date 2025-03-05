import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    price: "",
    category: "", 
    venue: "",
      artist: "",
  });

  const [formStatus, setFormStatus] = useState("");
  const navigate = useNavigate();

  // Category options
  const categories = ["Music", "Sports", "Theater", "Conference", "Festival", "Other"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // this will send the form data to a backend later

    setFormStatus("Event created successfully!");
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      price: "",
      category: "", 
    });
    //redirect after submission to event page
    setTimeout(() => {
      navigate("/events"); 
    }, 2000); // 2-second delay for user to see the success message
  };

  return (
    <div className="min-h-screen max-w-3xl mx-auto py-12">
      <h2 className="text-4xl font-extrabold text-[#ED4A43] mb-8 text-center">
        Create Event
      </h2>

      {/* Form Container */}
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <p className="text-lg text-gray-600 mb-6 text-center">
          Fill in the details to create your event.
        </p>

        {formStatus && (
          <div className="bg-green-100 text-green-700 p-4 mb-4 rounded-md text-center">
            {formStatus}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Event Title */}
            <div>
              <label htmlFor="title" className="block text-lg text-gray-700">
                Event Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED4A43]"
              />
            </div>

            {/* Event Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-lg text-gray-700"
              >
                Event Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED4A43]"
              ></textarea>
            </div>

            {/* Event Date */}
            <div>
              <label htmlFor="date" className="block text-lg text-gray-700">
                Event Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED4A43]"
              />
            </div>

            {/* Ticket Price */}
            <div>
              <label htmlFor="price" className="block text-lg text-gray-700">
                Ticket Price ($)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED4A43]"
              />
            </div>

            {/* Artist */}
            <div>
              <label htmlFor="artist" className="block text-lg text-gray-700">
                Artist
              </label>
              <input
                type="text"
                id="artist"
                name="artist"
                value={formData.artist}
                onChange={handleChange}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED4A43]"
              />
            </div>

            {/* Event Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-lg text-gray-700"
              >
                Event Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED4A43]"
              >
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Venue */}
            <div>
              <label
                htmlFor="venue"
                className="block text-lg text-gray-700"
              >
                Venue
              </label>
              <select
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED4A43]"
              >
                <option value="">Select Venue</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">Event Image</label>
              <input type="file" onChange={handleImageChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
 
            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="px-8 py-3 bg-[#ED4A43] text-white font-semibold rounded-md hover:bg-[#D43C35] focus:outline-none"
              >
                Create Event
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
