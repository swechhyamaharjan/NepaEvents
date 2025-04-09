import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaAddressCard, FaImage, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    profileImage: null,
    imagePreview: null
  });

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate("/login");
      return;
    }

    // Populate form with user data
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      profileImage: null,
      imagePreview: user.profileImage || null
    });
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profileImage: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create form data to handle file upload
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("address", formData.address);
      
      if (formData.profileImage) {
        formDataToSend.append("profileImage", formData.profileImage);
      }

      const response = await axios.put(
        "http://localhost:3000/profile/update",
        formDataToSend,
        { 
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      // Update user context with new data
      setUser(response.data.user);
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to update profile.";
      toast.error(errorMessage);
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate("/profile")}
          className="flex items-center text-gray-600 hover:text-[#ED4A43] transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Profile
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h1>

        <form onSubmit={handleSubmit}>
          {/* Profile Image */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-[#ED4A43] shadow-md">
                {formData.imagePreview ? (
                  <img 
                    src={formData.imagePreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                    <FaUser size={50} />
                  </div>
                )}
              </div>
              <label 
                htmlFor="profileImage" 
                className="absolute bottom-0 right-0 bg-[#ED4A43] text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-[#D43C35] transition-colors"
              >
                <FaImage size={16} />
                <input 
                  type="file" 
                  id="profileImage" 
                  name="profileImage" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  id="fullName" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleInputChange} 
                  className="pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-[#ED4A43] focus:border-[#ED4A43] outline-none transition-colors" 
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  className="pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-[#ED4A43] focus:border-[#ED4A43] outline-none transition-colors" 
                  placeholder="Your email address"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <input 
                  type="tel" 
                  id="phoneNumber" 
                  name="phoneNumber" 
                  value={formData.phoneNumber} 
                  onChange={handleInputChange} 
                  className="pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-[#ED4A43] focus:border-[#ED4A43] outline-none transition-colors" 
                  placeholder="Your phone number"
                />
              </div>
            </div>

            {/* Address */}
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaAddressCard className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  className="pl-10 w-full py-3 border border-gray-300 rounded-lg focus:ring-[#ED4A43] focus:border-[#ED4A43] outline-none transition-colors" 
                  placeholder="Your address"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button 
              type="button" 
              onClick={() => navigate("/profile")}
              className="mr-4 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-3 bg-gradient-to-r from-[#ED4A43] to-[#FF6B64] text-white rounded-lg font-medium hover:from-[#D43C35] hover:to-[#ED4A43] transition-colors flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;