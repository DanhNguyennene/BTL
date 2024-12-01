import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import { Bell, CheckCircle } from 'lucide-react';

const priorityColorMap = {
  Low: {
    unread: 'bg-green-50 border-green-200 text-green-800',
    read: 'bg-green-100/50 text-green-700 opacity-70'
  },
  Medium: {
    unread: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    read: 'bg-yellow-100/50 text-yellow-800 opacity-70'
  },
  High: {
    unread: 'bg-red-50 border-red-200 text-red-900',
    read: 'bg-red-100/50 text-red-800 opacity-70'
  },
  default: {
    unread: 'bg-blue-50 border-blue-200 text-blue-900',
    read: 'bg-gray-100/50 text-gray-700 opacity-70'
  }
};

const EmployeeNotifications = () => {
  const { userInfo } = useAuth();
  const [notifications, setNotifications] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [userInfo.username]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/books/notifications/employee`);
      if (response.data.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unread_count);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await api.patch(
        `/api/books/notifications/${notificationId}/read`,
        {
          username: userInfo.username,
          user_type: 'employee',
        }
      );
      if (response.status === 200) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const renderNotificationCard = (notification, isRead) => {
    const priority = notification.priority || 'default';
    const colorClasses = priorityColorMap[priority] || priorityColorMap.default;
    const cardClasses = isRead ? colorClasses.read : `${colorClasses.unread} border`;

    return (
      <div
        key={notification.notification_id}
        className={`p-4 rounded-lg shadow-sm ${cardClasses}`}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-4">
            <p className={`font-medium ${isRead ? '' : 'font-bold'}`}>
              {notification.message}
            </p>
            <div className="flex items-center text-sm mt-1">
              <span className="mr-2">
                {new Date(notification.create_at).toLocaleTimeString()}
              </span>
              {notification.priority && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  priority === 'High' ? 'bg-red-200 text-red-800' :
                  priority === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-green-200 text-green-800'
                }`}>
                  {priority} Priority
                </span>
              )}
            </div>
          </div>
          {!isRead && (
            <button
              onClick={() => markAsRead(notification.notification_id)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Mark read
            </button>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 animate-pulse">
        <Bell className="mx-auto w-12 h-12 text-gray-300 mb-4" />
        <p className="text-gray-500">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Notifications
        </h2>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          {unreadCount} unread
        </span>
      </div>

      {Object.keys(notifications).length > 0 ? (
        Object.entries(notifications).map(([date, { read, unread }]) => (
          <div key={date} className="mb-8">
            <h3 className="text-lg font-medium text-gray-600 mb-4 border-b pb-2">
              {date}
            </h3>

            <div className="space-y-4">
              {unread.length > 0 && (
                <div className="space-y-4">
                  {unread.map(notification => renderNotificationCard(notification, false))}
                </div>
              )}
              {read.length > 0 && (
                <div className="space-y-4">
                  {read.map(notification => renderNotificationCard(notification, true))}
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <Bell className="mx-auto w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">
            No notifications yet
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            You'll see notifications here when there are updates
          </p>
        </div>
      )}
    </div>
  );
}

export default EmployeeNotifications;