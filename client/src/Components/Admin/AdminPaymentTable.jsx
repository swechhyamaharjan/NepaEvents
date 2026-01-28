import React, { useEffect, useState } from 'react';
import { FaSort, FaSearch, FaFileDownload, FaCalendarAlt, FaMapMarkerAlt, FaTimes, FaTicketAlt, FaMoneyBillWave, FaUsers, FaClock, FaBuilding, FaRegCalendarAlt, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';

export const AdminPaymentTable = () => {
  const [adminData, setAdminData] = useState({
    eventRevenue: { events: [], totalSold: 0, totalRevenue: 0 },
    venueRevenue: { venues: [], totalBookings: 0, totalRevenue: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for event table
  const [eventSortField, setEventSortField] = useState('totalRevenue');
  const [eventSortDirection, setEventSortDirection] = useState('desc');
  const [eventSearchTerm, setEventSearchTerm] = useState('');

  // State for venue table
  const [venueSortField, setVenueSortField] = useState('totalRevenue');
  const [venueSortDirection, setVenueSortDirection] = useState('desc');
  const [venueSearchTerm, setVenueSearchTerm] = useState('');
  
  // State for event details modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTickets, setEventTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  
  // State for venue details modal
  const [showVenueDetailsModal, setShowVenueDetailsModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [venueReceipts, setVenueReceipts] = useState([]);
  const [loadingReceipts, setLoadingReceipts] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching admin payment revenue data...");
        const response = await axios.get('http://localhost:3000/api/admin/payment-revenue', {
          withCredentials: true
        });
        
        console.log("API Response:", response.data);
        setAdminData(response.data);
      } catch (error) {
        console.error("Error fetching admin payment data:", error);
        const errorMessage = error?.response?.data?.message || "Failed to fetch payment data";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // Handle sorting for the event table
  const handleEventSort = (field) => {
    if (eventSortField === field) {
      setEventSortDirection(eventSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setEventSortField(field);
      setEventSortDirection('desc');
    }
  };

  // Handle sorting for the venue table
  const handleVenueSort = (field) => {
    if (venueSortField === field) {
      setVenueSortDirection(venueSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setVenueSortField(field);
      setVenueSortDirection('desc');
    }
  };
  
  // Handle viewing event details
  const handleViewEventDetails = async (event) => {
    try {
      setSelectedEvent(event);
      setShowDetailsModal(true);
      setLoadingTickets(true);
      
      // Fetch ticket details for this event
      const response = await axios.get(`http://localhost:3000/api/ticket/event/${event._id}`, {
        withCredentials: true
      });
      
      console.log("Ticket data:", response.data);
      setEventTickets(response.data || []);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
      toast.error("Failed to fetch ticket details");
    } finally {
      setLoadingTickets(false);
    }
  };
  
  // Handle viewing venue details
  const handleViewVenueDetails = async (venue) => {
    try {
      setSelectedVenue(venue);
      setShowVenueDetailsModal(true);
      setLoadingReceipts(true);
      
      // Get all receipts for this venue from adminData.venueRevenue
      // This is a simplified approach since we don't have a specific API endpoint
      // In a real implementation, you might want to create an API endpoint to get these details
      const receiptsForVenue = adminData.venueRevenue.venues
        .find(v => v._id === venue._id)?.receipts || [];
        
      console.log("Venue receipts:", receiptsForVenue);
      setVenueReceipts(receiptsForVenue);
      
      // Note: In a complete implementation, you would add an API call here
      // to fetch the actual receipts for this venue
      
      // Simulate API call completion
      setTimeout(() => {
        setLoadingReceipts(false);
      }, 500);
      
    } catch (error) {
      console.error("Error setting up venue details:", error);
      toast.error("Failed to load venue details");
      setLoadingReceipts(false);
    }
  };

  // Filter and sort events
  const filteredEvents = adminData.eventRevenue.events
    .filter(event => 
      (event.title?.toLowerCase() || "").includes(eventSearchTerm.toLowerCase()) ||
      (event.venue?.name?.toLowerCase() || "").includes(eventSearchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (eventSortField === 'title') {
        return eventSortDirection === 'asc' 
          ? (a.title || '').localeCompare(b.title || '') 
          : (b.title || '').localeCompare(a.title || '');
      }
      
      if (eventSortField === 'venue') {
        return eventSortDirection === 'asc' 
          ? (a.venue?.name || '').localeCompare(b.venue?.name || '') 
          : (b.venue?.name || '').localeCompare(a.venue?.name || '');
      }
      
      return eventSortDirection === 'asc' 
        ? (a[eventSortField] || 0) - (b[eventSortField] || 0) 
        : (b[eventSortField] || 0) - (a[eventSortField] || 0);
    });

  // Filter and sort venues
  const filteredVenues = adminData.venueRevenue.venues
    .filter(venue => 
      (venue.name?.toLowerCase() || "").includes(venueSearchTerm.toLowerCase()) ||
      (venue.location?.toLowerCase() || "").includes(venueSearchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (venueSortField === 'name') {
        return venueSortDirection === 'asc' 
          ? (a.name || '').localeCompare(b.name || '') 
          : (b.name || '').localeCompare(a.name || '');
      }
      
      if (venueSortField === 'location') {
        return venueSortDirection === 'asc' 
          ? (a.location || '').localeCompare(b.location || '') 
          : (b.location || '').localeCompare(a.location || '');
      }
      
      return venueSortDirection === 'asc' 
        ? (a[venueSortField] || 0) - (b[venueSortField] || 0) 
        : (b[venueSortField] || 0) - (a[venueSortField] || 0);
    });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Invalid date';
    }
  };

  const renderEventTable = () => (
    <div className="bg-white rounded-lg shadow p-5 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex items-center mb-3 md:mb-0">
          <FaCalendarAlt className="text-[#ED4A43] mr-3" size={24} />
          <h3 className="text-xl font-bold text-gray-800">Your Event Revenue</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              value={eventSearchTerm}
              onChange={(e) => setEventSearchTerm(e.target.value)}
              className="w-full md:w-64 p-2 pl-8 border border-gray-300 rounded"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button 
            className="flex items-center justify-center gap-2 bg-[#ED4A43] text-white p-2 rounded hover:bg-[#d43c35] transition-colors"
            onClick={exportEventRevenueExcel}
          >
            <FaFileExcel />
            Export
          </button>
          <button 
            className="flex items-center justify-center gap-2 bg-[#2C3E50] text-white p-2 rounded hover:bg-[#1a252f] transition-colors"
            onClick={exportEventRevenuePDF}
          >
            <FaFilePdf />
            PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left border-b border-gray-200 cursor-pointer" onClick={() => handleEventSort('title')}>
                <div className="flex items-center">
                  Event Name
                  {eventSortField === 'title' && <FaSort className="ml-1 text-[#ED4A43]" />}
                </div>
              </th>
              <th className="px-4 py-2 text-left border-b border-gray-200 cursor-pointer" onClick={() => handleEventSort('venue')}>
                <div className="flex items-center">
                  Venue
                  {eventSortField === 'venue' && <FaSort className="ml-1 text-[#ED4A43]" />}
                </div>
              </th>
              <th className="px-4 py-2 text-left border-b border-gray-200 cursor-pointer" onClick={() => handleEventSort('totalSold')}>
                <div className="flex items-center">
                  Tickets Sold
                  {eventSortField === 'totalSold' && <FaSort className="ml-1 text-[#ED4A43]" />}
                </div>
              </th>
              <th className="px-4 py-2 text-left border-b border-gray-200 cursor-pointer" onClick={() => handleEventSort('totalRevenue')}>
                <div className="flex items-center">
                  Revenue
                  {eventSortField === 'totalRevenue' && <FaSort className="ml-1 text-[#ED4A43]" />}
                </div>
              </th>
              <th className="px-4 py-2 text-right border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center">Loading payment data...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center text-red-500">{error}</td>
              </tr>
            ) : filteredEvents.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center">No event revenue data found.</td>
              </tr>
            ) : (
              filteredEvents.map(event => (
                <tr key={event._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b border-gray-200">{event.title}</td>
                  <td className="px-4 py-2 border-b border-gray-200">{event.venue?.name || 'N/A'}</td>
                  <td className="px-4 py-2 border-b border-gray-200">{event.totalSold || 0}</td>
                  <td className="px-4 py-2 border-b border-gray-200 font-medium">{formatCurrency(event.totalRevenue)}</td>
                  <td className="px-4 py-2 border-b border-gray-200 text-right">
                    <button 
                      onClick={() => handleViewEventDetails(event)}
                      className="text-[#ED4A43] hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderVenueTable = () => (
    <div className="bg-white rounded-lg shadow p-5 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex items-center mb-3 md:mb-0">
          <FaMapMarkerAlt className="text-[#ED4A43] mr-3" size={24} />
          <h3 className="text-xl font-bold text-gray-800">Venue Revenue</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search venues..."
              value={venueSearchTerm}
              onChange={(e) => setVenueSearchTerm(e.target.value)}
              className="w-full md:w-64 p-2 pl-8 border border-gray-300 rounded"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <button 
            className="flex items-center justify-center gap-2 bg-[#ED4A43] text-white p-2 rounded hover:bg-[#d43c35] transition-colors"
            onClick={exportVenueRevenueExcel}
          >
            <FaFileExcel />
            Export
          </button>
          <button 
            className="flex items-center justify-center gap-2 bg-[#2C3E50] text-white p-2 rounded hover:bg-[#1a252f] transition-colors"
            onClick={exportVenueRevenuePDF}
          >
            <FaFilePdf />
            PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left border-b border-gray-200 cursor-pointer" onClick={() => handleVenueSort('name')}>
                <div className="flex items-center">
                  Venue Name
                  {venueSortField === 'name' && <FaSort className="ml-1 text-[#ED4A43]" />}
                </div>
              </th>
              <th className="px-4 py-2 text-left border-b border-gray-200 cursor-pointer" onClick={() => handleVenueSort('location')}>
                <div className="flex items-center">
                  Location
                  {venueSortField === 'location' && <FaSort className="ml-1 text-[#ED4A43]" />}
                </div>
              </th>
              <th className="px-4 py-2 text-left border-b border-gray-200 cursor-pointer" onClick={() => handleVenueSort('totalBookings')}>
                <div className="flex items-center">
                  Total Bookings
                  {venueSortField === 'totalBookings' && <FaSort className="ml-1 text-[#ED4A43]" />}
                </div>
              </th>
              <th className="px-4 py-2 text-left border-b border-gray-200 cursor-pointer" onClick={() => handleVenueSort('totalRevenue')}>
                <div className="flex items-center">
                  Revenue
                  {venueSortField === 'totalRevenue' && <FaSort className="ml-1 text-[#ED4A43]" />}
                </div>
              </th>
              <th className="px-4 py-2 text-right border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center">Loading venue revenue data...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center text-red-500">{error}</td>
              </tr>
            ) : filteredVenues.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center">No venue revenue data found.</td>
              </tr>
            ) : (
              filteredVenues.map(venue => (
                <tr key={venue._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b border-gray-200">{venue.name || 'Unnamed Venue'}</td>
                  <td className="px-4 py-2 border-b border-gray-200">{venue.location || 'N/A'}</td>
                  <td className="px-4 py-2 border-b border-gray-200">{venue.totalBookings || 0}</td>
                  <td className="px-4 py-2 border-b border-gray-200 font-medium">{formatCurrency(venue.totalRevenue)}</td>
                  <td className="px-4 py-2 border-b border-gray-200 text-right">
                    <button 
                      onClick={() => handleViewVenueDetails(venue)}
                      className="text-[#ED4A43] hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  // Event details modal
  const renderEventDetailsModal = () => {
    if (!showDetailsModal || !selectedEvent) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Modal header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <FaCalendarAlt className="text-[#ED4A43] mr-2" />
              {selectedEvent.title}
            </h3>
            <button 
              onClick={() => setShowDetailsModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={20} />
            </button>
          </div>
          
          {/* Modal content */}
          <div className="px-6 py-4">
            {/* Event details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-bold text-gray-700 mb-3">Event Information</h4>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-[#ED4A43] mt-1 mr-2" />
                    <div>
                      <p className="font-medium">Venue</p>
                      <p className="text-gray-600">{selectedEvent.venue?.name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FaClock className="text-[#ED4A43] mt-1 mr-2" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-gray-600">{formatDate(selectedEvent.date)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-bold text-gray-700 mb-3">Sales Summary</h4>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <FaTicketAlt className="text-[#ED4A43] mt-1 mr-2" />
                    <div>
                      <p className="font-medium">Tickets Sold</p>
                      <p className="text-gray-600">{selectedEvent.totalSold || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FaMoneyBillWave className="text-[#ED4A43] mt-1 mr-2" />
                    <div>
                      <p className="font-medium">Total Revenue</p>
                      <p className="text-gray-600">{formatCurrency(selectedEvent.totalRevenue)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Ticket transactions table */}
            <div>
              <h4 className="text-lg font-bold text-gray-700 mb-3 flex items-center">
                <FaUsers className="text-[#ED4A43] mr-2" />
                Ticket Transactions
              </h4>
              
              {loadingTickets ? (
                <div className="text-center py-4">Loading ticket details...</div>
              ) : eventTickets.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No ticket transactions found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left border-b border-gray-200">Ticket Code</th>
                        <th className="px-4 py-2 text-left border-b border-gray-200">Attendee</th>
                        <th className="px-4 py-2 text-left border-b border-gray-200">Purchase Date</th>
                        <th className="px-4 py-2 text-left border-b border-gray-200">Quantity</th>
                        <th className="px-4 py-2 text-right border-b border-gray-200">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventTickets.map(ticket => (
                        <tr key={ticket._id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border-b border-gray-200">{ticket.ticketCodes}</td>
                          <td className="px-4 py-2 border-b border-gray-200">{ticket.user?.fullName || 'Unknown'}</td>
                          <td className="px-4 py-2 border-b border-gray-200">{formatDate(ticket.purchaseDate)}</td>
                          <td className="px-4 py-2 border-b border-gray-200">{ticket.quantity || 1}</td>
                          <td className="px-4 py-2 border-b border-gray-200 text-right font-medium">
                            {formatCurrency(ticket.price * (ticket.quantity || 1))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          {/* Modal footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button 
              onClick={() => setShowDetailsModal(false)} 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Venue details modal
  const renderVenueDetailsModal = () => {
    if (!showVenueDetailsModal || !selectedVenue) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Modal header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <FaBuilding className="text-[#ED4A43] mr-2" />
              {selectedVenue.name}
            </h3>
            <button 
              onClick={() => setShowVenueDetailsModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={20} />
            </button>
          </div>
          
          {/* Modal content */}
          <div className="px-6 py-4">
            {/* Venue details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-bold text-gray-700 mb-3">Venue Information</h4>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-[#ED4A43] mt-1 mr-2" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">{selectedVenue.location || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FaUsers className="text-[#ED4A43] mt-1 mr-2" />
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-gray-600">{selectedVenue.capacity || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-bold text-gray-700 mb-3">Booking Summary</h4>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <FaRegCalendarAlt className="text-[#ED4A43] mt-1 mr-2" />
                    <div>
                      <p className="font-medium">Total Bookings</p>
                      <p className="text-gray-600">{selectedVenue.totalBookings || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FaMoneyBillWave className="text-[#ED4A43] mt-1 mr-2" />
                    <div>
                      <p className="font-medium">Total Revenue</p>
                      <p className="text-gray-600">{formatCurrency(selectedVenue.totalRevenue)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Show the information about the venue bookings */}
            <div>
              <h4 className="text-lg font-bold text-gray-700 mb-3 flex items-center">
                <FaRegCalendarAlt className="text-[#ED4A43] mr-2" />
                Booking History
              </h4>
              
              {loadingReceipts ? (
                <div className="text-center py-4">Loading booking details...</div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-gray-600">
                    This venue has been booked {selectedVenue.totalBookings} times, generating a total revenue of {formatCurrency(selectedVenue.totalRevenue)}.
                  </p>
                  <p className="text-gray-500 mt-2 text-sm">
                    For more detailed booking information, please check the venue booking records.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Modal footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button 
              onClick={() => setShowVenueDetailsModal(false)} 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Calculate total revenue from both events and venues
  const totalRevenue = adminData.eventRevenue.totalRevenue + adminData.venueRevenue.totalRevenue;
  
  // Generate and download Excel report for event revenue
  const exportEventRevenueExcel = () => {
    try {
      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      
      // Prepare data
      const data = [
        ["Event Revenue Report"],
        [`Generated on: ${new Date().toLocaleDateString()}`],
        ["NepaEvents"],
        [],
        ["Event", "Revenue (NPR)", "Tickets Sold", "Date"]
      ];

      // Add event data
      filteredEvents.forEach(event => {
        data.push([
          event.title || "N/A", 
          event.totalRevenue || 0, 
          event.totalSold || 0, 
          formatDate(event.date)
        ]);
      });
      
      // Add total row
      const totalRevenue = filteredEvents.reduce((sum, event) => sum + (event.totalRevenue || 0), 0);
      const totalTickets = filteredEvents.reduce((sum, event) => sum + (event.totalSold || 0), 0);
      data.push(["TOTAL", totalRevenue, totalTickets, ""]);
      
      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      
      // Set column widths
      const cols = [
        { wch: 30 }, // Event column width
        { wch: 15 }, // Revenue column width
        { wch: 15 }, // Tickets column width
        { wch: 25 }  // Date column width
      ];
      worksheet['!cols'] = cols;
      
      // Add to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Event Revenue");
      
      // Save file
      XLSX.writeFile(workbook, "event_revenue_report.xlsx");
      toast.success("Excel report downloaded successfully");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast.error("Failed to generate Excel report");
    }
  };
  
  // Generate and download Excel report for venue revenue
  const exportVenueRevenueExcel = () => {
    try {
      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      
      // Prepare data
      const data = [
        ["Venue Revenue Report"],
        [`Generated on: ${new Date().toLocaleDateString()}`],
        ["NepaEvents"],
        [],
        ["Venue", "Revenue (NPR)", "Bookings", "Location"]
      ];

      // Add venue data
      filteredVenues.forEach(venue => {
        data.push([
          venue.name || "N/A", 
          venue.totalRevenue || 0, 
          venue.totalBookings || 0, 
          venue.location || "N/A"
        ]);
      });
      
      // Add total row
      const totalRevenue = filteredVenues.reduce((sum, venue) => sum + (venue.totalRevenue || 0), 0);
      const totalBookings = filteredVenues.reduce((sum, venue) => sum + (venue.totalBookings || 0), 0);
      data.push(["TOTAL", totalRevenue, totalBookings, ""]);
      
      // Create worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      
      // Set column widths
      const cols = [
        { wch: 30 }, // Venue column width
        { wch: 15 }, // Revenue column width
        { wch: 15 }, // Bookings column width
        { wch: 25 }  // Location column width
      ];
      worksheet['!cols'] = cols;
      
      // Add to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Venue Revenue");
      
      // Save file
      XLSX.writeFile(workbook, "venue_revenue_report.xlsx");
      toast.success("Excel report downloaded successfully");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast.error("Failed to generate Excel report");
    }
  };

  // Generate and download PDF report for event revenue
  const exportEventRevenuePDF = () => {
    const doc = new jsPDF();
    
    // Add title and styling
    doc.setFontSize(20);
    doc.setTextColor(237, 74, 67); // #ED4A43 in RGB
    doc.text("Event Revenue Report", 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Add company info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("NepaEvents", 14, 36);
    
    // Create the table
    const tableColumn = ["Event", "Revenue (NPR)", "Tickets Sold", "Date"];
    const tableRows = [];

    filteredEvents.forEach(event => {
      const eventData = [
        event.title || "N/A", 
        formatCurrency(event.totalRevenue), 
        event.totalSold || 0, 
        formatDate(event.date)
      ];
      tableRows.push(eventData);
    });
    
    // Add total row
    const totalRevenue = filteredEvents.reduce((sum, event) => sum + (event.totalRevenue || 0), 0);
    const totalTickets = filteredEvents.reduce((sum, event) => sum + (event.totalSold || 0), 0);
    tableRows.push(["TOTAL", formatCurrency(totalRevenue), totalTickets, ""]);
    
    // Generate the table with better styling
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 42,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [237, 74, 67], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' },
      margin: { top: 10 }
    });
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      doc.text("Report generated by NepaEvents Admin Dashboard", 14, pageHeight - 10);
      doc.text("Page " + i + " of " + pageCount, pageSize.width - 30, pageHeight - 10);
    }
    
    doc.save("event_revenue_report.pdf");
    toast.success("PDF report downloaded successfully");
  };
  
  // Generate and download PDF report for venue revenue
  const exportVenueRevenuePDF = () => {
    const doc = new jsPDF();
    
    // Add title and styling
    doc.setFontSize(20);
    doc.setTextColor(237, 74, 67); // #ED4A43 in RGB
    doc.text("Venue Revenue Report", 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Add company info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("NepaEvents", 14, 36);
    
    // Create the table
    const tableColumn = ["Venue", "Revenue (NPR)", "Bookings", "Location"];
    const tableRows = [];

    filteredVenues.forEach(venue => {
      const venueData = [
        venue.name || "N/A", 
        formatCurrency(venue.totalRevenue), 
        venue.totalBookings || 0, 
        venue.location || "N/A"
      ];
      tableRows.push(venueData);
    });
    
    // Add total row
    const totalRevenue = filteredVenues.reduce((sum, venue) => sum + (venue.totalRevenue || 0), 0);
    const totalBookings = filteredVenues.reduce((sum, venue) => sum + (venue.totalBookings || 0), 0);
    tableRows.push(["TOTAL", formatCurrency(totalRevenue), totalBookings, ""]);
    
    // Generate the table with better styling
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 42,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [237, 74, 67], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' },
      margin: { top: 10 }
    });
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      doc.text("Report generated by NepaEvents Admin Dashboard", 14, pageHeight - 10);
      doc.text("Page " + i + " of " + pageCount, pageSize.width - 30, pageHeight - 10);
    }
    
    doc.save("venue_revenue_report.pdf");
    toast.success("PDF report downloaded successfully");
  };

  return (
    <div className="bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-[#ED4A43] mb-2 text-center">Payment Dashboard</h2>
        <p className="text-center text-gray-500 mb-8">View your event and venue revenue in one place</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-gray-500 font-medium">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalRevenue)}</p>
            <p className="text-sm text-gray-600 mt-2">Combined from all sources</p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-gray-500 font-medium">Event Revenue</h3>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(adminData.eventRevenue.totalRevenue)}</p>
            <p className="text-sm text-gray-600 mt-2">
              {adminData.eventRevenue.totalSold} tickets sold across {adminData.eventRevenue.events.length} events
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-gray-500 font-medium">Venue Revenue</h3>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(adminData.venueRevenue.totalRevenue)}</p>
            <p className="text-sm text-gray-600 mt-2">
              {adminData.venueRevenue.totalBookings} bookings across {adminData.venueRevenue.venues.length} venues
            </p>
          </div>
        </div>
        
        {renderEventTable()}
        {renderVenueTable()}
        {renderEventDetailsModal()}
        {renderVenueDetailsModal()}
      </div>
    </div>
  );
};
