import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaCheckCircle, FaCalendarAlt, FaBuilding, FaBullhorn, FaTrashAlt, FaClock } from "react-icons/fa";
import { FiAlertCircle, FiX } from "react-icons/fi";
import { useAuth } from "../../Context/AuthContext";

const Notifications = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  // Simulated data fetch - replace with your actual API calls
  useEffect(() => {
    if (isLoggedIn) {
      // Fetch user's notifications
      setTimeout(() => {
        setNotifications([
          {
            id: 1,
            type: "event",
            title: "Event Reminder: Music Festival 2025",
            message: "The event starts tomorrow at 4:00 PM. Don't forget to bring your ticket!",
            date: "2025-03-22T14:30:00",
            isRead: false,
            eventId: 101
          },
          {
            id: 2,
            type: "venue",
            title: "Venue Booking Confirmed",
            message: "Your booking for Heritage Garden on April 5, 2025 has been confirmed.",
            date: "2025-03-20T09:15:00",
            isRead: true,
            venueId: 201
          },
          {
            id: 3,
            type: "system",
            title: "Welcome to NepaEvents!",
            message: "Thank you for joining NepaEvents. Discover and book amazing events and venues in Nepal.",
            date: "2025-03-15T11:00:00",
            isRead: true
          },
          {
            id: 4,
            type: "event",
            title: "New Event Added: Food Festival",
            message: "A new food festival has been added in Bhaktapur. Check it out!",
            date: "2025-03-18T16:45:00",
            isRead: false,
            eventId: 102
          },
          {
            id: 5,
            type: "promo",
            title: "Special Discount: 25% Off",
            message: "Use code NEPA25 to get 25% off on your next venue booking.",
            date: "2025-03-17T10:30:00",
            isRead: false
          }
        ]);
        setIsLoading(false);
      }, 800);
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
    // Here you would also make an API call to update the notification status in the backend
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, isRead: true }))
    );
    // Here you would also make an API call to update all notifications status in the backend
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
    // Here you would also make an API call to delete the notification in the backend
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    // Here you would also make an API call to clear all notifications in the backend
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    // Navigate based on notification type
    if (notification.type === "event" && notification.eventId) {
      navigate(`/event/${notification.eventId}`);
    } else if (notification.type === "venue" && notification.venueId) {
      navigate(`/venue/${notification.venueId}`);
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "event":
        return <FaCalendarAlt className="text-blue-500" size={20} />;
      case "venue":
        return <FaBuilding className="text-green-500" size={20} />;
      case "system":
        return <FiAlertCircle className="text-purple-500" size={20} />;
      case "promo":
        return <FaBullhorn className="text-yellow-500" size={20} />;
      default:
        return <FaBell className="text-gray-500" size={20} />;
    }
  };

  const filteredNotifications = 
    activeFilter === "all" 
      ? notifications 
      : activeFilter === "unread"
        ? notifications.filter(notification => !notification.isRead)
        : notifications.filter(notification => notification.type === activeFilter);

  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <FaBell size={60} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">You're not logged in</h2>
          <p className="text-gray-500 mb-6">Log in to view your notifications</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#ED4A43] text-white px-6 py-3 rounded-md hover:bg-[#D43C35] transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-8"></div>
          <div className="h-16 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-16 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-16 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
        <div className="flex items-center">
          <FaBell size={24} className="text-[#ED4A43] mr-3" />
          <h5 className="text-3xl font-extrabold text-[#ED4A43] mb-8 text-center relative">Notifications</h5>
          {unreadCount > 0 && (
            <span className="ml-3 bg-[#ED4A43] text-white text-sm rounded-full h-6 px-2 flex items-center justify-center">
              {unreadCount} new
            </span>
          )}
        </div>

        
        <div className="flex flex-wrap items-center space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center mr-4"
            >
              <FaCheckCircle className="mr-1" /> Mark all as read
            </button>
          )}
          
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="text-sm text-red-600 hover:text-red-800 transition-colors flex items-center"
            >
              <FaTrashAlt className="mr-1" /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-gray-100 rounded-lg p-1 mb-6 flex overflow-x-auto">
        {[
          { id: "all", label: "All" },
          { id: "unread", label: "Unread" },
          { id: "event", label: "Events" },
          { id: "venue", label: "Venues" },
          { id: "promo", label: "Promotions" },
          { id: "system", label: "System" }
        ].map((filter) => (
          <button
            key={filter.id}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
              activeFilter === filter.id
                ? "bg-white text-[#ED4A43] shadow-sm"
                : "text-gray-600 hover:text-[#ED4A43]"
            }`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <FaBell size={60} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No notifications</h2>
          <p className="text-gray-500">
            {activeFilter !== "all"
              ? `You don't have any ${activeFilter === "unread" ? "unread" : activeFilter} notifications`
              : "You're all caught up!"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-sm p-4 transition-all duration-200 hover:shadow-md ${
                !notification.isRead ? "border-l-4 border-[#ED4A43]" : ""
              }`}
            >
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div 
                  className="flex-1 cursor-pointer" 
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <h3 className={`font-semibold text-gray-800 ${!notification.isRead ? "font-bold" : ""}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center mt-1 md:mt-0">
                      <span className="text-xs text-gray-500 flex items-center">
                        <FaClock className="mr-1" size={12} />
                        {getTimeAgo(notification.date)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                </div>
                
                <div className="ml-3 flex flex-col items-center space-y-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="Mark as read"
                    >
                      <FaCheckCircle size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete notification"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;