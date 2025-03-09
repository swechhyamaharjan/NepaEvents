import React from "react";
import bgImage from "/public/images/bg-image.png";
import event1 from "/public/images/event1.png";
import event2 from "/public/images/event2.png";
import event3 from "/public/images/event3.png";
import event4 from "/public/images/event4.png";
import category1 from "/public/images/event1.png";
import category2 from "/public/images/event2.png";
import category3 from "/public/images/event3.png";
import category4 from "/public/images/event4.png";
import category5 from "/public/images/event2.png";
import category6 from "/public/images/event1.png";
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaTicketAlt } from "react-icons/fa";

export const HomePage = () => {
  const today = new Date();
  const options = { day: "numeric", month: "short", year: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options);
  const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" });

  const events = [
    { img: event1, time: "7:00 PM", name: "Concert X", place: "Hyatt Regency" },
    {
      img: event2,
      time: "8:30 PM",
      name: "Live Performance",
      place: "Bhrikuti Mandap",
    },
    {
      img: event3,
      time: "6:00 PM",
      name: "Dancing Show",
      place: "Pragya Hall",
    },
    { img: event4, time: "9:00 PM", name: "Comedy Show", place: "Tudikhel" },
  ];
  // Define categories for the "Events by Category" section
  const categories = [
    { img: category1, name: "Music Concerts" },
    { img: category2, name: "Theater & Drama" },
    { img: category3, name: "Comedy Shows" },
    { img: category4, name: "Dance Performances" },
    { img: category5, name: "Workshops" },
    { img: category6, name: "Exhibitions" },
  ];

  return (
    <div className="App font-sans">
      {/* Hero Section with Diagonal Design */}
      <div className="relative w-full h-[90vh] overflow-hidden">
        {/* Background Image with Tilt */}
        <div
          className="absolute inset-0 bg-cover bg-center transform -skew-y-3 scale-110 origin-top-right"
          style={{ 
            backgroundImage: `url(${bgImage})`,
            top: "-5%",
            height: "110%"
          }}
        ></div>

        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent -skew-y-3 scale-110 origin-top-right" style={{ top: "-5%", height: "110%" }}></div>

        {/* Content container */}
        <div className="absolute inset-0 flex flex-col justify-center items-start px-8 lg:px-20 z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              Experience the <span className="text-[#ED4A43]">Best Events</span> in Town
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-200">
              Celebrate with top artists, exciting activities, and unforgettable
              moments.
            </p>

            {/* Search Bar with Design */}
            <div className="w-full max-w-xl backdrop-blur-sm bg-white/10 p-1 rounded-full">
              <form className="flex items-center">
                <input
                  type="text"
                  placeholder="Search events, artists, or venues"
                  className="px-6 py-4 w-full bg-transparent text-white placeholder-gray-300 border-none outline-none"
                />
                <button
                  type="submit"
                  className="p-4 bg-[#ED4A43] hover:bg-[#D43C35] text-white font-semibold rounded-full min-w-28 shadow-lg shadow-[#ED4A43]/30"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Event Section */}
      <div className="bg-gray-50 py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with Date Card */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-4 md:space-y-0">
            <h1 className="text-3xl font-bold text-gray-800 relative pl-4">
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#ED4A43] rounded-full"></span>
              Today's Events
            </h1>
            <div className="flex items-center bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="bg-[#ED4A43] p-4 text-white">
                <FaCalendarAlt className="text-2xl" />
              </div>
              <div className="text-left p-4">
                <p className="text-lg font-semibold text-gray-800">{formattedDate}</p>
                <p className="text-sm text-gray-600">{dayOfWeek}</p>
              </div>
            </div>
          </div>

          {/* Events Card Grid with Improved Design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {events.map((event, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Event Image Banner */}
                <div className="h-48 w-full bg-gray-200 overflow-hidden">
                  <img
                    src={event.img}
                    alt={event.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Time Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
                    <div className="flex items-center space-x-1">
                      <FaClock className="text-[#ED4A43] text-xs" />
                      <span className="text-sm font-medium text-gray-800">{event.time}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#ED4A43] transition-colors">
                    {event.name}
                  </h3>
                  <p className="flex items-center text-gray-600 mb-4">
                    <FaMapMarkerAlt className="text-[#ED4A43] mr-2" />
                    {event.place}
                  </p>
                  <button className="w-full flex items-center justify-center py-3 px-4 bg-transparent border-2 border-[#ED4A43] text-[#ED4A43] font-semibold rounded-lg group-hover:bg-[#ED4A43] group-hover:text-white transition-all duration-300">
                    <FaTicketAlt className="mr-2" />
                    Buy Ticket
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Events by Category Section */}
      <div className="bg-white py-16 px-4 md:px-8 relative">
        {/* Decorative Background Element */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gray-50 clip-path-polygon"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 relative pl-4">
            <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#ED4A43] rounded-full"></span>
            Events by Category
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group bg-gray-50 hover:bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#ED4A43]/10 p-1">
                    <img
                      src={category.img}
                      alt={category.name}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-[#ED4A43] transition-colors">
                    {category.name}
                  </h3>
                </div>
                <div className="mt-4 w-0 group-hover:w-full h-0.5 bg-[#ED4A43] transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Footer Section */}
    </div>
  );
};