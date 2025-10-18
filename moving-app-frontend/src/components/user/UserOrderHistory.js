import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const UserOrderHistory = () => {
  const dummyUser = { id: 1, name: "John Doe" };

  const dummyOrders = [
    {
      id: 1001,
      status: "pending",
      created_at: new Date(2025, 2, 18, 10, 30).toISOString(),
      pickup_location: "123 Main St, Downtown",
      dropoff_location: "456 Park Ave, Uptown",
      driver_id: "D-501",
      price: 25.5,
    },
    {
      id: 1002,
      status: "accepted",
      created_at: new Date(2025, 2, 17, 14, 15).toISOString(),
      pickup_location: "789 Broadway, Midtown",
      dropoff_location: "321 River Rd, Westside",
      driver_id: "D-342",
      price: 18.75,
    },
    {
      id: 1003,
      status: "completed",
      created_at: new Date(2025, 2, 15, 9, 45).toISOString(),
      pickup_location: "555 Ocean Dr, Seaside",
      dropoff_location: "777 Mountain View, Highlands",
      driver_id: "D-128",
      price: 32.0,
    },
    {
      id: 1004,
      status: "cancelled",
      created_at: new Date(2025, 2, 10, 16, 20).toISOString(),
      pickup_location: "999 College Blvd, University",
      dropoff_location: "888 Market St, Financial District",
      driver_id: "D-205",
      price: 15.25,
    },
  ];

  const [orders, setOrders] = useState(dummyOrders);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  const handleCancelOrder = (bookingId) => {
    try {
      setOrders(
        orders.map((order) =>
          order.id === bookingId ? { ...order, status: "cancelled" } : order
        )
      );
      toast.success("Order cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " at " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Get order statistics for dashboard
  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    accepted: orders.filter((o) => o.status === "accepted").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div className="dashboard-container">
      {/* Page Header with Icon */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 className="dashboard-title">📦 Your Order History</h1>
        <p style={{ color: "#aaa", fontSize: "16px", marginTop: "-15px" }}>
          Track and manage all your bookings in one place
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid" style={{ marginBottom: "30px" }}>
        <div className="stat-card">
          <h3>{orderStats.total}</h3>
          <p>Total Orders</p>
        </div>
        <div className="stat-card">
          <h3 style={{ color: "#ffa500" }}>{orderStats.pending}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h3 style={{ color: "#2196f3" }}>{orderStats.accepted}</h3>
          <p>Active</p>
        </div>
        <div className="stat-card">
          <h3 style={{ color: "#4caf50" }}>{orderStats.completed}</h3>
          <p>Completed</p>
        </div>
      </div>

      {/* Filter Tabs - Enhanced */}
      <div className="card" style={{ marginBottom: "25px", padding: "20px" }}>
        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {["all", "pending", "accepted", "completed", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                style={{
                  padding: "12px 24px",
                  borderRadius: "25px",
                  border:
                    filter === status
                      ? "2px solid #ff6600"
                      : "2px solid rgba(255, 255, 255, 0.1)",
                  background:
                    filter === status
                      ? "linear-gradient(145deg, #ff6600, #ff4500)"
                      : "rgba(255, 255, 255, 0.05)",
                  color: filter === status ? "#fff" : "#aaa",
                  fontWeight: filter === status ? "700" : "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  fontSize: "14px",
                  textTransform: "capitalize",
                  boxShadow:
                    filter === status
                      ? "0 4px 15px rgba(255, 102, 0, 0.4)"
                      : "none",
                }}
                onMouseOver={(e) => {
                  if (filter !== status) {
                    e.target.style.background = "rgba(255, 102, 0, 0.1)";
                    e.target.style.borderColor = "rgba(255, 102, 0, 0.3)";
                  }
                }}
                onMouseOut={(e) => {
                  if (filter !== status) {
                    e.target.style.background = "rgba(255, 255, 255, 0.05)";
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  }
                }}
              >
                {status === "all"
                  ? "🔍 All Orders"
                  : status === "pending"
                  ? "⏳ Pending"
                  : status === "accepted"
                  ? "🚗 Active"
                  : status === "completed"
                  ? "✅ Completed"
                  : "❌ Cancelled"}
                <span
                  style={{
                    marginLeft: "8px",
                    background: "rgba(0, 0, 0, 0.2)",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                >
                  {status === "all" ? orderStats.total : orderStats[status]}
                </span>
              </button>
            )
          )}
        </div>
      </div>

      {loading ? (
        <div className="card text-center">
          <div className="loading" style={{ padding: "50px" }}>
            <div className="spinner"></div>
            <p style={{ marginTop: "20px" }}>Loading order history...</p>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="card text-center" style={{ padding: "60px 40px" }}>
          <h2 style={{ fontSize: "48px", marginBottom: "20px" }}>📭</h2>
          <h3 style={{ marginBottom: "15px" }}>
            No {filter !== "all" ? filter : ""} orders found
          </h3>
          <p style={{ color: "#aaa", marginBottom: "30px", fontSize: "16px" }}>
            {filter === "all"
              ? "Start your journey by booking your first ride!"
              : `You don't have any ${filter} orders at the moment.`}
          </p>
          <Link to="/user/book-driver">
            <button style={{ fontSize: "16px", padding: "14px 32px" }}>
              📍 Book a Driver Now
            </button>
          </Link>
        </div>
      ) : (
        <div className="card">
          {/* Orders Count */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              padding: "15px 20px",
              background: "rgba(255, 102, 0, 0.1)",
              borderRadius: "10px",
              borderLeft: "4px solid #ff6600",
            }}
          >
            <h3 style={{ margin: 0 }}>
              {filter === "all"
                ? "All Bookings"
                : `${
                    filter.charAt(0).toUpperCase() + filter.slice(1)
                  } Bookings`}
            </h3>
            <span
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#ffcc00",
              }}
            >
              {filteredOrders.length}{" "}
              {filteredOrders.length === 1 ? "Order" : "Orders"}
            </span>
          </div>

          {/* Enhanced Table */}
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th style={{ minWidth: "100px" }}>🆔 Booking ID</th>
                  <th style={{ minWidth: "120px" }}>📊 Status</th>
                  <th style={{ minWidth: "180px" }}>📅 Date & Time</th>
                  <th style={{ minWidth: "200px" }}>📍 From</th>
                  <th style={{ minWidth: "200px" }}>🎯 To</th>
                  <th style={{ minWidth: "100px" }}>👤 Driver</th>
                  <th style={{ minWidth: "100px" }}>💰 Price</th>
                  <th style={{ minWidth: "120px", textAlign: "center" }}>
                    ⚡ Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr
                    key={order.id}
                    style={{
                      animationDelay: `${index * 0.05}s`,
                      animation: "fadeIn 0.5s ease-in-out",
                    }}
                  >
                    <td
                      style={{
                        fontWeight: "700",
                        color: "#ffcc00",
                        fontSize: "15px",
                      }}
                    >
                      #{order.id}
                    </td>
                    <td>
                      <span
                        className={`status ${
                          order.status === "completed"
                            ? "status-completed"
                            : order.status === "cancelled"
                            ? "status-cancelled"
                            : order.status === "accepted"
                            ? "status-confirmed"
                            : "status-pending"
                        }`}
                      >
                        {order.status === "accepted"
                          ? "🚗 Active"
                          : order.status === "completed"
                          ? "✅ Done"
                          : order.status === "cancelled"
                          ? "❌ Cancelled"
                          : "⏳ Pending"}
                      </span>
                    </td>
                    <td style={{ fontSize: "14px" }}>
                      {formatDate(order.created_at)}
                    </td>
                    <td style={{ fontSize: "14px" }}>
                      📍 {order.pickup_location}
                    </td>
                    <td style={{ fontSize: "14px" }}>
                      🎯 {order.dropoff_location}
                    </td>
                    <td style={{ fontWeight: "600", color: "#ff6600" }}>
                      {order.driver_id}
                    </td>
                    <td
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "#4caf50",
                      }}
                    >
                      ${order.price.toFixed(2)}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {order.status === "pending" && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          style={{
                            background:
                              "linear-gradient(145deg, #f44336, #c62828)",
                            padding: "8px 20px",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          ❌ Cancel
                        </button>
                      )}
                      {order.status === "accepted" && (
                        <Link to={`/user/track/${order.id}`}>
                          <button
                            style={{
                              background:
                                "linear-gradient(145deg, #2196f3, #1565c0)",
                              padding: "8px 20px",
                              fontSize: "13px",
                              fontWeight: "600",
                            }}
                          >
                            🗺️ Track
                          </button>
                        </Link>
                      )}
                      {order.status === "completed" && (
                        <button
                          style={{
                            background:
                              "linear-gradient(145deg, #ffa500, #ff8c00)",
                            padding: "8px 20px",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          ⭐ Review
                        </button>
                      )}
                      {order.status === "cancelled" && (
                        <span
                          style={{
                            color: "#666",
                            fontSize: "13px",
                            fontStyle: "italic",
                          }}
                        >
                          No actions
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Actions Footer */}
          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "15px",
            }}
          >
            <div>
              <p style={{ color: "#aaa", fontSize: "14px", margin: 0 }}>
                Need help with your orders?
              </p>
              <p
                style={{
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "600",
                  marginTop: "5px",
                }}
              >
                Contact Support:{" "}
                <span style={{ color: "#ff6600" }}>+254 700 123 456</span>
              </p>
            </div>
            <Link to="/user/book-driver">
              <button style={{ padding: "12px 28px", fontSize: "15px" }}>
                ➕ Book New Ride
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrderHistory;
