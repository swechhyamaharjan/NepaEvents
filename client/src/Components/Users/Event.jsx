import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaSearch, FaRegCalendarAlt, FaHeart, FaPercent } from 'react-icons/fa';
import { Link } from 'react-router-dom';


export const Event = () => {
  const [ticketCounts, setTicketCounts] = useState({});
  const [discount, setDiscount] = useState(0);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [promoCodes, setPromoCodes] = useState({});
  const [promoDiscounts, setPromoDiscounts] = useState({});

  //for filtering
  const [filters, setFilters] = useState({
    sort: 'date',
    date: 'all',
    price: 'all',
    type: 'all'
  });

  // Date calculation helpers
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  const isThisWeekend = (date) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + daysUntilSaturday);

    const nextSunday = new Date(nextSaturday);
    nextSunday.setDate(nextSaturday.getDate() + 1);

    return date >= nextSaturday && date <= nextSunday;
  };

  const isNextWeek = (date) => {
    const today = new Date();
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7));
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);

    return date >= nextMonday && date <= nextSunday;
  };

  // Filter and sort events
  const filteredEvents = events.filter(event => {
    const searchMatch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const eventDate = new Date(event.date);
    let dateMatch = true;
    switch (filters.date) {
      case 'today': dateMatch = isToday(eventDate); break;
      case 'tomorrow': dateMatch = isTomorrow(eventDate); break;
      case 'this weekend': dateMatch = isThisWeekend(eventDate); break;
      case 'next week': dateMatch = isNextWeek(eventDate); break;
      case 'all': default: dateMatch = true;
    }

    const priceMatch = filters.price === 'free' ? event.price === 0 :
      filters.price === 'paid' ? event.price > 0 : true;

    const typeMatch = filters.type === 'all' ? true : event.type === filters.type;

    return searchMatch && dateMatch && priceMatch && typeMatch;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (filters.sort === 'price') return a.price - b.price;
    return new Date(a.date) - new Date(b.date);
  });

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };


  const handleTicketChange = (eventId, count) => {
    setTicketCounts((prev) => ({ ...prev, [eventId]: count }));
  };

  const handlePromoCodeChange = (eventId, value) => {
    setPromoCodes((prev) => ({ ...prev, [eventId]: value }));
  };

  // Validate promo code (simulate API call or implement real one)
  const validatePromoCode = async (eventId, code) => {
    // Simulate: 'SAVE10' gives 10% off, 'SAVE20' gives 20% off
    let discount = 0;
    if (code === 'SAVE10') discount = 10;
    if (code === 'SAVE20') discount = 20;
    setPromoDiscounts((prev) => ({ ...prev, [eventId]: discount }));
    return discount;
  };

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await api.get('/api/event');
        setEvents(response.data);

        // Initialize favorites from localStorage
        const savedFavorites = localStorage.getItem('eventFavorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchEvent();
  }, []);

  const handleBookEvent = async (eventId) => {
    try {
      const ticketCount = ticketCounts[eventId] || 1;
      const promoCode = promoCodes[eventId] || '';
      // Optionally validate promo code before sending
      await validatePromoCode(eventId, promoCode);
      const response = await api.post('/api/event/buy', { eventId, ticketCount, promoCode },
        { withCredentials: true }
      )
      localStorage.setItem('eventId', eventId);
      if (!response.data.success) {
        throw new Error("Unable to book event");
      }
      window.open(response.data.url, '_blank');
    } catch (error) {
      console.log(error)
    }
  }

  const toggleFavorite = async (eventId) => {
    try {
      if (favorites.includes(eventId)) {
        // Remove from favorites
        await api.delete(`/api/event/${eventId}/favorite`, {
          withCredentials: true
        });
        setFavorites(favorites.filter(id => id !== eventId));
      } else {
        // Add to favorites
        await api.post(`/api/event/${eventId}/favorite`, {}, {
          withCredentials: true
        });
        setFavorites([...favorites, eventId]);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorites");
    }
  };
  useEffect(() => {
    async function fetchFavorites() {
      try {
        const response = await api.get('/api/event/user/favorites', {
          withCredentials: true
        });
        setFavorites(response.data.map(event => event._id));
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    }

    if (isLoggedIn) {
      fetchFavorites();
    }
  }, [isLoggedIn]);

  const applyGroupDiscount = (ticketCount) => (ticketCount >= 5 ? 20 : 0);


  // Handler for search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="bg-gray-50 py-12 px-4 md:px-12 lg:px-20 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-extrabold text-[#ED4A43] mb-8 text-center relative">
          <span className="relative inline-block">
            Events
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative">
          {/* Fixed Sidebar */}
          <div className="md:col-span-3 sticky top-4 self-start h-auto max-h-screen overflow-y-auto bg-white p-6 rounded-xl shadow-md">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <FaSearch className="mr-2 text-[#ED4A43]" />
                Find Events
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED4A43] focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-5 divide-y divide-gray-100">
              <div className="pb-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Sort By</h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      value="price"
                      checked={filters.sort === 'price'}
                      onChange={(e) => handleFilterChange('sort', e.target.value)}
                      className="form-radio text-[#ED4A43] mr-2"
                    />
                    <span>Price</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      value="date"
                      checked={filters.sort === 'date'}
                      onChange={(e) => handleFilterChange('sort', e.target.value)}
                      className="form-radio text-[#ED4A43] mr-2"
                    />
                    <span>Date</span>
                  </label>
                </div>
              </div>

              <div className="py-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                  <FaRegCalendarAlt className="mr-2 text-[#ED4A43]" />
                  Date
                </h3>
                <div className="space-y-2">
                  {['today', 'tomorrow', 'this weekend', 'next week', 'all'].map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="date"
                        value={option}
                        checked={filters.date === option}
                        onChange={(e) => handleFilterChange('date', e.target.value)}
                        className="form-radio text-[#ED4A43] mr-2"
                      />
                      <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="py-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                  <FaTicketAlt className="mr-2 text-[#ED4A43]" />
                  Price
                </h3>
                <div className="space-y-2">
                  {['all', 'free', 'paid'].map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        value={option}
                        checked={filters.price === option}
                        onChange={(e) => handleFilterChange('price', e.target.value)}
                        className="form-radio text-[#ED4A43] mr-2"
                      />
                      <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Event Type</h3>
                <div className="space-y-2">
                  {['all', 'concert', 'sports', 'exhibition', 'comedy', 'theatre', 'party'].map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value={option}
                        checked={filters.type === option}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className="form-radio text-[#ED4A43] mr-2"
                      />
                      <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="md:col-span-9">
            {sortedEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedEvents.map((event) => {
                  const ticketCount = ticketCounts[event._id] || 1;
                  const groupDiscount = applyGroupDiscount(ticketCount);
                  const promoDiscount = promoDiscounts[event._id] || 0;
                  const finalDiscount = Math.max(promoDiscount, groupDiscount);
                  const totalPrice = ticketCount * event.price * (1 - finalDiscount / 100);

                  return (
                    <div key={event._id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 relative group">
                      <Link to={`/event/${event._id}`} className="block">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={`${api.defaults.baseURL}/${event.image}`}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(event._id);
                            }}
                            className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors duration-200 z-20"
                          >
                            <FaHeart
                              size={18}
                              className={favorites.includes(event._id) ? "text-[#ED4A43]" : "text-gray-400"}
                            />
                          </button>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#ED4A43] transition-colors duration-300 px-6 pt-4">
                          {event.title}
                        </h3>
                      </Link>
                      <div className="p-6 pt-2">
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-600">
                            <FaCalendarAlt className="text-[#ED4A43] mr-2" />
                            <p>{event.date.substring(0, 10)}</p>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FaMapMarkerAlt className="text-[#ED4A43] mr-2" />
                            <p>{event?.venue?.name}</p>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between mb-3">
                            <label className="font-medium text-gray-700">Tickets:</label>
                            <input
                              type="number"
                              min="1"
                              value={ticketCount}
                              onChange={(e) => handleTicketChange(event._id, parseInt(e.target.value) || 1)}
                              onClick={e => e.stopPropagation()}
                              onMouseDown={e => e.stopPropagation()}
                              className="w-20 px-3 py-2 border border-gray-200 rounded-md text-gray-800 text-center focus:outline-none focus:ring-2 focus:ring-[#ED4A43] focus:border-transparent relative z-20"
                            />
                          </div>
                          {/* Promo Code Input */}
                          <div className="flex items-center mb-2">
                            <input
                              type="text"
                              placeholder="Promo code"
                              value={promoCodes[event._id] || ''}
                              onChange={e => handlePromoCodeChange(event._id, e.target.value)}
                              onClick={e => e.stopPropagation()}
                              onMouseDown={e => e.stopPropagation()}
                              className="w-2/3 px-3 py-2 border border-gray-200 rounded-l-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ED4A43] focus:border-transparent"
                            />
                            <button
                              className="px-4 py-2 bg-[#ED4A43] text-white rounded-r-md hover:bg-[#D43C35] transition-all"
                              onClick={async (e) => { e.preventDefault(); e.stopPropagation(); await validatePromoCode(event._id, promoCodes[event._id] || ''); }}
                              onMouseDown={e => e.stopPropagation()}
                            >
                              Apply
                            </button>
                          </div>
                          {/* Discount Info */}
                          {(groupDiscount > 0 || (promoDiscounts[event._id] || 0) > 0) && (
                            <div className="flex items-center text-green-600 text-sm mb-2">
                              <FaPercent className="mr-1" />
                              {groupDiscount > 0 && <span>Group Discount: 20% off</span>}
                              {promoDiscounts[event._id] > 0 && <span className="ml-2">Promo Discount: {promoDiscounts[event._id]}% off</span>}
                            </div>
                          )}
                          {/* Updated price display */}
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-medium text-gray-700">Total:</span>
                            <span className="text-lg font-bold text-[#ED4A43]">
                              ${totalPrice.toFixed(2)}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleBookEvent(event._id);
                            }}
                            className="w-full py-3 bg-[#ED4A43] hover:bg-[#D43C35] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center relative z-20"
                          >
                            <FaTicketAlt className="mr-2" />
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-md">
                <FaSearch className="text-5xl text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-700">No events found</h3>
                <p className="text-gray-500 mt-2">Try changing your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};