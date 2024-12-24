import React from "react";
import bgImage from "./bg-image.png";
import event1 from "./event1.png";
import event2 from "./event2.png";
import event3 from "./event3.png";
import event4 from "./event4.png";
import category1 from "./event1.png";
import category2 from "./event2.png";
import category3 from "./event3.png";
import category4 from "./event4.png";
import category5 from "./event2.png";
import category6 from "./event4.png";
import { FaCalendarAlt } from "react-icons/fa";
import Footer from './Footer';

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
    <div className="App">
      {/* Full-screen banner section */}
      <div
        className="relative w-full h-[90vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Content inside the banner */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4 z-10">
          <div className="w-full max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mb-4">
              Experience the Best Events in Town
            </h1>
            <p className="text-lg sm:text-xl md:text-xl mb-6">
              Celebrate with top artists, exciting activities, and unforgettable
              moments.
            </p>

            {/* Search Bar Form */}
            <form className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <input
                type="text"
                placeholder="Search events, artists, or venues"
                className="px-4 py-2 w-full sm:w-72 md:w-96 rounded-md text-lg text-[#697787] border-none outline-none"
              />
              <button
                type="submit"
                className="mt-4 sm:mt-0 px-6 py-2 bg-[#ED4A43] hover:bg-[#D43C35] text-white font-semibold rounded-md"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* "Today's Event" Section */}
      <div className="bg-white py-8 px-4 md:px-8 shadow-md">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
            <h1 className="text-2xl font-semibold text-gray-800">
              Today's Event
            </h1>
            <div className="flex items-center space-x-4">
              <FaCalendarAlt className="text-3xl text-[#ED4A43]" />
              <div className="text-left">
                <p className="text-lg font-semibold text-gray-800">
                  {formattedDate}
                </p>
                <p className="text-sm text-gray-600">{dayOfWeek}</p>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event, index) => (
              <div
                key={index}
                className="bg-gray-100 p-6 rounded-lg shadow-md text-center hover:scale-105 transform transition-transform duration-300"
              >
                {/* Event Image */}
                <div className="w-24 h-24 mx-auto mb-4">
                  <img
                    src={event.img}
                    alt={event.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                {/* Event Time */}
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  {event.time}
                </p>
                {/* Event Name */}
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {event.name}
                </h3>
                {/* Event Place */}
                <p className="text-md text-gray-600 mb-4">{event.place}</p>
                {/* Buy Ticket Button */}
                <button className="px-8 py-2 bg-[#ED4A43] hover:bg-[#D43C35] text-white font-semibold rounded-md">
                  Buy Ticket
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Events by Category Section */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-2xl font-bold text-left mb-8 text-gray-800">
            Events by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="w-32 h-32 mx-auto mb-4">
                  <img
                    src={category.img}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Footer Section */}
    </div>
  );
};
