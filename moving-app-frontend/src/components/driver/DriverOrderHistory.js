import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const DriverOrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, completed, accepted, cancelled
  
  useEffect(() => {
    fetchOrderHistory();
  }, [user.id]);
  
  const fetchOrderHistory = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:5000/api/driver/order-history/${user.id}`);
      setOrders(response.data.orders);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching order history:', error);
      toast.error('Failed to load order history');
      setIsLoading(false);
    }
  };
  
  const handleCompleteOrder = async (bookingId) => {
    try {
      // This endpoint doesn't exist in your backend, but would need to be added
      await axios.post(`http://localhost:5000/api/driver/complete-order/${bookingId}`);
      toast.success('Order marked as completed');
      fetchOrderHistory(); // Refresh the order list
    } catch (error) {
      console.error('Error completing order:', error);
      toast.error('Failed to complete order');
    }
  };
  
  const handleCancelOrder = async (bookingId) => {
    try {
      await axios.post(`http://localhost:5000/api/driver/cancel-order/${bookingId}`);
      toast.success('Order cancelled successfully');
      fetchOrderHistory(); // Refresh the order list
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    }
  };
  
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Order History</h1>
      
      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setFilter('accepted')}
            className={`px-4 py-2 rounded-md ${
              filter === 'accepted' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-md ${
              filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-md ${
              filter === 'cancelled' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Orders Found</h2>
          <p className="text-gray-500">
            {filter === 'all' 
              ? "You haven't taken any orders yet." 
              : `You don't have any ${filter} orders.`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Booking ID</th>
                  <th className="py-3 px-6 text-left">User</th>
                  <th className="py-3 px-6 text-left">Pickup</th>
                  <th className="py-3 px-6 text-left">Dropoff</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {filteredOrders.map((order) => (
                  <tr key={order.booking_id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6">{order.booking_id}</td>
                    <td className="py-3 px-6">User #{order.user_id}</td>
                    <td className="py-3 px-6">{order.pickup_location}</td>
                    <td className="py-3 px-6">{order.dropoff_location}</td>
                    <td className="py-3 px-6">
                      <span className={`py-1 px-2 rounded-full text-xs ${getStatusBadgeClass(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-6">{formatDate(order.created_at)}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-2">
                        {order.status === 'accepted' && (
                          <>
                            <button 
                              onClick={() => handleCompleteOrder(order.booking_id)}
                              className="text-green-500 hover:text-green-700"
                            >
                              Complete
                            </button>
                            <button 
                              onClick={() => handleCancelOrder(order.booking_id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {order.status === 'completed' && (
                          <span className="text-gray-500">No actions</span>
                        )}
                        {order.status === 'cancelled' && (
                          <span className="text-gray-500">No actions</span>
                        )}
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => handleCancelOrder(order.booking_id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverOrderHistory;