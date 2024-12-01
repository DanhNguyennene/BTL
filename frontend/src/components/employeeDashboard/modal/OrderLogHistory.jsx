import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const OrderLogHistory = ({ orderId, isOpen, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      if (isOpen && orderId) {
        setLoading(true);
        setError(null);
        try {
          const [logsResponse, statusResponse] = await Promise.all([
            api.get(`/api/books/order-logs/order/${orderId}`),
            api.get(`/api/books/order-logs/status-history/${orderId}`),
          ]);
          
          if (logsResponse.data.success) setLogs(logsResponse.data.logs);
          if (statusResponse.data.success) setStatusHistory(statusResponse.data.status_history);
        } catch (err) {
          setError('Failed to fetch order history');
          ;
          console.error('Error fetching order history:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLogs();
  }, [orderId, isOpen]);

  if (!isOpen) return null;

  const getStatusColor = (status) => {
    const colors = {
      Completed: 'bg-green-100 text-green-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Processing: 'bg-blue-100 text-blue-800',
      Cancelled: 'bg-red-100 text-red-800',
      Failed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Order #{orderId} History</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-4">{error}</div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Status Timeline</h3>
              <div className="space-y-4">
                {statusHistory.map((status, index) => (
                  <div key={index} className="relative flex items-start">
                    {index !== statusHistory.length - 1 && (
                      <div className="absolute top-6 left-3 h-full w-0.5 bg-gray-200"></div>
                    )}
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 shrink-0 mr-4">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            status.new_status
                          )}`}
                        >
                          {status.new_status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(status.action_timestamp), 'PPp')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Changed by: {status.changed_by_name || 'System'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Detailed Actions</h3>
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.log_id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-block px-2 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded">
                          {log.action_type}
                        </span>
                        <p className="text-gray-600 mt-2">{log.action_note}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          By: {log.action_by_name || 'System'}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {format(new Date(log.action_timestamp), 'PPp')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderLogHistory;
