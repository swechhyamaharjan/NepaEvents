import React, { useEffect, useState } from 'react';
import { FaSort, FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaTimes, FaTicketAlt, FaMoneyBillWave, FaUsers, FaClock, FaBuilding, FaRegCalendarAlt, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import api from "../../api/api";
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
  const [eventSortField, setEventSortField] = useState('totalRevenue');
  const [eventSortDirection, setEventSortDirection] = useState('desc');
  const [eventSearchTerm, setEventSearchTerm] = useState('');
  const [venueSortField, setVenueSortField] = useState('totalRevenue');
  const [venueSortDirection, setVenueSortDirection] = useState('desc');
  const [venueSearchTerm, setVenueSearchTerm] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTickets, setEventTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [showVenueDetailsModal, setShowVenueDetailsModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [loadingReceipts, setLoadingReceipts] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/admin/payments");
      setAdminData(response.data);
    } catch (error) {
      setError("Failed to fetch payment data");
    } finally {
      setLoading(false);
    }
  };

  const handleViewEventDetails = async (event) => {
    try {
      setSelectedEvent(event);
      setShowDetailsModal(true);
      setLoadingTickets(true);
      const response = await api.get(`/api/ticket/event/${event._id}`);
      setEventTickets(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch ticket details");
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleViewVenueDetails = async (venue) => {
    setSelectedVenue(venue);
    setShowVenueDetailsModal(true);
  };

  const filteredEvents = adminData.eventRevenue.events
    .filter(event => (event.title?.toLowerCase() || "").includes(eventSearchTerm.toLowerCase()))
    .sort((a, b) => {
      const valA = a[eventSortField] || 0;
      const valB = b[eventSortField] || 0;
      return eventSortDirection === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

  const filteredVenues = adminData.venueRevenue.venues
    .filter(venue => (venue.name?.toLowerCase() || "").includes(venueSearchTerm.toLowerCase()))
    .sort((a, b) => {
      const valA = a[venueSortField] || 0;
      const valB = b[venueSortField] || 0;
      return venueSortDirection === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

  const formatCurrency = (amount) => `$${(amount || 0).toFixed(2)}`;
  const formatDate = (d) => d ? new Date(d).toLocaleDateString() : 'N/A';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold text-center text-[#ED4A43] mb-8">Financial Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-[#ED4A43]">
          <h3 className="text-lg font-semibold text-gray-700">Total Event Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(adminData.eventRevenue.totalRevenue)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-700">Total Venue Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(adminData.venueRevenue.totalRevenue)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FaCalendarAlt className="text-[#ED4A43]" /> Event Revenue</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3">Event</th>
                <th className="p-3">Sold</th>
                <th className="p-3">Revenue</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(e => (
                <tr key={e._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{e.title}</td>
                  <td className="p-3">{e.totalSold}</td>
                  <td className="p-3 text-[#ED4A43] font-bold">{formatCurrency(e.totalRevenue)}</td>
                  <td className="p-3 text-right"><button onClick={() => handleViewEventDetails(e)} className="text-sm text-gray-500 hover:text-[#ED4A43]">Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FaBuilding className="text-blue-500" /> Venue Revenue</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3">Venue</th>
                <th className="p-3">Bookings</th>
                <th className="p-3">Revenue</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVenues.map(v => (
                <tr key={v._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{v.name}</td>
                  <td className="p-3">{v.totalBookings}</td>
                  <td className="p-3 text-blue-500 font-bold">{formatCurrency(v.totalRevenue)}</td>
                  <td className="p-3 text-right"><button onClick={() => handleViewVenueDetails(v)} className="text-sm text-gray-500 hover:text-blue-500">Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDetailsModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6">
            <h3 className="text-xl font-bold mb-4">{selectedEvent.title} - Sales Details</h3>
            {loadingTickets ? <p>Loading...</p> : (
              <div className="space-y-4">
                {eventTickets.map(t => (
                  <div key={t._id} className="flex justify-between border-b py-2">
                    <span>{t.user?.fullName || 'Anonymous'} ({t.quantity} tickets)</span>
                    <span className="font-bold">{formatCurrency(t.price * t.quantity)}</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setShowDetailsModal(false)} className="mt-6 w-full p-2 bg-gray-100 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentTable;
