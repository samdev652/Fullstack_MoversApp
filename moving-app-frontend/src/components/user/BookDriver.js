import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './BookDriver.css'; // You'll need to create this CSS file

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const BookDriver = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickup_location: '',
    dropoff_location: '',
    promo_code: ''
  });
  const [searchResults, setSearchResults] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [locations, setLocations] = useState({
    pickup: null,
    dropoff: null
  });
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [mapZoom, setMapZoom] = useState(13);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Geocode function to convert addresses to coordinates
  const geocodeAddress = async (address) => {
    try {
      // Using OpenStreetMap's Nominatim API for geocoding (no API key required)
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: address,
          format: 'json',
          limit: 1
        },
        headers: {
          'Accept-Language': 'en'
        }
      });

      if (response.data && response.data.length > 0) {
        return {
          lat: parseFloat(response.data[0].lat),
          lon: parseFloat(response.data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // First geocode the addresses
      const pickupCoords = await geocodeAddress(formData.pickup_location);
      const dropoffCoords = await geocodeAddress(formData.dropoff_location);
      
      if (!pickupCoords || !dropoffCoords) {
        toast.error('Could not find one or both of the locations. Please check the addresses.');
        setLoading(false);
        return;
      }
      
      // Update the locations state
      setLocations({
        pickup: pickupCoords,
        dropoff: dropoffCoords
      });
      
      // Calculate the center of the two points for the map
      const centerLat = (pickupCoords.lat + dropoffCoords.lat) / 2;
      const centerLon = (pickupCoords.lon + dropoffCoords.lon) / 2;
      setMapCenter([centerLat, centerLon]);
      
      // Adjust zoom to fit both markers
      setMapZoom(12);
      
      // Calculate actual distance using Haversine formula
      const distance = calculateDistance(
        pickupCoords.lat, pickupCoords.lon,
        dropoffCoords.lat, dropoffCoords.lon
      );
      
      // Now search for drivers with the API
      const response = await axios.post('/api/user/search-drivers', {
        pickup_location: formData.pickup_location,
        dropoff_location: formData.dropoff_location
      });
      
      // Merge our calculated distance with the API response
      setSearchResults({
        ...response.data,
        distance: distance.toFixed(2), // Use our calculated distance
        calculated_route: {
          from: pickupCoords,
          to: dropoffCoords
        }
      });
      
      setBookingStep(2);
      setLoading(false);
    } catch (error) {
      console.error('Error searching for drivers:', error);
      toast.error('Failed to search for drivers. Please try again.');
      setLoading(false);
    }
  };

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  const handleSelectDriver = (driver) => {
    setSelectedDriver(driver);
    setBookingStep(3);
  };

  const handleApplyPromo = async () => {
    if (!formData.promo_code.trim()) {
      toast.error('Please enter a promo code');
      return;
    }
    
    try {
      const response = await axios.post('/api/user/apply-promo-code', {
        promo_code: formData.promo_code,
        booking_id: null // This will be updated after booking is created
      });
      
      setSearchResults({
        ...searchResults,
        price: response.data.new_price
      });
      
      toast.success('Promo code applied successfully!');
    } catch (error) {
      console.error('Error applying promo code:', error);
      toast.error('Invalid or inactive promo code');
    }
  };

  const handleBookDriver = async () => {
    setLoading(true);
    
    try {
      const response = await axios.post('/api/user/book-driver', {
        user_id: user.id,
        driver_id: selectedDriver.driver_id,
        pickup_location: formData.pickup_location,
        dropoff_location: formData.dropoff_location,
        distance: searchResults.distance,
        price: searchResults.price,
        promo_code: formData.promo_code
      });
      
      toast.success('Driver booked successfully!');
      navigate(`/user/track/${response.data.booking_id}`);
    } catch (error) {
      console.error('Error booking driver:', error);
      toast.error('Failed to book driver. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Book a Driver</h1>
      
      {/* Step indicators */}
      <div className="flex mb-8">
        <div className={`flex-1 border-b-2 pb-2 ${bookingStep >= 1 ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-500'}`}>
          1. Enter Locations
        </div>
        <div className={`flex-1 border-b-2 pb-2 ${bookingStep >= 2 ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-500'}`}>
          2. Select Driver
        </div>
        <div className={`flex-1 border-b-2 pb-2 ${bookingStep >= 3 ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-500'}`}>
          3. Confirm Booking
        </div>
      </div>
      
      {/* Step 1: Enter locations */}
      {bookingStep === 1 && (
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSearch}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="pickup_location">
                Pickup Location
              </label>
              <input
                type="text"
                id="pickup_location"
                name="pickup_location"
                value={formData.pickup_location}
                onChange={handleChange}
                className="w-full border rounded-md py-2 px-3"
                required
                placeholder="Enter pickup address"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="dropoff_location">
                Dropoff Location
              </label>
              <input
                type="text"
                id="dropoff_location"
                name="dropoff_location"
                value={formData.dropoff_location}
                onChange={handleChange}
                className="w-full border rounded-md py-2 px-3"
                required
                placeholder="Enter destination address"
              />
            </div>
            
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors w-full"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search for Drivers'}
            </button>
          </form>
        </div>
      )}
      
      {/* Step 2: Select driver with map */}
      {bookingStep === 2 && searchResults && (
        <div className="bg-white rounded-lg shadow p-6">
          {/* Map display */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Trip Route</h2>
            <div className="map-container border rounded-lg overflow-hidden" style={{ height: '300px' }}>
              {locations.pickup && locations.dropoff && (
                <MapContainer 
                  center={mapCenter} 
                  zoom={mapZoom} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[locations.pickup.lat, locations.pickup.lon]}>
                    <Popup>
                      Pickup: {formData.pickup_location}
                    </Popup>
                  </Marker>
                  <Marker position={[locations.dropoff.lat, locations.dropoff.lon]}>
                    <Popup>
                      Dropoff: {formData.dropoff_location}
                    </Popup>
                  </Marker>
                  <Polyline
                    positions={[
                      [locations.pickup.lat, locations.pickup.lon],
                      [locations.dropoff.lat, locations.dropoff.lon]
                    ]}
                    color="blue"
                  />
                </MapContainer>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Trip Details</h2>
            <p><span className="font-medium">Distance:</span> {searchResults.distance} km</p>
            <p><span className="font-medium">Estimated Price:</span> ${searchResults.price.toFixed(2)}</p>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Available Drivers</h2>
          
          {searchResults.drivers && searchResults.drivers.length > 0 ? (
            <div className="space-y-4">
              {searchResults.drivers.map((driver) => (
                <div 
                  key={driver.driver_id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectDriver(driver)}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-sm text-gray-600">Vehicle: {driver.vehicle_type}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span>{driver.ratings.toFixed(1)}</span>
                        <span className="text-gray-500 text-sm ml-2">
                          ({driver.completed_orders} trips)
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${driver.price.toFixed(2)}</p>
                      <button
                        className="mt-2 bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectDriver(driver);
                        }}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No drivers available at the moment. Please try again later.</p>
          )}
          
          <button
            className="mt-6 text-blue-600 hover:text-blue-800"
            onClick={() => setBookingStep(1)}
          >
            ← Back to locations
          </button>
        </div>
      )}
      
      {/* Step 3: Confirm booking with map */}
      {bookingStep === 3 && selectedDriver && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Confirm Booking</h2>
          
          {/* Map in confirmation */}
          <div className="mb-6">
            <div className="map-container border rounded-lg overflow-hidden" style={{ height: '200px' }}>
              {locations.pickup && locations.dropoff && (
                <MapContainer 
                  center={mapCenter} 
                  zoom={mapZoom} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[locations.pickup.lat, locations.pickup.lon]}>
                    <Popup>
                      Pickup: {formData.pickup_location}
                    </Popup>
                  </Marker>
                  <Marker position={[locations.dropoff.lat, locations.dropoff.lon]}>
                    <Popup>
                      Dropoff: {formData.dropoff_location}
                    </Popup>
                  </Marker>
                  <Polyline
                    positions={[
                      [locations.pickup.lat, locations.pickup.lon],
                      [locations.dropoff.lat, locations.dropoff.lon]
                    ]}
                    color="blue"
                  />
                </MapContainer>
              )}
            </div>
          </div>
          
          <div className="mb-6 space-y-2">
            <p><span className="font-medium">From:</span> {formData.pickup_location}</p>
            <p><span className="font-medium">To:</span> {formData.dropoff_location}</p>
            <p><span className="font-medium">Distance:</span> {searchResults.distance} km</p>
            <p><span className="font-medium">Price:</span> ${searchResults.price.toFixed(2)}</p>
            <p><span className="font-medium">Driver:</span> {selectedDriver.name}</p>
            <p><span className="font-medium">Vehicle:</span> {selectedDriver.vehicle_type}</p>
          </div>
          
          {/* Promo code section */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="promo_code">
              Promo Code (Optional)
            </label>
            <div className="flex">
              <input
                type="text"
                id="promo_code"
                name="promo_code"
                value={formData.promo_code}
                onChange={handleChange}
                className="flex-1 border rounded-l-md py-2 px-3"
                placeholder="Enter promo code"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-r-md hover:bg-gray-300 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              className="text-blue-600 hover:text-blue-800"
              onClick={() => setBookingStep(2)}
            >
              ← Back to drivers
            </button>
            
            <button
              className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors"
              onClick={handleBookDriver}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDriver;