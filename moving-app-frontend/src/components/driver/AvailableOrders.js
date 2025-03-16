import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AvailableOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/driver/available-orders');
      setOrders(response.data.orders);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching available orders:', error);
      toast.error('Failed to load available orders');
      setIsLoading(false);
    }
  };

  const handleAcceptOrder = async (bookingId) => {
    try {
      setIsAccepting(true);
      await axios.post(`http://localhost:5000/api/driver/accept-order/${bookingId}`);
      toast.success('Order accepted successfully!');
      
      // Remove the accepted order from the list
      setOrders(orders.filter(order => order.booking_id !== bookingId));
      setIsAccepting(false);
    } catch (error) {
      console.error('Error accepting order:', error);
      toast.error('Failed to accept order');
      setIsAccepting(false);
    }
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Available Orders</h1>
        <button 
          onClick={fetchOrders}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Available Orders</h2>
          <p className="text-gray-500 mb-4">
            There are no pending orders available for acceptance at the moment.
          </p>
          <p className="text-gray-500">
            Check back later or refresh to see new orders.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order.booking_id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">Booking #{order.booking_id}</h2>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    Pending
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-gray-600 text-sm">Pickup Location:</p>
                    <p className="font-medium">{order.pickup_location}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 text-sm">Dropoff Location:</p>
                    <p className="font-medium">{order.dropoff_location}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Distance:</p>
                      <p className="font-medium">{order.distance} km</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600 text-sm">Price:</p>
                      <p className="font-medium text-green-600">${order.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleAcceptOrder(order.booking_id)}
                  disabled={isAccepting}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isAccepting ? 'Accepting...' : 'Accept Order'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableOrders;