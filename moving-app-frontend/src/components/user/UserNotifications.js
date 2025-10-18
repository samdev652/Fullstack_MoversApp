import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const UserNotifications = () => {
  const dummyUser = {
    id: "usr_123456",
    name: "John Doe",
    email: "john.doe@example.com",
  };

  const initialNotifications = [
    {
      id: 1,
      message: "Your deposit of $100.00 was successful",
      created_at: "2025-03-19T14:30:22Z",
      is_read: false,
    },
    {
      id: 2,
      message: "Welcome to our platform! Complete your profile to get started.",
      created_at: "2025-03-18T09:15:43Z",
      is_read: false,
    },
    {
      id: 3,
      message:
        "New feature alert: You can now withdraw funds directly to your M-Pesa account.",
      created_at: "2025-03-15T17:45:10Z",
      is_read: true,
    },
    {
      id: 4,
      message: "Your account has been successfully created.",
      created_at: "2025-03-10T11:22:33Z",
      is_read: true,
    },
  ];

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(initialNotifications);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, is_read: true }
          : notification
      )
    );
    toast.success("Notification marked as read");
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, is_read: true }))
    );
    toast.success("All notifications marked as read");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;
  const readCount = notifications.filter(
    (notification) => notification.is_read
  ).length;

  // Get notification icon based on message content
  const getNotificationIcon = (message) => {
    if (message.includes("deposit") || message.includes("$")) return "💰";
    if (message.includes("Welcome") || message.includes("created")) return "🎉";
    if (message.includes("feature") || message.includes("M-Pesa")) return "🚀";
    if (message.includes("profile")) return "👤";
    return "🔔";
  };

  // Get notification type based on message
  const getNotificationType = (message) => {
    if (message.includes("deposit") || message.includes("$")) return "success";
    if (message.includes("Welcome") || message.includes("created"))
      return "info";
    if (message.includes("feature")) return "feature";
    if (message.includes("alert")) return "warning";
    return "general";
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div
        className="card"
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 102, 0, 0.1) 0%, rgba(255, 204, 0, 0.1) 100%)",
          borderLeft: "5px solid #ff6600",
          marginBottom: "30px",
        }}
      >
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
              className="dashboard-title"
              style={{ margin: 0, textAlign: "left" }}
            >
              🔔 Notification Center
            </h1>
            <p style={{ color: "#aaa", fontSize: "16px", marginTop: "10px" }}>
              Stay updated with your latest activity and announcements
            </p>
          </div>

          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            {unreadCount > 0 && (
              <>
                <div
                  style={{
                    padding: "12px 20px",
                    background: "rgba(255, 102, 0, 0.1)",
                    borderRadius: "25px",
                    border: "2px solid rgba(255, 102, 0, 0.3)",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "700",
                      color: "#ff6600",
                      fontSize: "16px",
                    }}
                  >
                    {unreadCount} Unread
                  </span>
                </div>
                <button
                  onClick={markAllAsRead}
                  style={{
                    padding: "12px 24px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  ✓ Mark All Read
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid" style={{ marginBottom: "30px" }}>
        <div className="stat-card">
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>📬</div>
          <h3 style={{ fontSize: "42px" }}>{notifications.length}</h3>
          <p>Total Notifications</p>
        </div>

        <div className="stat-card">
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>🆕</div>
          <h3 style={{ fontSize: "42px", color: "#ff6600" }}>{unreadCount}</h3>
          <p>Unread Messages</p>
        </div>

        <div className="stat-card">
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>✅</div>
          <h3 style={{ fontSize: "42px", color: "#4caf50" }}>{readCount}</h3>
          <p>Read Messages</p>
        </div>

        <div className="stat-card">
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>📊</div>
          <h3 style={{ fontSize: "42px", color: "#2196f3" }}>
            {readCount > 0
              ? ((readCount / notifications.length) * 100).toFixed(0)
              : 0}
            %
          </h3>
          <p>Read Rate</p>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
            padding: "15px 20px",
            background: "rgba(255, 102, 0, 0.1)",
            borderRadius: "10px",
            borderLeft: "4px solid #ff6600",
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
            📋 All Notifications
          </h2>
          <span
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#ffcc00",
            }}
          >
            {notifications.length}{" "}
            {notifications.length === 1 ? "Message" : "Messages"}
          </span>
        </div>

        {loading ? (
          <div
            className="loading"
            style={{ padding: "60px", textAlign: "center" }}
          >
            <div className="spinner"></div>
            <p style={{ marginTop: "20px" }}>Loading your notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 40px",
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: "15px",
            }}
          >
            <div style={{ fontSize: "80px", marginBottom: "20px" }}>🔔</div>
            <h3 style={{ marginBottom: "15px", fontSize: "24px" }}>
              All Caught Up!
            </h3>
            <p style={{ color: "#aaa", fontSize: "16px" }}>
              You don't have any notifications at the moment.
            </p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th style={{ minWidth: "60px", textAlign: "center" }}>
                      Type
                    </th>
                    <th style={{ minWidth: "80px" }}>ID</th>
                    <th style={{ minWidth: "60px", textAlign: "center" }}>
                      Status
                    </th>
                    <th style={{ minWidth: "400px" }}>Message</th>
                    <th style={{ minWidth: "180px" }}>Date & Time</th>
                    <th style={{ minWidth: "150px", textAlign: "center" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification, index) => {
                    const icon = getNotificationIcon(notification.message);
                    const type = getNotificationType(notification.message);

                    return (
                      <tr
                        key={notification.id}
                        style={{
                          animationDelay: `${index * 0.1}s`,
                          background: !notification.is_read
                            ? "rgba(255, 102, 0, 0.05)"
                            : "transparent",
                          borderLeft: !notification.is_read
                            ? "4px solid #ff6600"
                            : "4px solid transparent",
                        }}
                      >
                        <td style={{ textAlign: "center", fontSize: "32px" }}>
                          {icon}
                        </td>

                        <td
                          style={{
                            fontWeight: "700",
                            color: "#ffcc00",
                            fontSize: "15px",
                          }}
                        >
                          #{notification.id}
                        </td>

                        <td style={{ textAlign: "center" }}>
                          {!notification.is_read ? (
                            <span
                              style={{
                                display: "inline-block",
                                width: "12px",
                                height: "12px",
                                background: "#ff6600",
                                borderRadius: "50%",
                                boxShadow: "0 0 10px rgba(255, 102, 0, 0.5)",
                                animation: "pulse 2s infinite",
                              }}
                            ></span>
                          ) : (
                            <span
                              style={{ color: "#4caf50", fontSize: "18px" }}
                            >
                              ✓
                            </span>
                          )}
                        </td>

                        <td style={{ fontSize: "15px", lineHeight: "1.6" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "10px",
                            }}
                          >
                            <span
                              style={{
                                flex: 1,
                                fontWeight: !notification.is_read
                                  ? "600"
                                  : "400",
                              }}
                            >
                              {notification.message}
                            </span>
                            {!notification.is_read && (
                              <span
                                style={{
                                  padding: "4px 10px",
                                  background:
                                    "linear-gradient(145deg, #ff6600, #ff4500)",
                                  borderRadius: "12px",
                                  fontSize: "11px",
                                  fontWeight: "700",
                                  textTransform: "uppercase",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                New
                              </span>
                            )}
                          </div>

                          {/* Type Badge */}
                          <div style={{ marginTop: "8px" }}>
                            <span
                              className={`status ${
                                type === "success"
                                  ? "status-completed"
                                  : type === "info"
                                  ? "status-confirmed"
                                  : type === "feature"
                                  ? "status-in-progress"
                                  : "status-pending"
                              }`}
                              style={{ fontSize: "11px", padding: "4px 12px" }}
                            >
                              {type === "success"
                                ? "💰 Payment"
                                : type === "info"
                                ? "ℹ️ Info"
                                : type === "feature"
                                ? "🚀 Feature"
                                : type === "warning"
                                ? "⚠️ Alert"
                                : "📢 General"}
                            </span>
                          </div>
                        </td>

                        <td style={{ fontSize: "14px" }}>
                          <div style={{ color: "#aaa" }}>
                            📅{" "}
                            {new Date(
                              notification.created_at
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <div
                            style={{
                              color: "#888",
                              fontSize: "13px",
                              marginTop: "4px",
                            }}
                          >
                            🕐{" "}
                            {new Date(
                              notification.created_at
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>

                        <td style={{ textAlign: "center" }}>
                          {!notification.is_read ? (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              style={{
                                background:
                                  "linear-gradient(145deg, #4caf50, #2e7d32)",
                                padding: "8px 20px",
                                fontSize: "13px",
                                fontWeight: "600",
                              }}
                            >
                              ✓ Mark Read
                            </button>
                          ) : (
                            <span
                              style={{
                                color: "#4caf50",
                                fontSize: "13px",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "5px",
                              }}
                            >
                              <span style={{ fontSize: "16px" }}>✓</span> Read
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Notification Summary Footer */}
            <div
              style={{
                marginTop: "30px",
                padding: "25px",
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: "15px",
                borderTop: "2px solid rgba(255, 102, 0, 0.3)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "25px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "32px", marginBottom: "10px" }}>
                    📨
                  </div>
                  <p
                    style={{
                      color: "#aaa",
                      fontSize: "14px",
                      marginBottom: "8px",
                    }}
                  >
                    Latest Notification
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#ffcc00",
                    }}
                  >
                    {notifications.length > 0
                      ? new Date(
                          notifications[0].created_at
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "32px", marginBottom: "10px" }}>
                    ⏰
                  </div>
                  <p
                    style={{
                      color: "#aaa",
                      fontSize: "14px",
                      marginBottom: "8px",
                    }}
                  >
                    Oldest Unread
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#ff6600",
                    }}
                  >
                    {unreadCount > 0
                      ? new Date(
                          notifications.find((n) => !n.is_read).created_at
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "None"}
                  </p>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "32px", marginBottom: "10px" }}>
                    🎯
                  </div>
                  <p
                    style={{
                      color: "#aaa",
                      fontSize: "14px",
                      marginBottom: "8px",
                    }}
                  >
                    Response Rate
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#4caf50",
                    }}
                  >
                    {notifications.length > 0
                      ? ((readCount / notifications.length) * 100).toFixed(0)
                      : 0}
                    %
                  </p>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "32px", marginBottom: "10px" }}>
                    📈
                  </div>
                  <p
                    style={{
                      color: "#aaa",
                      fontSize: "14px",
                      marginBottom: "8px",
                    }}
                  >
                    This Week
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#2196f3",
                    }}
                  >
                    {
                      notifications.filter((n) => {
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return new Date(n.created_at) > weekAgo;
                      }).length
                    }{" "}
                    New
                  </p>
                </div>
              </div>

              {/* Quick Tip */}
              <div
                style={{
                  marginTop: "25px",
                  padding: "15px 20px",
                  background: "rgba(33, 150, 243, 0.1)",
                  borderLeft: "4px solid #2196f3",
                  borderRadius: "8px",
                }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    color: "#2196f3",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span style={{ fontSize: "20px" }}>💡</span>
                  <span>
                    <strong>Tip:</strong> Keep your inbox organized by regularly
                    marking notifications as read. Unread notifications appear
                    with an orange indicator for easy tracking.
                  </span>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserNotifications;
