import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaDownload, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/ticket/user");
        setTickets(response.data || []);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [user]);

  const handleDownloadTicket = async (ticketId) => {
    try {
      const ticket = tickets.find(t => t._id === ticketId);
      const code = ticket?.ticketCodes?.[0] || '';
      const response = await api.get(`/api/ticket/${ticketId}/download?code=${code}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket_${ticketId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download ticket");
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/ticket/${ticketToDelete}`);
      setTickets(tickets.filter(t => t._id !== ticketToDelete));
      toast.success("Ticket deleted!");
      setIsDeleting(false);
    } catch (error) {
      toast.error("Failed to delete ticket");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED4A43]"></div></div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Tickets</h1>
        {tickets.length > 0 ? (
          <div className="space-y-6">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#ED4A43]">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold">{ticket.event?.title || "Event"}</h2>
                    <p className="flex items-center text-gray-600 text-sm"><FaCalendarAlt className="mr-2 text-[#ED4A43]" /> {new Date(ticket.event?.date).toLocaleString()}</p>
                    <p className="flex items-center text-gray-600 text-sm"><FaMapMarkerAlt className="mr-2 text-[#ED4A43]" /> {ticket.event?.venue?.name || "Venue"}</p>
                    <p className="flex items-center text-gray-600 text-sm"><FaTicketAlt className="mr-2 text-[#ED4A43]" /> {ticket.quantity} Tickets</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
                    <span className="text-2xl font-bold text-[#ED4A43]">${(ticket.price * ticket.quantity).toFixed(2)}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleDownloadTicket(ticket._id)} className="p-2 bg-[#ED4A43] text-white rounded hover:bg-red-600"><FaDownload /></button>
                      <button onClick={() => { setTicketToDelete(ticket._id); setIsDeleting(true); }} className="p-2 bg-gray-100 text-red-500 rounded hover:bg-gray-200"><FaTrash /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow"><p className="text-gray-500 mb-4">No tickets found</p><button onClick={() => navigate('/event')} className="bg-[#ED4A43] text-white px-6 py-2 rounded">Browse Events</button></div>
        )}
      </div>

      {isDeleting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="font-bold mb-2">Delete Ticket?</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this ticket? This cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsDeleting(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;