import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './BookDriver.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

// Kenyan drivers data
const KENYAN_DRIVERS = [
  {
    driver_id: 1,
    name: "David Kamau",
    vehicle_type: "Sedan",
    ratings: 4.8,
    completed_orders: 237,
    price: 1500
  },
  {
    driver_id: 2,
    name: "Faith Wanjiku",
    vehicle_type: "SUV",
    ratings: 4.9,
    completed_orders: 412,
    price: 1850
  },
  {
    driver_id: 3,
    name: "Brian Odhiambo",
    vehicle_type: "Luxury",
    ratings: 4.7,
    completed_orders: 187,
    price: 2200
  },
  {
    driver_id: 4,
    name: "Esther Muthoni",
    vehicle_type: "Economy",
    ratings: 4.6,
    completed_orders: 153,
    price: 1200
  },
  {
    driver_id: 5,
    name: "John Mwangi",
    vehicle_type: "Boda Boda",
    ratings: 4.5,
    completed_orders: 292,
    price: 500
  }
];

// Kenyan promo codes
const KENYAN_PROMO_CODES = {
  "KARIBU10": 0.1,   // 10% off
  "SAFARI20": 0.2,   // 20% off
  "NAIROBI25": 0.25  // 25% off
};

const BookDriver = () => {
  const { user } = useAuth() || { user: { id: 1, name: "Test User" } }; // Fallback for testing
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
  const [mapCenter, setMapCenter] = useState([-1.2921, 36.8219]); // Default center on Nairobi
  const [mapZoom, setMapZoom] = useState(13);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Simulate geocoding with predefined responses for Kenyan locations
  const geocodeAddress = async (address) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mapping of Kenyan addresses to coordinates
    const geocodeMap = {
      'nairobi': { lat: -1.2921, lon: 36.8219 },
      'mombasa': { lat: -4.0435, lon: 39.6682 },
      'kisumu': { lat: -0.1022, lon: 34.7617 },
      'nakuru': { lat: -0.3031, lon: 36.0800 },
      'eldoret': { lat: 0.5143, lon: 35.2698 },
      'thika': { lat: -1.0396, lon: 37.0900 },
      'kitale': { lat: 1.0167, lon: 35.0000 },
      'malindi': { lat: -3.2175, lon: 40.1192 },
      'westlands': { lat: -1.2637, lon: 36.8029 },
      'karen': { lat: -1.3179, lon: 36.7062 },
      'kilimani': { lat: -1.2898, lon: 36.7718 },
      'cbd': { lat: -1.2864, lon: 36.8172 },
      'lavington': { lat: -1.2802, lon: 36.7645 },
      'ngong': { lat: -1.3611, lon: 36.6550 },
      'jkia': { lat: -1.3236, lon: 36.9260 },
      'nyali': { lat: -4.0210, lon: 39.7200 }
    };
    
    // Try to match the address to our map (case insensitive)
    const lowerCaseAddress = address.toLowerCase();
    for (const [key, coords] of Object.entries(geocodeMap)) {
      if (lowerCaseAddress.includes(key)) {
        return coords;
      }
    }
    
    // Fallback: return random coordinates near Nairobi
    return {
      lat: -1.2921 + (Math.random() - 0.5) * 0.1,
      lon: 36.8219 + (Math.random() - 0.5) * 0.1
    };
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // First geocode the addresses using our dummy geocoder
      const pickupCoords = await geocodeAddress(formData.pickup_location);
      const dropoffCoords = await geocodeAddress(formData.dropoff_location);
      
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
      
      // Calculate base price based on distance (in KES)
      const basePrice = 200 + (distance * 50);
      
      // Prepare drivers with individualized pricing
      const drivers = KENYAN_DRIVERS.map(driver => ({
        ...driver,
        // Add some variation to driver prices
        price: basePrice * (0.9 + (Math.random() * 0.3))
      }));
      
      // Create search results
      setSearchResults({
        drivers: drivers,
        distance: distance.toFixed(2),
        price: basePrice,
        calculated_route: {
          from: pickupCoords,
          to: dropoffCoords
        }
      });
      
      setBookingStep(2);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 700));
      setLoading(false);
    } catch (error) {
      console.error('Error in search:', error);
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
    
    // Simulate API delay
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
    
    const promoCode = formData.promo_code.toUpperCase();
    const discount = KENYAN_PROMO_CODES[promoCode];
    
    if (discount) {
      const newPrice = searchResults.price * (1 - discount);
      setSearchResults({
        ...searchResults,
        price: newPrice,
        appliedPromoCode: promoCode,
        discount: discount * 100
      });
      
      toast.success(`Promo code ${promoCode} applied! ${discount * 100}% discount`);
    } else {
      toast.error('Invalid or inactive promo code');
    }
  };

  const handleBookDriver = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Generate a random booking ID
    const bookingId = Math.floor(100000 + Math.random() * 900000);
    
    toast.success('Driver booked successfully!');
    
    // Redirect to a fictional tracking page
    // Note: If the navigate function isn't available in the test environment,
    // we'll just log the navigation and handle booking completion in this component
    try {
      navigate(`/user/track/${bookingId}`);
    } catch (error) {
      console.log(`Would navigate to: /user/track/${bookingId}`);
      toast.info(`Booking #${bookingId} confirmed. Your driver will arrive shortly.`);
      setLoading(false);
      setBookingStep(1);
      setFormData({
        pickup_location: '',
        dropoff_location: '',
        promo_code: ''
      });
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
              <p className="text-xs text-gray-500 mt-1">Try: CBD, Westlands, Kilimani, Karen, etc.</p>
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
              <p className="text-xs text-gray-500 mt-1">Try: JKIA, Lavington, Ngong, Thika, etc.</p>
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
            <p><span className="font-medium">Estimated Price:</span> KES {searchResults.price.toFixed(0)}</p>
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
                      <p className="font-bold">KES {driver.price.toFixed(0)}</p>
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
            
            {searchResults.appliedPromoCode && (
              <div className="bg-green-50 border border-green-200 rounded p-2 mt-2">
                <p className="text-green-700">
                  <span className="font-medium">Promo applied:</span> {searchResults.appliedPromoCode} ({searchResults.discount}% off)
                </p>
              </div>
            )}
            
            <p><span className="font-medium">Price:</span> KES {searchResults.price.toFixed(0)}</p>
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
                disabled={loading}
              >
                Apply
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Try: KARIBU10, SAFARI20, NAIROBI25</p>
          </div>
          
          <div className="flex justify-between">
            <button
              className="text-blue-600 hover:text-blue-800"
              onClick={() => setBookingStep(2)}
              disabled={loading}
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