import React, { useEffect, useState } from 'react';
import api from "../../api/api";
import { FaUser, FaTicketAlt, FaBuilding, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import toast from 'react-hot-toast';

export const AdminPayment = () => {
  const [payments, setPayments] = useState({ tickets: [], venueBookings: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ticket'); // 'ticket' or 'venue'

  useEffect(() => {
    fetchPayments();
  }, []);

  const consolidateTickets = (tickets) => {
    const ticketMap = new Map();
    tickets.forEach(ticket => {
      if (!ticket) return;
      const key = `${ticket.userId}-${ticket.eventId}`;
      if (!ticketMap.has(key)) {
        ticketMap.set(key, {
          ...ticket,
          ticketCount: ticket.ticketCount || 1,
          amount: (ticket.price || 0) * (ticket.ticketCount || 1),
          totalQRCodes: 1
        });
      } else {
        const existingTicket = ticketMap.get(key);
        existingTicket.ticketCount += (ticket.ticketCount || 1);
        existingTicket.amount = (ticket.price || 0) * existingTicket.ticketCount;
        existingTicket.totalQRCodes += 1;
        if (new Date(ticket.date) > new Date(existingTicket.date)) {
          existingTicket.date = ticket.date;
        }
      }
    });
    return Array.from(ticketMap.values());
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const ticketsResponse = await api.get("/api/payments");
      const venueBookingsResponse = await api.get("/api/venue-bookings");

      let formattedVenueBookings = [];
      if (venueBookingsResponse.data) {
        let bookings = Array.isArray(venueBookingsResponse.data)
          ? venueBookingsResponse.data
          : (venueBookingsResponse.data.bookings || []);

        formattedVenueBookings = bookings
          .filter(booking => booking && booking.paymentStatus === "paid")
          .map(booking => ({
            _id: booking._id,
            type: 'venue',
            venueId: booking.venue?._id,
            venueName: booking.venue?.name,
            userId: booking.organizer?._id,
            userName: booking.organizer?.fullName,
            amount: booking.venue?.price || 0,
            date: booking.requestedAt,
            transactionId: `VB-${booking._id.toString().substring(0, 8)}`
          }));
      }

      let ticketData = [];
      if (Array.isArray(ticketsResponse.data)) {
        ticketData = ticketsResponse.data
          .filter(payment => payment && payment.type === 'event')
          .map(ticket => ({
            ...ticket,
            price: ticket.amount / (ticket.ticketCount || 1),
            ticketCount: ticket.ticketCount || 1
          }));
        ticketData = consolidateTickets(ticketData);
      }

      setPayments({
        tickets: ticketData,
        venueBookings: formattedVenueBookings
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching payments:", error);
      toast.error("Failed to fetch payment data.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8 font-sans relative">
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:30px_30px] pointer-events-none" />
      <div className="mb-6 relative">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Payment Management</h1>
        <p className="text-gray-600 mt-2">View and manage all payment transactions</p>
      </div>

      <div className="bg-white rounded-lg shadow-md mb-6 relative">
        <div className="flex border-b overflow-x-auto">
          <button
            className={`px-4 md:px-6 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'ticket' ? 'border-b-2 border-[#ED4A43] text-[#ED4A43]' : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('ticket')}
          >
            <FaTicketAlt /> Ticket Payments
          </button>
          <button
            className={`px-4 md:px-6 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'venue' ? 'border-b-2 border-[#ED4A43] text-[#ED4A43]' : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('venue')}
          >
            <FaBuilding /> Venue Bookings
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED4A43]"></div>
        </div>
      )}

      {!loading && activeTab === 'ticket' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaTicketAlt className="text-[#ED4A43]" /> Ticket Buyers
            </h2>
          </div>
          {payments.tickets.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No ticket payments found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tickets</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.tickets.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{payment.userName || 'Unknown'}</div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.eventName || 'Unknown'}</td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(payment.date)}</td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.ticketCount}</td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-[#ED4A43]">
                        ${(payment.amount || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'venue' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaBuilding className="text-blue-500" /> Venue Bookings
            </h2>
          </div>
          {payments.venueBookings.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No venue booking payments found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.venueBookings.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.venueName}</td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.userName}</td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(payment.date)}</td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-500">
                        ${(payment.amount || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 relative">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Ticket Sales Summary</h3>
          <p className="text-2xl font-bold text-[#ED4A43]">
            ${payments.tickets.reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Venue Revenue Summary</h3>
          <p className="text-2xl font-bold text-blue-500">
            ${payments.venueBookings.reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPayment;