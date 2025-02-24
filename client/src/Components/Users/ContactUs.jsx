import React, { useState } from "react";

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission success
    setFormStatus("Message sent successfully! Thank you for reaching out.");
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12">
       <h2 className="text-4xl font-extrabold text-[#ED4A43] mb-8">
          Contact Us
        </h2>

      {/* Form Container */}
      <div className="w-full max-w-2xl px-6 py-8 bg-white rounded-lg shadow-lg">
        <p className="text-lg text-gray-600 mb-6 text-center">
          Have a question or feedback? We would love to hear from you.
        </p>

        {/* Success message */}
        {formStatus && (
          <div className="bg-green-100 text-green-700 p-4 mb-4 rounded-md text-center">
            {formStatus}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-lg text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED4A43]"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-lg text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED4A43]"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-lg text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED4A43]"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="px-8 py-3 bg-[#ED4A43] text-white font-semibold rounded-md hover:bg-[#D43C35] focus:outline-none"
              >
                Send Message
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
