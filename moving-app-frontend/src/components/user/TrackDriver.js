import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";

const TrackDriver = () => {
  const { bookingId } = useParams();
  const [trackingData, setTrackingData] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reference for simulation interval
  const simulationIntervalRef = useRef(null);

  // Dummy data for tracking - Starting point in Nairobi
  const dummyTrackingData = {
    location: "-1.2864,36.8172", // Nairobi CBD coordinates
    heading: 45,
    speed: 35,
    last_updated: new Date().toISOString(),
  };

  // Dummy data for booking details with Kenyan context
  const dummyBookingDetails = {
    booking_id: parseInt(bookingId || 12345),
    pickup_location: "Junction Mall, Ngong Road, Nairobi",
    dropoff_location: "Lavington Mall, James Gichuru Road",
    status: "in_progress",
    driver_name: "David Kamau",
    driver_phone: "0722 123 456",
    vehicle: "Toyota Fielder",
    vehicle_color: "Silver",
    license_plate: "KCF 234P",
  };

  useEffect(() => {
    // Simulate initial data loading
    const loadDummyData = () => {
      setTimeout(() => {
        setTrackingData(dummyTrackingData);
        setBookingDetails(dummyBookingDetails);
        setLoading(false);
      }, 1500); // Simulate a short loading time
    };

    loadDummyData();

    // Simulate real-time updates by slightly changing the location every few seconds
    let movingNorth = true;
    let movingEast = true;

    simulationIntervalRef.current = setInterval(() => {
      setTrackingData((prevData) => {
        if (!prevData) return dummyTrackingData;

        const [lat, lng] = prevData.location.split(",").map(Number);

        // Randomly change direction occasionally
        if (Math.random() < 0.2) movingNorth = !movingNorth;
        if (Math.random() < 0.2) movingEast = !movingEast;

        // Update location by a small random amount
        const latDelta = Math.random() * 0.001 * (movingNorth ? 1 : -1);
        const lngDelta = Math.random() * 0.001 * (movingEast ? 1 : -1);

        return {
          ...prevData,
          location: `${(lat + latDelta).toFixed(6)},${(lng + lngDelta).toFixed(
            6
          )}`,
          speed: Math.floor(25 + Math.random() * 20), // Random speed between 25-45 kph
          last_updated: new Date().toISOString(),
        };
      });
    }, 5000); // Update every 5 seconds

    // Cleanup interval on component unmount
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, [bookingId]);

  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="dashboard-container">
      <div className="mb-3">
        <Link
          to="/user/orders"
          style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
        >
          ← Back to Orders
        </Link>
      </div>

      <h1 className="dashboard-title">Track Driver - Real-Time Monitoring</h1>

      {loading ? (
        <div className="card text-center">
          <div className="loading">Loading tracking information...</div>
        </div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div
          className="grid"
          style={{ gridTemplateColumns: "1fr", gap: "25px" }}
        >
          {/* Main Tracking Dashboard - Top Section */}
          <div className="card">
            <h2>📍 Live Driver Location</h2>
            {trackingData && trackingData.location ? (
              <div>
                <div
                  style={{
                    height: "400px",
                    background:
                      "linear-gradient(135deg, rgba(255, 102, 0, 0.1), rgba(255, 204, 0, 0.1))",
                    border: "2px solid rgba(255, 102, 0, 0.3)",
                    borderRadius: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <h3 style={{ color: "#ff6600", marginBottom: "15px" }}>
                      🗺️ Map Integration Ready
                    </h3>
                    <p style={{ fontSize: "18px", marginBottom: "10px" }}>
                      <strong>Current Position:</strong> {trackingData.location}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "30px",
                        justifyContent: "center",
                        marginTop: "20px",
                      }}
                    >
                      <div className="stat-card" style={{ minWidth: "150px" }}>
                        <h3 style={{ fontSize: "28px" }}>
                          {trackingData.heading}°
                        </h3>
                        <p style={{ fontSize: "14px" }}>Direction</p>
                      </div>
                      <div className="stat-card" style={{ minWidth: "150px" }}>
                        <h3 style={{ fontSize: "28px" }}>
                          {trackingData.speed}
                        </h3>
                        <p style={{ fontSize: "14px" }}>km/h</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "15px",
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "10px",
                  }}
                >
                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {formatDateTime(trackingData.last_updated)}
                  </p>
                  <span
                    className="status status-confirmed"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    🚗 Driver En Route
                  </span>
                </div>
              </div>
            ) : (
              <p>Location data unavailable.</p>
            )}
          </div>

          {/* Two Column Layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
              gap: "25px",
            }}
          >
            {/* Left Column - Booking & Driver Info */}
            <div>
              {/* Booking Details Card */}
              <div className="card">
                <h2>📋 Booking Information</h2>
                <table style={{ marginTop: "15px" }}>
                  <tbody>
                    <tr>
                      <td style={{ width: "40%", fontWeight: "600" }}>
                        Booking ID
                      </td>
                      <td>#{bookingDetails.booking_id}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "600" }}>Status</td>
                      <td>
                        <span className="status status-in-progress">
                          {bookingDetails.status
                            .replace("_", " ")
                            .toUpperCase()}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "600" }}>Pickup Location</td>
                      <td>{bookingDetails.pickup_location}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "600" }}>Dropoff Location</td>
                      <td>{bookingDetails.dropoff_location}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Driver Information Card */}
              <div className="card" style={{ marginTop: "25px" }}>
                <h2>👤 Driver Details</h2>
                <table style={{ marginTop: "15px" }}>
                  <tbody>
                    <tr>
                      <td style={{ width: "40%", fontWeight: "600" }}>Name</td>
                      <td>{bookingDetails.driver_name}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "600" }}>Phone</td>
                      <td>{bookingDetails.driver_phone}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "600" }}>Vehicle</td>
                      <td>
                        {bookingDetails.vehicle_color} {bookingDetails.vehicle}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "600" }}>License Plate</td>
                      <td style={{ fontWeight: "bold", color: "#ffcc00" }}>
                        {bookingDetails.license_plate}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "15px",
                    marginTop: "20px",
                  }}
                >
                  <button style={{ width: "100%" }}>📞 Call Driver</button>
                  <button style={{ width: "100%" }}>💬 Message</button>
                </div>
              </div>

              {/* Fare Breakdown Card */}
              <div className="card" style={{ marginTop: "25px" }}>
                <h2>💰 Fare Breakdown</h2>
                <table style={{ marginTop: "15px" }}>
                  <tbody>
                    <tr>
                      <td>Base Fare</td>
                      <td style={{ textAlign: "right", fontWeight: "600" }}>
                        KSh 200
                      </td>
                    </tr>
                    <tr>
                      <td>Distance (5.3 km)</td>
                      <td style={{ textAlign: "right", fontWeight: "600" }}>
                        KSh 350
                      </td>
                    </tr>
                    <tr>
                      <td>Time Charge</td>
                      <td style={{ textAlign: "right", fontWeight: "600" }}>
                        KSh 100
                      </td>
                    </tr>
                    <tr
                      style={{ borderTop: "2px solid rgba(255, 102, 0, 0.5)" }}
                    >
                      <td
                        style={{
                          fontWeight: "bold",
                          fontSize: "18px",
                          paddingTop: "10px",
                        }}
                      >
                        Total Amount
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontWeight: "bold",
                          fontSize: "20px",
                          color: "#ffcc00",
                          paddingTop: "10px",
                        }}
                      >
                        KSh 650
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div
                  style={{
                    marginTop: "15px",
                    padding: "10px",
                    background: "rgba(76, 175, 80, 0.1)",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <span style={{ color: "#4caf50", fontWeight: "600" }}>
                    ✓ Paid via M-PESA
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Timeline & Traffic */}
            <div>
              {/* Journey Timeline Card */}
              <div className="card">
                <h2>🕒 Journey Timeline</h2>
                <div style={{ marginTop: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      marginBottom: "25px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "linear-gradient(145deg, #4caf50, #2e7d32)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "18px",
                        boxShadow: "0 4px 15px rgba(76, 175, 80, 0.4)",
                        zIndex: 1,
                      }}
                    >
                      ✓
                    </div>
                    <div style={{ marginLeft: "20px", flex: 1 }}>
                      <p
                        style={{
                          fontWeight: "600",
                          fontSize: "16px",
                          marginBottom: "5px",
                        }}
                      >
                        Driver Accepted Booking
                      </p>
                      <p style={{ color: "#aaa", fontSize: "14px" }}>
                        10:32 AM
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      marginBottom: "25px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "linear-gradient(145deg, #ff6600, #ff4500)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "18px",
                        boxShadow: "0 4px 15px rgba(255, 102, 0, 0.5)",
                        animation: "pulse 2s infinite",
                        zIndex: 1,
                      }}
                    >
                      🚗
                    </div>
                    <div style={{ marginLeft: "20px", flex: 1 }}>
                      <p
                        style={{
                          fontWeight: "600",
                          fontSize: "16px",
                          marginBottom: "5px",
                        }}
                      >
                        Driver On The Way
                      </p>
                      <p
                        style={{
                          color: "#ffcc00",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        Currently Active - 10:36 AM
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", opacity: 0.5 }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "rgba(255, 255, 255, 0.2)",
                        border: "2px dashed rgba(255, 255, 255, 0.3)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "18px",
                      }}
                    >
                      3
                    </div>
                    <div style={{ marginLeft: "20px", flex: 1 }}>
                      <p
                        style={{
                          fontWeight: "600",
                          fontSize: "16px",
                          marginBottom: "5px",
                        }}
                      >
                        Arriving at Pickup
                      </p>
                      <p style={{ color: "#aaa", fontSize: "14px" }}>
                        Estimated: 10:45 AM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Traffic Information Card */}
              <div className="card" style={{ marginTop: "25px" }}>
                <h2>🚦 Traffic & Route Information</h2>

                <div
                  style={{
                    marginTop: "15px",
                    padding: "15px",
                    background: "rgba(255, 193, 7, 0.1)",
                    border: "1px solid rgba(255, 193, 7, 0.3)",
                    borderRadius: "10px",
                    borderLeft: "4px solid #ffc107",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "600",
                      color: "#ff8c00",
                      marginBottom: "8px",
                      fontSize: "16px",
                    }}
                  >
                    ⚠️ Moderate Traffic Alert
                  </p>
                  <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
                    Expect slight delays of <strong>5-10 minutes</strong> due to
                    construction near Adams Arcade on Ngong Road
                  </p>
                </div>

                <table style={{ marginTop: "20px" }}>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: "600" }}>
                        🕐 Estimated Arrival
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          color: "#ffcc00",
                          fontWeight: "bold",
                        }}
                      >
                        10:45 AM
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "600" }}>
                        📏 Distance to Pickup
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          color: "#ffcc00",
                          fontWeight: "bold",
                        }}
                      >
                        2.3 km
                      </td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "600" }}>⏱️ Estimated Time</td>
                      <td
                        style={{
                          textAlign: "right",
                          color: "#4caf50",
                          fontWeight: "bold",
                        }}
                      >
                        ~8 minutes
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackDriver;
