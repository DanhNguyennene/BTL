import React, { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  // Current books in the cart
  const { cart, resetCart } = useContext(GlobalContext);

  // User information
  const [userInfo, setUserInfo] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${user.username}`)
      .then((res) => res.json())
      .then((data) => setUserInfo(data));
  }, [user.username]);

  // Navigation
  const navigate = useNavigate();

  const processPayment = () => {
    // Payment information
    const information = {
      order_time: new Date().toISOString().slice(0, 19).replace("T", " "),
      order_status: "pending",
      username: user.username,
      books: cart,
    };

    // Submit order
    fetch("http://localhost:5000/api/books/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(information),
    })
      .then(() => {
        resetCart(); // Clear the cart
        navigate(`/${user.username}/customer-dashboard`); // Redirect to dashboard
      })
      .catch((err) => console.error("Error processing payment:", err));
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row pt-16 bg-gray-100">
      {/* Cart Section */}
      <div className="lg:w-2/3 p-6 bg-white shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart</h2>
        {cart.length > 0 ? (
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm"
              >
                <img
                  src={item.imageURL}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500">Author: {item.authorName}</p>
                  <p className="text-sm text-gray-500">
                    Publisher: {item.publisherName}
                  </p>
                  <p className="text-sm text-indigo-600 font-medium">
                    ${item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Your cart is empty.</p>
        )}
      </div>

      {/* Checkout Information Section */}
      <div className="lg:w-1/3 p-6 bg-white shadow-lg border-l border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Checkout Information
        </h2>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">Username:</span>{" "}
            {userInfo.username}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">Address:</span>{" "}
            {userInfo.address || "No address provided"}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">Bank Account:</span>{" "}
            {userInfo.bank_acc || "No account provided"}
          </p>
        </div>
        <button
          onClick={processPayment}
          className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
