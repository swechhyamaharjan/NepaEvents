import React from 'react'
import bgImage from './bg-image.png'; 

export const HomePage = () => {
  return (
    <div className="App">
      {/* Full screen banner section */}
      <div className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
        {/* Overlay for clear text view*/}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        
        {/* Content inside the banner */}
        <div className="absolute inset-0 flex justify-center items-center text-center text-white px-4">
          <div>
            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">Experience the best events in town</h1>
            
            {/* Subheading */}
            <p className="text-xl sm:text-2xl md:text-3xl mb-6">Celebrate with top famous artists, exciting activities, and unforgettable moments</p>
            
            {/* Search Bar Form */}
            <form className="flex justify-center">
              <input
                type="text"
                placeholder="Search events, artists, or venues"
                className="px-4 py-2 w-72 sm:w-96 md:w-1/2 rounded-md text-lg border-none outline-none"
              />
              <button type="submit" className="ml-4 px-6 py-2 bg-[#ED4A43] hover:bg-[#D43C35] text-white font-semibold rounded-md">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
