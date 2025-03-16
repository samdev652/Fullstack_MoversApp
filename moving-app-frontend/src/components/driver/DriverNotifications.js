import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const DriverNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchNotifications();
  }, [user.id]);
  
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:5000/api/driver/notifications/${user.id}`);
      setNotifications(response.data.notifications);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
      setIsLoading(false);
    }
  };
  
  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.post(`http://localhost:5000/api/notifications/mark-read/${notificationId}`);
      
      // Update the notifications list to mark this one as read
      setNotifications(
        notifications.map((notification) => 
          notification.id === notificationId 
            ? { ...notification, is_read: true } 
            : notification
        )
      );
      
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to update notification');
    }
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      // Create a list of promises for each unread notification
      const markPromises = notifications
        .filter(notification => !notification.is_read)
        .map(notification => 
          axios.post(`http://localhost:5000/api/notifications/mark-read/${notification.id}`)
        );
      
      // Execute all promises in parallel
      await Promise.all(markPromises);
      
      // Update all notifications as read in the state
      setNotifications(
        notifications.map((notification) => ({ ...notification, is_read: true }))
      );
      
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to update notifications');
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  const unreadCount = notifications.filter(notification => !notification.is_read).length;
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Mark All as Read
            </button>
          )}
          
          <button
            onClick={fetchNotifications}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
          >
            Refresh
          </button>
        </div>
      </div>
      
      {unreadCount > 0 && (
        <p className="mb-4 text-blue-600 font-medium">
          You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}.
        </p>
      )}
      
      {notifications.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Notifications</h2>
          <p className="text-gray-500">
            You don't have any notifications at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`bg-white p-4              rounded-lg shadow-md flex justify-between items-center ${notification.is_read ? 'opacity-70' : 'bg-blue-50'}`}
            >
              <div>
                <h3 className="text-lg font-semibold">{notification.title}</h3>
                <p className="text-gray-600">{notification.message}</p>
                <p className="text-sm text-gray-400">{formatDate(notification.created_at)}</p>
              </div>
              
              {!notification.is_read && (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverNotifications;
