import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const UserOrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(`/api/user/order-history/${user.id}`);
        setOrders(response.data.orders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order history:', error);
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [user.id]);

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const handleCancelOrder = async (bookingId) => {
    try {
      await axios.post(`/api/user/cancel-order/${bookingId}`);
      
      // Update local state
      setOrders(orders.map(order => 
        order.booking_id === bookingId 
          ? { ...order, status: 'cancelled' } 
          : order
      ));
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Order History</h1>
      
      {/* Filter tabs */}
      <div className="mb-6 border-b">
        <div className="flex space-x-6">
          <button
            className={`py-2 px-1 border-b-2 ${filter === 'all' ? 'border-blue-500 text-blue-500' : 'border-transparent'}`}
            onClick={() => setFilter('all')}
          >
            All Orders
          </button>
          <button
            className={`py-2 px-1 border-b-2 ${filter === 'pending' ? 'border-blue-500 text-blue-500' : 'border-transparent'}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`py-2 px-1 border-b-2 ${filter === 'accepted' ? 'border-blue-500 text-blue-500' : 'border-transparent'}`}
            onClick={() => setFilter('accepted')}
          >
            In Progress
          </button>
          <button
            className={`py-2 px-1 border-b-2 ${filter === 'completed' ? 'border-blue-500 text-blue-500' : 'border-transparent'}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button
            className={`py-2 px-1 border-b-2 ${filter === 'cancelled' ? 'border-blue-500 text-blue-500' : 'border-transparent'}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <p>Loading order history...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">No {filter !== 'all' ? filter : ''} orders found.</p>
          <Link 
            to="/user/book-driver" 
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Book a Driver
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.booking_id} className="bg-white rounded-lg shadow p-4">
              <div className="md:flex justify-between">
                <div>
                  <div className="flex items-center">
                    <p className="font-medium text-lg">Booking #{order.booking_id}</p>
                    <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      order.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {formatDate(order.created_at)}
                  </p>
                  <p className="mt-2">
                    <span className="font-medium">From:</span> {order.pickup_location}
                  </p>
                  <p>
                    <span className="font-medium">To:</span> {order.dropoff_location}
                  </p>
                  <p className="mt-2">
                    <span className="font-medium">Driver ID:</span> {order.driver_id}
                  </p>
                </div>
                
                <div className="mt-4 md:mt-0 md:text-right">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleCancelOrder(order.booking_id)}
                      className="bg-red-100 text-red-700 py-1 px-3 rounded-md hover:bg-red-200 transition-colors mr-2"
                    >
                      Cancel Booking
                    </button>
                  )}
                  
                  {order.status === 'accepted' && (
                    <Link
                      to={`/user/track/${order.booking_id}`}
                      className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Track Driver
                    </Link>
                  )}
                  
                  {order.status === 'completed' && (
                    <button
                      className="bg-yellow-100 text-yellow-700 py-1 px-3 rounded-md hover:bg-yellow-200 transition-colors"
                    >
                      Leave a Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrderHistory;