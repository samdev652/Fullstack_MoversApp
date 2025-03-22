import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DriverDashboard = () => {
  const { currentUser } = useAuth();
  const [driver, setDriver] = useState(null);
  const [activeOrders, setActiveOrders] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [earnings, setEarnings] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [ratings, setRatings] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser || !currentUser.id) {
        toast.error('User information not available. Please log in again.');
        setIsLoading(false);
        return;
      }

      try {
        const orderHistoryResponse = await axios.get(`http://localhost:5000/api/driver/order-history/${currentUser.id}`);

        if (orderHistoryResponse.data.orders) {
          const completedOrdersCount = orderHistoryResponse.data.orders.filter(
            order => order.status === 'completed'
          ).length;

          setCompletedOrders(completedOrdersCount);
          setActiveOrders(orderHistoryResponse.data.orders.filter(order => order.status === 'accepted'));

          setRatings(4.5);
          setEarnings(0);

          setIsAvailable(true);

          setDriver({
            id: currentUser.id,
            completedOrders: completedOrdersCount,
            ratings: 4.5,
            earnings: 0
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching driver data:', error);
        toast.error('Failed to load driver data. Please try refreshing the page.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const toggleAvailability = async () => {
    if (!currentUser || !currentUser.id) {
      toast.error('User information not available. Please log in again.');
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post('http://localhost:5000/api/driver/toggle-availability', {
        driver_id: currentUser.id,
        is_available: !isAvailable
      });

      if (response.data) {
        setIsAvailable(response.data.is_available);
        toast.success(`You are now ${response.data.is_available ? 'available' : 'unavailable'} for new orders`);
      } else {
        toast.error('Failed to update availability status');
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast.error('Failed to update availability status');
      setIsLoading(false);
    }
  };

  const updateLocation = async () => {
    if (!currentUser || !currentUser.id) {
      toast.error('User information not available. Please log in again.');
      return;
    }

    try {
      if (!navigator.geolocation) {
        toast.error('Geolocation is not supported by your browser');
        return;
      }

      toast.info('Getting your location...');

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const locationString = `${latitude},${longitude}`;

            const response = await axios.post('http://localhost:5000/api/driver/update-location', {
              driver_id: currentUser.id,
              live_location: locationString
            });

            if (response.data) {
              toast.success('Location updated successfully');
            } else {
              toast.error('Failed to update location on server');
            }
          } catch (error) {
            console.error('Error sending location to server:', error);
            toast.error('Failed to update location on server');
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errorMessage = 'Failed to get your location';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please allow location access in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please try again later.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
            default:
              errorMessage = 'An unknown error occurred while getting your location.';
          }

          toast.error(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } catch (error) {
      console.error('Error in location update process:', error);
      toast.error('Failed to update location');
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
    <div className="max-w-6xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">Driver Dashboard</h1>

      {/* Status Toggle */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Driver Status</h2>
            <p className={`text-lg ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
              {isAvailable ? 'Available for Orders' : 'Unavailable'}
            </p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <button
              onClick={updateLocation}
              className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
            >
              Update Location
            </button>
            <button
              onClick={toggleAvailability}
              className={`px-4 py-2 rounded-md ${
                isAvailable
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isAvailable ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Completed Orders</h3>
          <p className="text-3xl font-bold text-blue-600">{completedOrders}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Rating</h3>
          <p className="text-3xl font-bold text-yellow-500">{ratings} / 5</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Available Balance</h3>
          <p className="text-3xl font-bold text-green-600">${earnings.toFixed(2)}</p>
          <Link to="/driver/wallet" className="text-blue-500 hover:underline text-sm">
            View Wallet
          </Link>
        </div>
      </div>

      {/* Active Orders */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Active Orders</h2>
          <Link to="/driver/available-orders" className="text-blue-500 hover:underline mt-2 md:mt-0">
            View All Available Orders
          </Link>
        </div>

        {activeOrders.length === 0 ? (
          <p className="text-gray-500">No active orders at the moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Booking ID</th>
                  <th className="py-3 px-6 text-left">Pickup</th>
                  <th className="py-3 px-6 text-left">Dropoff</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {activeOrders.map((order) => (
                  <tr key={order.booking_id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6">{order.booking_id}</td>
                    <td className="py-3 px-6">{order.pickup_location}</td>
                    <td className="py-3 px-6">{order.dropoff_location}</td>
                    <td className="py-3 px-6">
                      <span
                        className={`py-1 px-2 rounded-full text-xs ${
                          order.status === 'accepted'
                            ? 'bg-green-200 text-green-800'
                            : 'bg-yellow-200 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <button
                        className="transform hover:text-blue-500 hover:scale-110 transition duration-300 ease-in-out"
                        onClick={() => (window.location.href = `/driver/orders/${order.booking_id}`)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
