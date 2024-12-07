import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import api from '../api/axios';
import OrderLogHistory from './employeeDashboard/modal/OrderLogHistory';

const CustomerOrders = () => {
  const { userInfo, logout, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderToCancel, setSelectedOrderToCancel] = useState(null);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const openOrderLogs = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      return;
    }

    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${api.defaults.baseURL}api/books/orders/${userInfo.username}`);
        console.log(`${userInfo.username}`)
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, logout, userInfo.username]);
  const groupOrdersByOrderId = (orders) => {
    return orders.reduce((acc, order) => {
      const existingOrder = acc.find(group => group.orderId === order.order_id);

      if (existingOrder) {
        existingOrder.items.push(order);
        existingOrder.totalQuantity += order.quantity;
        existingOrder.totalPrice += order.price * order.quantity;
      } else {
        acc.push({
          orderId: order.order_id,
          items: [order],
          totalQuantity: order.quantity,
          totalPrice: order.price * order.quantity,
          orderStatus: order.order_status,
          orderTime: order.order_time
        });
      }

      return acc;
    }, []);
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500 mr-2" />;
      case 'completed':
        return <CheckCircle className="text-green-500 mr-2" />;
      case 'cancelled':
        return <XCircle className="text-red-500 mr-2" />;
      default:
        return null;
    }
  };
  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (!selectedOrderToCancel) return;

    try {

      // API call to cancel the order  /order/:username/:order_id/status
      await api.patch(`${api.defaults.baseURL}api/books//order/${userInfo.username}/${selectedOrderToCancel}/status`,
        { order_status: 'Cancelled' }
      );
      // Update local state to reflect cancelled order
      const updatedOrders = orders.map(order =>
        order.order_id === selectedOrderToCancel
          ? { ...order, order_status: 'Cancelled' }
          : order
      );

      setOrders(updatedOrders);
      setCancelModalOpen(false);
      setSelectedOrderToCancel(null);
    } catch (error) {
      console.error('Error cancelling order:', error);
      // Optionally show an error toast or message
    }
  };
  // Group orders by order_id
  const groupedOrders = groupOrdersByOrderId(orders);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-8">
          <div className="flex items-center">
            <BookOpen className="w-10 h-10 text-indigo-600 mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome, <span className="text-indigo-600">{userInfo.username}</span>
              </h1>
              <p className="text-gray-600 mt-2">Here's a summary of your book orders.</p>
            </div>
          </div>
        </div>

        {/* Orders Content */}
        <div>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ) : groupedOrders.length > 0 ? (
            <div className="space-y-6">
              {groupedOrders.map((orderGroup, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Order Summary Header */}
                  <div className="bg-gray-100 p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      {getStatusIcon(orderGroup.orderStatus)}
                      <span className={`text-sm font-medium capitalize ${orderGroup.orderStatus === "Pending"
                        ? "text-yellow-600"
                        : orderGroup.orderStatus === "Completed"
                          ? "text-green-600"
                          : "text-red-600"
                        }`}>
                        {orderGroup.orderStatus} Order
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        Order ID: {orderGroup.orderId} |
                        Ordered on: {new Date(orderGroup.orderTime).toLocaleDateString()}
                        <button
                          onClick={() => openOrderLogs(orderGroup.orderId)}
                          className="ml-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                        >
                          Open Order Logs
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          if (orderGroup.orderStatus === 'Pending') {
                            setSelectedOrderToCancel(orderGroup.orderId);
                            setCancelModalOpen(true);
                          }
                        }}
                        className={`transition-colors ${orderGroup.orderStatus === 'Pending'
                          ? 'text-red-500 hover:text-red-700'
                          : 'text-gray-300 cursor-not-allowed'
                          }`}
                        disabled={orderGroup.orderStatus !== 'Pending'}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {orderGroup.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-center border-b pb-4 last:border-b-0"
                        >
                          <img
                            src={item.imageURL}
                            alt={item.title}
                            className="w-24 h-36 object-cover rounded-lg shadow-md mr-6"
                          />
                          <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">
                              {item.title}
                            </h2>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Author:</span> {item.authorName}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Quantity:</span> {item.quantity}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Price:</span> ${item.price} each
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Total */}
                    <div className="mt-6 pt-4 border-t flex justify-between items-center">
                      <span className="text-lg font-bold">Total Quantity: {orderGroup.totalQuantity}</span>
                      <span className="text-xl font-bold text-indigo-600">
                        Total: ${orderGroup.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-xl p-8 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Orders Yet
              </h3>
              <p className="text-sm text-gray-500">
                Explore our collection and place your first order!
              </p>
            </div>
          )}
        </div>

        {/* Cancel Order Confirmation Modal */}
        {cancelModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Cancel Order</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setCancelModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  No, Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Yes, Cancel Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <OrderLogHistory
        orderId={selectedOrderId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
};

export default CustomerOrders;