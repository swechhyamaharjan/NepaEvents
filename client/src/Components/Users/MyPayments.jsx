import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { useAuth } from "../../Context/AuthContext";
import { FaCalendarAlt, FaMapMarkerAlt, FaCreditCard, FaReceipt } from "react-icons/fa";

const MyPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/my-payments');
      setPayments(response.data.receipts || []);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchPaymentHistory();
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED4A43]"></div></div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Venue Payments</h1>
        {payments.length > 0 ? (
          <div className="space-y-6">
            {payments.map((p) => (
              <div key={p._id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#ED4A43]">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold">{p.venue?.name || "Venue"}</h2>
                    <p className="text-gray-600 text-sm flex items-center"><FaCalendarAlt className="mr-2 text-[#ED4A43]" /> {new Date(p.paymentDate).toLocaleString()}</p>
                    <p className="text-gray-600 text-sm flex items-center"><FaMapMarkerAlt className="mr-2 text-[#ED4A43]" /> {p.venue?.location}</p>
                    <p className="text-gray-600 text-sm flex items-center"><FaCreditCard className="mr-2 text-[#ED4A43]" /> Transaction #{p.transactionId?.substring(0, 8)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
                    <span className="text-2xl font-bold text-[#ED4A43]">${p.amountPaid?.toFixed(2)}</span>
                    <button
                      onClick={() => window.open(`${api.defaults.baseURL}/api/venue-bookings/${p._id}/download-receipt`, '_blank')}
                      className="inline-flex items-center px-4 py-2 bg-[#ED4A43] text-white text-sm rounded-md hover:bg-red-600"
                    >
                      <FaReceipt className="mr-2" /> Download Receipt
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow"><p className="text-gray-500">No payment records found.</p></div>
        )}
      </div>
    </div>
  );
};

export default MyPayments;