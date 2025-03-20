import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const UserNotifications = () => {
  // Dummy user data
  const dummyUser = {
    id: "usr_123456",
    name: "John Doe",
    email: "john.doe@example.com"
  };
  
  // Initial dummy notifications
  const initialNotifications = [
    {
      id: 1,
      message: "Your deposit of $100.00 was successful",
      created_at: "2025-03-19T14:30:22Z",
      is_read: false
    },
    {
      id: 2,
      message: "Welcome to our platform! Complete your profile to get started.",
      created_at: "2025-03-18T09:15:43Z",
      is_read: false
    },
    {
      id: 3,
      message: "New feature alert: You can now withdraw funds directly to your M-Pesa account.",
      created_at: "2025-03-15T17:45:10Z",
      is_read: true
    },
    {
      id: 4,
      message: "Your account has been successfully created.",
      created_at: "2025-03-10T11:22:33Z",
      is_read: true
    }
  ];

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      setNotifications(initialNotifications);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const markAsRead = (notificationId) => {
    // Update the notifications list locally
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, is_read: true } 
        : notification
    ));
    
    toast.success('Notification marked as read');
  };

  const markAllAsRead = () => {
    // Update all notifications as read
    setNotifications(notifications.map(notification => (
      { ...notification, is_read: true }
    )));
    
    toast.success('All notifications marked as read');
  };

  // Format the date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Get the count of unread notifications
  const unreadCount = notifications.filter(notification => !notification.is_read).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="bg-blue-600 text-white py-1 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Mark All as Read
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="text-center py-8">
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li 
                key={notification.id} 
                className={`p-4 hover:bg-gray-50 transition-colors ${!notification.is_read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex justify-between">
                  <div className="flex-1">
                    <p className="text-gray-800">{notification.message}</p>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(notification.created_at)}</p>
                  </div>
                  
                  {!notification.is_read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="ml-4 text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserNotifications;