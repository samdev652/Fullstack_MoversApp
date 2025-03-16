import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

// Set the base URL for axios
axios.defaults.baseURL = 'http://localhost:5000';

const UserDashboard = () => {
  const { currentUser } = useAuth(); // Use currentUser instead of user
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0
  });

  // Redirect to login if user is not logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/user/order-history/${currentUser.id}`);
        const orders = response.data.orders;
        
        // Get most recent 3 bookings
        const sortedOrders = [...orders].sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        setRecentBookings(sortedOrders.slice(0, 3));
        
        // Calculate stats
        const activeCount = orders.filter(order => 
          order.status === 'pending' || order.status === 'accepted'
        ).length;
        const completedCount = orders.filter(order => 
          order.status === 'completed'
        ).length;
        const cancelledCount = orders.filter(order => 
          order.status === 'cancelled'
        ).length;
        
        setStats({
          activeBookings: activeCount,
          completedBookings: completedCount,
          cancelledBookings: cancelledCount
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser.id]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {currentUser.email}!</h1> {/* Use email instead of name */}
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/user/book-driver" 
            className="bg-blue-600 text-white rounded-md py-3 px-4 text-center hover:bg-blue-700 transition-colors"
          >
            Book a Driver
          </Link>
          <Link 
            to="/user/wallet" 
            className="bg-green-600 text-white rounded-md py-3 px-4 text-center hover:bg-green-700 transition-colors"
          >
            Manage Wallet
          </Link>
          <Link 
            to="/user/support" 
            className="bg-purple-600 text-white rounded-md py-3 px-4 text-center hover:bg-purple-700 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-md">
            <p className="text-lg font-medium">Active Bookings</p>
            <p className="text-2xl font-bold text-blue-600">{stats.activeBookings}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-md">
            <p className="text-lg font-medium">Completed Trips</p>
            <p className="text-2xl font-bold text-green-600">{stats.completedBookings}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-md">
            <p className="text-lg font-medium">Cancelled Bookings</p>
            <p className="text-2xl font-bold text-red-600">{stats.cancelledBookings}</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Bookings</h2>
          <Link to="/user/orders" className="text-blue-600 hover:text-blue-800">
            View All
          </Link>
        </div>
        
        {loading ? (
          <p>Loading recent bookings...</p>
        ) : recentBookings.length > 0 ? (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.booking_id} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Booking #{booking.booking_id}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                    <p className="mt-1">
                      <span className="font-medium">From:</span> {booking.pickup_location}
                    </p>
                    <p>
                      <span className="font-medium">To:</span> {booking.dropoff_location}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      booking.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    {booking.status === 'accepted' && (
                      <Link 
                        to={`/user/track/${booking.booking_id}`}
                        className="block mt-2 text-blue-600 hover:text-blue-800"
                      >
                        Track Driver
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You don't have any bookings yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;