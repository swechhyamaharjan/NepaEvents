import React, { useEffect, useState } from 'react';
import { FaSort, FaSearch, FaFileDownload, FaChartBar } from 'react-icons/fa';
import axios from 'axios';

export const AdminPaymentTable = () => {
  // State for storing data
  const [payments, setPayments] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for table controls
  const [sortField, setSortField] = useState('totalRevenue');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data when component mounts
  useEffect(() => {
    // Function to fetch both payments and events data
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get both payments and events data
        const paymentsResponse = await axios.get('http://localhost:3000/api/payments');
        const eventsResponse = await axios.get('http://localhost:3000/api/event');


        setPayments(paymentsResponse.data);
        setEvents(eventsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Calculate statistics for each event
  const calculateEventStats = () => {
    const stats = {};
    
    // Create initial stats object for each event
    events.forEach(event => {
      stats[event._id] = {
        eventId: event._id,
        eventName: event.title,
        totalTickets: 0,
        totalRevenue: 0,
        transactions: 0
      };
    });
    
    // Add payment data to the stats
    payments.forEach(payment => {
      if (stats[payment.eventId]) {
        stats[payment.eventId].totalTickets += payment.ticketCount || 0;
        stats[payment.eventId].totalRevenue += payment.amount || 0;
        stats[payment.eventId].transactions += 1;
      }
    });
    
    return Object.values(stats);
  };

  const eventStats = calculateEventStats();
  
  // Calculate total revenue across all events
  const totalRevenue = eventStats.reduce((sum, event) => sum + event.totalRevenue, 0);
  const totalTickets = eventStats.reduce((sum, event) => sum + event.totalTickets, 0);
  const totalTransactions = eventStats.reduce((sum, event) => sum + event.transactions, 0);

  // Handle sorting when a column header is clicked
  const handleSort = (field) => {
    if (sortField === field) {
      // If same field, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If new field, set it and default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Sort and filter event stats
  const getFilteredAndSortedEvents = () => {
    // First filter by search term
    const filtered = eventStats.filter(event => 
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Then sort by the selected field
    return filtered.sort((a, b) => {
      if (sortField === 'eventName') {
        // Sort alphabetically for text fields
        return sortDirection === 'asc' 
          ? a.eventName.localeCompare(b.eventName) 
          : b.eventName.localeCompare(a.eventName);
      } else {
        // Sort numerically for number fields
        return sortDirection === 'asc' 
          ? a[sortField] - b[sortField] 
          : b[sortField] - a[sortField];
      }
    });
  };

  const filteredEvents = getFilteredAndSortedEvents();

  // Format currency amounts
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD'
    }).format(amount);
  };

  // Get event name by ID
  const getEventName = (eventId) => {
    const event = events.find(e => e._id === eventId);
    return event ? event.title : "Unknown Event";
  };

  return (
    <div className="bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-[#ED4A43] mb-6 text-center">
          Payment Dashboard
        </h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Revenue Card */}
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-gray-500 font-medium">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalRevenue)}</p>
            <p className="text-sm text-gray-600 mt-2">From {totalTransactions} transactions</p>
          </div>
          
          {/* Total Tickets Card */}
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-gray-500 font-medium">Tickets Sold</h3>
            <p className="text-2xl font-bold text-gray-800">{totalTickets}</p>
            <p className="text-sm text-gray-600 mt-2">Across {events.length} events</p>
          </div>
          
          {/* Average Order Card */}
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-gray-500 font-medium">Average Order Value</h3>
            <p className="text-2xl font-bold text-gray-800">
              {totalTransactions > 0 ? formatCurrency(totalRevenue / totalTransactions) : formatCurrency(0)}
            </p>
            <p className="text-sm text-gray-600 mt-2">Per transaction</p>
          </div>
        </div>

        {/* Event Revenue Table */}
        <div className="bg-white rounded-lg shadow p-5 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-3 md:mb-0">Event Revenue</h3>
            
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              {/* Search box */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 p-2 pl-8 border border-gray-300 rounded"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              
              {/* Export button */}
              <button className="flex items-center justify-center gap-2 bg-[#ED4A43] text-white p-2 rounded">
                <FaFileDownload />
                Export
              </button>
            </div>
          </div>

          {/* Revenue Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  {/* Event Name Column */}
                  <th className="px-4 py-2 text-left border-b border-gray-200 cursor-pointer" 
                      onClick={() => handleSort('eventName')}>
                    <div className="flex items-center">
                      Event Name
                      {sortField === 'eventName' && (
                        <FaSort className="ml-1 text-[#ED4A43]" />
                      )}
                    </div>
                  </th>
                  
                  {/* Tickets Column */}
                  <th className="px-4 py-2 text-left border-b border-gray-200 cursor-pointer" 
                      onClick={() => handleSort('totalTickets')}>
                    <div className="flex items-center">
                      Tickets Sold
                      {sortField === 'totalTickets' && (
                        <FaSort className="ml-1 text-[#ED4A43]" />
                      )}
                    </div>
                  </th>
                  
                  {/* Revenue Column */}
                  <th className="px-4 py-2 text-left border-b border-gray-200 cursor-pointer" 
                      onClick={() => handleSort('totalRevenue')}>
                    <div className="flex items-center">
                      Revenue
                      {sortField === 'totalRevenue' && (
                        <FaSort className="ml-1 text-[#ED4A43]" />
                      )}
                    </div>
                  </th>
                  
                  {/* Transactions Column */}
                  <th className="px-4 py-2 text-left border-b border-gray-200 cursor-pointer" 
                      onClick={() => handleSort('transactions')}>
                    <div className="flex items-center">
                      Transactions
                      {sortField === 'transactions' && (
                        <FaSort className="ml-1 text-[#ED4A43]" />
                      )}
                    </div>
                  </th>
                  
                  {/* Actions Column */}
                  <th className="px-4 py-2 text-right border-b border-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-2 text-center">
                      Loading payment data...
                    </td>
                  </tr>
                ) : filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-2 text-center">
                      No events found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((event) => (
                    <tr key={event.eventId} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b border-gray-200">
                        {event.eventName}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200">
                        {event.totalTickets}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200 font-medium">
                        {formatCurrency(event.totalRevenue)}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200">
                        {event.transactions}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200 text-right">
                        <button className="text-[#ED4A43]">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              
              {/* Table footer with totals */}
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-4 py-2 font-bold">
                    Total
                  </td>
                  <td className="px-4 py-2 font-bold">
                    {totalTickets}
                  </td>
                  <td className="px-4 py-2 font-bold">
                    {formatCurrency(totalRevenue)}
                  </td>
                  <td className="px-4 py-2 font-bold">
                    {totalTransactions}
                  </td>
                  <td className="px-4 py-2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Recent Transactions Section */}
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left border-b border-gray-200">ID</th>
                  <th className="px-4 py-2 text-left border-b border-gray-200">Event</th>
                  <th className="px-4 py-2 text-left border-b border-gray-200">Customer</th>
                  <th className="px-4 py-2 text-left border-b border-gray-200">Date</th>
                  <th className="px-4 py-2 text-left border-b border-gray-200">Amount</th>
                  <th className="px-4 py-2 text-left border-b border-gray-200">Status</th>
                </tr>
              </thead>
              
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-2 text-center">
                      Loading transaction data...
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-2 text-center">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  // Show only the first 5 payments
                  payments.slice(0, 5).map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b border-gray-200">
                        {payment._id.substring(0, 8)}...
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200">
                        {getEventName(payment.eventId)}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200">
                        {payment.customerName || "Anonymous"}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200 font-medium">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.status || "completed"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {payments.length > 5 && (
            <div className="mt-4 text-center">
              <button className="text-[#ED4A43] font-medium">
                View All Transactions
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};