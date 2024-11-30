// customerDashboard/CustomerNotifications.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

const CustomerNotifications = () => {
  const { userInfo } = useAuth();
  const [notifications, setNotifications] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, [userInfo.username]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get(
        `/api/books/notifications/customer/${userInfo.username}`
      );
      if (response.data.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unread_count);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await api.patch(
        `/api/books/notifications/${notificationId}/read`,
        {
          username: userInfo.username,
          user_type: 'customer',
        }
      );
      if (response.status === 200) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">
          Notifications ({unreadCount} unread)
        </h2>
      </div>

      {Object.keys(notifications).length > 0 ? (
        Object.entries(notifications).map(([date, { read, unread }]) => (
          <div key={date} className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">{date}</h3>

            {unread.length > 0 && (
              <div className="space-y-4 mb-4">
                {unread.map((notification) => (
                  <div
                    key={notification.notification_id}
                    className="bg-blue-50 p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-blue-900">
                          {notification.message}
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          {new Date(notification.create_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <button
                        onClick={() => markAsRead(notification.notification_id)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Mark as read
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {read.length > 0 && (
              <div className="space-y-4 opacity-75">
                {read.map((notification) => (
                  <div
                    key={notification.notification_id}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <p className="text-gray-700">{notification.message}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(notification.create_at).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-gray-700">
            No notifications yet
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            You'll see notifications here when there are updates to your orders
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerNotifications;
