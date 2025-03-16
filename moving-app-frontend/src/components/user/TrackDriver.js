import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const TrackDriver = () => {
  const { bookingId } = useParams();
  const [trackingData, setTrackingData] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Reference for polling interval
  const pollingIntervalRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch booking details (this would be a separate endpoint in a real app)
        const bookingResponse = await axios.get(`/api/user/track/${bookingId}`);
        setTrackingData(bookingResponse.data);
        
        // Simulating booking details since we don't have a specific endpoint
        // In a real app, you would fetch this from the backend
        setBookingDetails({
          booking_id: parseInt(bookingId),
          pickup_location: "123 Main St",
          dropoff_location: "456 Elm St",
          status: "accepted",
          driver_name: "John Doe",
          driver_phone: "555-123-4567"
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tracking data:', error);
        setError('Failed to load tracking information. Please try again.');
        setLoading(false);
      }
    };

    fetchInitialData();

    // Set up polling interval for real-time updates
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await axios.get(`/api/user/track/${bookingId}`);
        setTrackingData(response.data);
      } catch (error) {
        console.error('Error polling tracking data:', error);
      }
    }, 10000); // Poll every 10 seconds

    // Cleanup interval on component unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [bookingId]);

  const parseCoordinates = (locationString) => {
    if (!locationString) return null;
    
    // Assuming location string is in format "latitude,longitude"
    const [lat, lng] = locationString.split(',').map(Number);
    return { lat, lng };
  };

  return (
    <div>
      <div className="mb-4">
        <Link to="/user/orders" className="text-blue-600 hover:text-blue-800">
          ← Back to Orders
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Track Driver</h1>
      
      {loading ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p>Loading tracking information...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Booking Information */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
              
              <div className="space-y-3">
                <p>
                  <span className="font-medium">Booking ID:</span> #{bookingDetails.booking_id}
                </p>
                <p>
                  <span className="font-medium">Status:</span> {bookingDetails.status}
                </p>
                <p>
                  <span className="font-medium">From:</span> {bookingDetails.pickup_location}
                </p>
                <p>
                  <span className="font-medium">To:</span> {bookingDetails.dropoff_location}
                </p>
                
                <div className="border-t pt-3 mt-3">
                  <h3 className="font-medium mb-2">Driver Information</h3>
                  <p>
                    <span className="font-medium">Name:</span> {bookingDetails.driver_name}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {bookingDetails.driver_phone}
                  </p>
                </div>
                
                <button className="mt-4 bg-blue-600 text-white w-full py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  Call Driver
                </button>
                
                <button className="mt-2 bg-gray-200 text-gray-800 w-full py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
                  Message Driver
                </button>
              </div>
            </div>
          </div>
          // Tracking Map & Updates
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Driver Location</h2>
              {trackingData && trackingData.location ? (
                <div className="h-64 w-full bg-gray-200 flex items-center justify-center rounded-lg">
                  {/* Replace with an actual map component like Google Maps or Leaflet */}
                  <p>Map Placeholder: Driver at {trackingData.location}</p>
                </div>
              ) : (
                <p className="text-gray-500">Location data unavailable.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackDriver;
