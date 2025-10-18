import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";

const UserDashboard = () => {
  // Dummy user data
  const currentUser = {
    id: "user456",
    email: "currentuser@gmail.com",
    name: "John Doe",
    memberSince: "January 2025",
  };

  // State variables
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalSpent: 0,
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Styles
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f8f9fa",
      padding: "30px 20px",
      fontFamily: "Arial, sans-serif",
    },
    welcomeTitle: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#2c3e50",
      marginBottom: "30px",
      textAlign: "center",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      padding: "25px",
      width: "100%",
      maxWidth: "800px",
      marginBottom: "30px",
    },
    cardTitle: {
      fontSize: "22px",
      fontWeight: "bold",
      color: "#2c3e50",
      marginBottom: "20px",
      textAlign: "center",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
    },
    statBox: {
      padding: "20px",
      borderRadius: "8px",
      textAlign: "center",
    },
    activeBox: {
      backgroundColor: "#e3f2fd",
    },
    completedBox: {
      backgroundColor: "#e8f5e9",
    },
    cancelledBox: {
      backgroundColor: "#ffebee",
    },
    statLabel: {
      fontSize: "16px",
      fontWeight: "500",
      marginBottom: "10px",
      color: "#34495e",
    },
    activeValue: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#1976d2",
    },
    completedValue: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#388e3c",
    },
    cancelledValue: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#d32f2f",
    },
    headerContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "20px",
    },
    viewAllLink: {
      color: "#1976d2",
      textDecoration: "none",
      fontSize: "14px",
      marginTop: "5px",
    },
    bookingsList: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    bookingItem: {
      borderBottom: "1px solid #e0e0e0",
      paddingBottom: "20px",
    },
    bookingHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
      flexWrap: "wrap",
    },
    bookingId: {
      fontWeight: "bold",
      color: "#2c3e50",
      fontSize: "16px",
    },
    bookingDate: {
      color: "#7f8c8d",
      fontSize: "14px",
    },
    locationInfo: {
      margin: "10px 0",
      lineHeight: "1.5",
    },
    locationLabel: {
      fontWeight: "bold",
      color: "#34495e",
    },
    statusBadge: {
      display: "inline-block",
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "bold",
      marginTop: "10px",
    },
    badgeCompleted: {
      backgroundColor: "#e8f5e9",
      color: "#388e3c",
    },
    badgeCancelled: {
      backgroundColor: "#ffebee",
      color: "#d32f2f",
    },
    badgeAccepted: {
      backgroundColor: "#e3f2fd",
      color: "#1976d2",
    },
    badgePending: {
      backgroundColor: "#fff8e1",
      color: "#ffa000",
    },
    trackLink: {
      color: "#1976d2",
      textDecoration: "none",
      marginTop: "10px",
      display: "inline-block",
      fontWeight: "500",
    },
    emptyMessage: {
      color: "#7f8c8d",
      fontSize: "16px",
      textAlign: "center",
      padding: "20px",
    },
    supportButton: {
      backgroundColor: "#7e57c2",
      color: "white",
      padding: "12px 24px",
      borderRadius: "8px",
      border: "none",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    loadingText: {
      color: "#7f8c8d",
      fontSize: "16px",
      textAlign: "center",
      padding: "20px",
    },
  };

  // Dummy bookings data
  const dummyBookings = [
    {
      booking_id: "BK-10045",
      created_at: "2025-03-20T14:30:00",
      pickup_location: "123 Main Street",
      dropoff_location: "456 Park Avenue",
      status: "completed",
      driver_name: "Alex Johnson",
      fare: 24.5,
    },
    {
      booking_id: "BK-10052",
      created_at: "2025-03-22T09:15:00",
      pickup_location: "Grand Central Station",
      dropoff_location: "JFK Airport Terminal 4",
      status: "accepted",
      driver_name: "Emma Williams",
      fare: 67.75,
    },
    {
      booking_id: "BK-10060",
      created_at: "2025-03-23T11:45:00",
      pickup_location: "Brooklyn Heights",
      dropoff_location: "Manhattan Financial District",
      status: "pending",
      fare: 32.25,
    },
  ];

  // Simulate API call
  useEffect(() => {
    const timer = setTimeout(() => {
      setRecentBookings(dummyBookings);
      setStats({
        activeBookings: 2,
        completedBookings: 15,
        cancelledBookings: 3,
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle support navigation - MODIFIED TO OPEN GMAIL
  const navigateToSupport = () => {
    const subject = "Support Request";
    const body = `Hello Support Team,\n\nI need assistance with:\n\n[Please describe your issue here]\n\nUser Email: ${currentUser.email}`;
    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=support@movers.com&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, "_blank");
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Redirect if not logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="dashboard-container">
      {/* Hero Section with Time and Greeting */}
      <div
        className="card"
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 102, 0, 0.1) 0%, rgba(255, 204, 0, 0.1) 100%)",
          borderLeft: "5px solid #ff6600",
          marginBottom: "30px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "200px",
            height: "200px",
            background:
              "radial-gradient(circle, rgba(255, 102, 0, 0.2) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        ></div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "36px",
                  fontWeight: "800",
                  background: "linear-gradient(135deg, #ffcc00, #ff8800)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "10px",
                }}
              >
                {getGreeting()}, {currentUser.name || "User"}! 👋
              </h1>
              <p style={{ color: "#aaa", fontSize: "16px" }}>
                Welcome back to your dashboard. Here's what's happening with
                your rides.
              </p>
              <p
                style={{
                  color: "#ff6600",
                  fontSize: "14px",
                  marginTop: "10px",
                }}
              >
                📅 Member since: {currentUser.memberSince}
              </p>
            </div>

            <div
              style={{
                textAlign: "center",
                padding: "20px",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "15px",
                minWidth: "180px",
              }}
            >
              <p
                style={{
                  fontSize: "48px",
                  fontWeight: "700",
                  color: "#ffcc00",
                  marginBottom: "5px",
                }}
              >
                {currentTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p style={{ fontSize: "14px", color: "#aaa" }}>
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: "30px" }}>
        <h2
          style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          ⚡ Quick Actions
        </h2>
        <div className="grid">
          <Link to="/user/book-driver" style={{ textDecoration: "none" }}>
            <div
              style={{
                padding: "30px",
                background: "linear-gradient(135deg, #ff6600, #ff4500)",
                borderRadius: "15px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 8px 25px rgba(255, 102, 0, 0.3)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 35px rgba(255, 102, 0, 0.5)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(255, 102, 0, 0.3)";
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "15px" }}>🚗</div>
              <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
                Book a Ride
              </h3>
              <p style={{ fontSize: "14px", opacity: 0.9 }}>
                Find a driver now
              </p>
            </div>
          </Link>

          <Link to="/user/orders" style={{ textDecoration: "none" }}>
            <div
              style={{
                padding: "30px",
                background: "linear-gradient(135deg, #2196f3, #1565c0)",
                borderRadius: "15px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 8px 25px rgba(33, 150, 243, 0.3)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 35px rgba(33, 150, 243, 0.5)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(33, 150, 243, 0.3)";
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "15px" }}>📦</div>
              <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
                My Orders
              </h3>
              <p style={{ fontSize: "14px", opacity: 0.9 }}>
                View order history
              </p>
            </div>
          </Link>

          <Link to="/user/wallet" style={{ textDecoration: "none" }}>
            <div
              style={{
                padding: "30px",
                background: "linear-gradient(135deg, #4caf50, #2e7d32)",
                borderRadius: "15px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 8px 25px rgba(76, 175, 80, 0.3)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 35px rgba(76, 175, 80, 0.5)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(76, 175, 80, 0.3)";
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "15px" }}>💰</div>
              <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>Wallet</h3>
              <p style={{ fontSize: "14px", opacity: 0.9 }}>Manage payments</p>
            </div>
          </Link>

          <div
            style={{
              padding: "30px",
              background: "linear-gradient(135deg, #9c27b0, #6a1b9a)",
              borderRadius: "15px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 25px rgba(156, 39, 176, 0.3)",
            }}
            onClick={navigateToSupport}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 12px 35px rgba(156, 39, 176, 0.5)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 25px rgba(156, 39, 176, 0.3)";
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>💬</div>
            <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>Support</h3>
            <p style={{ fontSize: "14px", opacity: 0.9 }}>Get help</p>
          </div>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="card" style={{ marginBottom: "30px" }}>
        <h2
          style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          📊 Your Statistics
        </h2>
        <div className="grid">
          <div className="stat-card">
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>🚗</div>
            <h3 style={{ fontSize: "42px", color: "#2196f3" }}>
              {stats.activeBookings}
            </h3>
            <p style={{ fontSize: "16px" }}>Active Bookings</p>
            <div
              style={{
                marginTop: "15px",
                padding: "8px",
                background: "rgba(33, 150, 243, 0.1)",
                borderRadius: "8px",
                fontSize: "13px",
                color: "#2196f3",
              }}
            >
              Currently in progress
            </div>
          </div>

          <div className="stat-card">
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>✅</div>
            <h3 style={{ fontSize: "42px", color: "#4caf50" }}>
              {stats.completedBookings}
            </h3>
            <p style={{ fontSize: "16px" }}>Completed Trips</p>
            <div
              style={{
                marginTop: "15px",
                padding: "8px",
                background: "rgba(76, 175, 80, 0.1)",
                borderRadius: "8px",
                fontSize: "13px",
                color: "#4caf50",
              }}
            >
              Successfully finished
            </div>
          </div>

          <div className="stat-card">
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>❌</div>
            <h3 style={{ fontSize: "42px", color: "#f44336" }}>
              {stats.cancelledBookings}
            </h3>
            <p style={{ fontSize: "16px" }}>Cancelled</p>
            <div
              style={{
                marginTop: "15px",
                padding: "8px",
                background: "rgba(244, 67, 54, 0.1)",
                borderRadius: "8px",
                fontSize: "13px",
                color: "#f44336",
              }}
            >
              Not completed
            </div>
          </div>

          <div className="stat-card">
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>💵</div>
            <h3 style={{ fontSize: "42px", color: "#ffcc00" }}>
              $
              {recentBookings
                .reduce((sum, b) => sum + (b.fare || 0), 0)
                .toFixed(2)}
            </h3>
            <p style={{ fontSize: "16px" }}>Total Spent</p>
            <div
              style={{
                marginTop: "15px",
                padding: "8px",
                background: "rgba(255, 204, 0, 0.1)",
                borderRadius: "8px",
                fontSize: "13px",
                color: "#ffcc00",
              }}
            >
              Recent bookings
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <h2
            style={{
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            🕒 Recent Bookings
          </h2>
          <Link to="/user/orders">
            <button style={{ padding: "10px 24px", fontSize: "14px" }}>
              View All Orders →
            </button>
          </Link>
        </div>

        {loading ? (
          <div
            className="loading"
            style={{ padding: "60px", textAlign: "center" }}
          >
            <div className="spinner"></div>
            <p style={{ marginTop: "20px" }}>Loading your recent bookings...</p>
          </div>
        ) : recentBookings.length > 0 ? (
          <div>
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Date</th>
                  <th>Route</th>
                  <th>Driver</th>
                  <th>Status</th>
                  <th>Fare</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking, index) => (
                  <tr
                    key={booking.booking_id}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td style={{ fontWeight: "700", color: "#ffcc00" }}>
                      #{booking.booking_id}
                    </td>
                    <td style={{ fontSize: "14px" }}>
                      {new Date(booking.created_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td style={{ fontSize: "14px" }}>
                      <div style={{ marginBottom: "5px" }}>
                        <strong style={{ color: "#ff6600" }}>📍</strong>{" "}
                        {booking.pickup_location}
                      </div>
                      <div>
                        <strong style={{ color: "#4caf50" }}>🎯</strong>{" "}
                        {booking.dropoff_location}
                      </div>
                    </td>
                    <td style={{ fontWeight: "600" }}>
                      {booking.driver_name || "Pending"}
                    </td>
                    <td>
                      <span
                        className={`status ${
                          booking.status === "completed"
                            ? "status-completed"
                            : booking.status === "accepted"
                            ? "status-confirmed"
                            : booking.status === "cancelled"
                            ? "status-cancelled"
                            : "status-pending"
                        }`}
                      >
                        {booking.status === "accepted"
                          ? "🚗 Active"
                          : booking.status === "completed"
                          ? "✅ Done"
                          : booking.status === "cancelled"
                          ? "❌ Cancelled"
                          : "⏳ Pending"}
                      </span>
                    </td>
                    <td
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "#4caf50",
                      }}
                    >
                      ${booking.fare?.toFixed(2)}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {booking.status === "accepted" ? (
                        <Link to={`/user/track/${booking.booking_id}`}>
                          <button
                            style={{
                              background:
                                "linear-gradient(145deg, #2196f3, #1565c0)",
                              padding: "8px 20px",
                              fontSize: "13px",
                            }}
                          >
                            🗺️ Track
                          </button>
                        </Link>
                      ) : booking.status === "completed" ? (
                        <button
                          style={{
                            background:
                              "linear-gradient(145deg, #ffa500, #ff8c00)",
                            padding: "8px 20px",
                            fontSize: "13px",
                          }}
                        >
                          ⭐ Review
                        </button>
                      ) : (
                        <span style={{ color: "#666", fontSize: "13px" }}>
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary Footer */}
            <div
              style={{
                marginTop: "25px",
                padding: "20px",
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: "10px",
                borderTop: "2px solid rgba(255, 102, 0, 0.3)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "20px",
                  textAlign: "center",
                }}
              >
                <div>
                  <p
                    style={{
                      color: "#aaa",
                      fontSize: "14px",
                      marginBottom: "5px",
                    }}
                  >
                    Total Bookings
                  </p>
                  <p
                    style={{
                      fontSize: "24px",
                      fontWeight: "700",
                      color: "#ffcc00",
                    }}
                  >
                    {recentBookings.length}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      color: "#aaa",
                      fontSize: "14px",
                      marginBottom: "5px",
                    }}
                  >
                    Average Fare
                  </p>
                  <p
                    style={{
                      fontSize: "24px",
                      fontWeight: "700",
                      color: "#4caf50",
                    }}
                  >
                    $
                    {(
                      recentBookings.reduce(
                        (sum, b) => sum + (b.fare || 0),
                        0
                      ) / recentBookings.length
                    ).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      color: "#aaa",
                      fontSize: "14px",
                      marginBottom: "5px",
                    }}
                  >
                    Success Rate
                  </p>
                  <p
                    style={{
                      fontSize: "24px",
                      fontWeight: "700",
                      color: "#2196f3",
                    }}
                  >
                    {(
                      (recentBookings.filter((b) => b.status === "completed")
                        .length /
                        recentBookings.length) *
                      100
                    ).toFixed(0)}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "60px 40px",
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: "15px",
            }}
          >
            <div style={{ fontSize: "80px", marginBottom: "20px" }}>🚗</div>
            <h3 style={{ marginBottom: "15px", fontSize: "24px" }}>
              No Bookings Yet
            </h3>
            <p
              style={{ color: "#aaa", marginBottom: "30px", fontSize: "16px" }}
            >
              Start your journey by booking your first ride!
            </p>
            <Link to="/user/book-driver">
              <button style={{ fontSize: "16px", padding: "14px 32px" }}>
                📍 Book Your First Ride
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
