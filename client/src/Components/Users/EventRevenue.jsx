import api from "../../api/api";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EventRevenue = () => {
  const [loading, setLoading] = useState(true);
  const { title } = useParams();
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState(null);

  useEffect(() => {
    async function fetchEventDetails() {
      setLoading(true);
      try {
        const response = await api.get('/api/event/overview');
        setAllEvents(response.data.events);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
    fetchEventDetails();
  }, [title]);

  const normalizeTitle = (str) => str?.toLowerCase().replace(/\s+/g, '') || '';
  const normalizedTitle = normalizeTitle(title);
  const eventRevenueDetails = allEvents?.find(
    event => normalizeTitle(event.title) === normalizedTitle
  ) || null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED4A43]"></div>
      </div>
    );
  }

  if (!eventRevenueDetails) {
    return <div className="p-8 text-center text-gray-500">Event not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Event Revenue</h1>
          <button onClick={() => navigate('/mybookings')} className="text-gray-600 hover:text-[#ED4A43]">Back</button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{eventRevenueDetails.title}</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-gray-500">Date</p><p>{new Date(eventRevenueDetails.date).toLocaleDateString()}</p></div>
            <div><p className="text-gray-500">Venue</p><p>{eventRevenueDetails.venue?.name}</p></div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm">Tickets Sold</h3>
            <p className="text-2xl font-bold">{eventRevenueDetails.totalSold}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm">Total Revenue</h3>
            <p className="text-2xl font-bold text-[#ED4A43]">${(eventRevenueDetails.totalRevenue || 0).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRevenue;