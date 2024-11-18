import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const CustomerDashboard = () => {
  const { userInfo, logout, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
    }

    // Fetch orders
    fetch(`http://localhost:5000/api/books/order/${userInfo.username}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, [isAuthenticated, logout, userInfo.username]);

  return (
    <div className="min-h-screen pt-16 px-6 bg-gray-50">
      {/* Welcome Section */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, <span className="text-indigo-600">{userInfo.username}</span>
        </h1>
        <p className="text-gray-600 mt-2">Here’s a summary of your orders.</p>
      </div>

      {/* Orders Section */}
      <div className="max-w-4xl mx-auto mt-8">
        {orders.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((item, index) => (
              <div
                key={index}
                className="flex items-center bg-white shadow-sm rounded-lg p-4 hover:shadow-md transition"
              >
                <img
                  src={item.imageURL}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-500">Author: {item.authorName}</p>
                  <p className="text-sm text-gray-500">
                    Publisher: {item.publisherName}
                  </p>
                  <p className="text-sm text-indigo-600 font-medium">
                    ${item.price}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Ordered on:{" "}
                    <span className="text-gray-700">
                      {new Date(item.order_time).toLocaleDateString()}
                    </span>
                  </p>
                  <p
                    className={`text-sm font-medium mt-1 ${item.order_status === "pending"
                        ? "text-yellow-500"
                        : item.order_status === "completed"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                  >
                    Status: {item.order_status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold text-gray-700">
              You have no orders yet.
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Check back here after placing your first order!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
