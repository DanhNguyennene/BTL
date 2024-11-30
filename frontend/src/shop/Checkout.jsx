import React, { useContext, useState, useEffect } from "react";
// import { GlobalContext } from "../contexts/GlobalContext";
import { useNavigate,useLocation  } from "react-router-dom";
import api from "../api/axios";
export default function Checkout() {
  // Current books in the cart
  // const { cart, resetCart } = useContext(GlobalContext);
  const [cart, setCart] = useState([]);
  // User information
  const [userInfo, setUserInfo] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const bookIdInput = queryParams.get("bookId");
  useEffect(() => {
    const fetchData = async () => {
      await getUserInfo();  // Wait for getUserInfo to complete first
      if (bookIdInput)
      await insertInCart(bookIdInput);  // Then get the cart after the user info is fetched
      await getCart();       // Then get the cart after the user info is fetched
    };
  
    fetchData();
  }, [bookIdInput]);

  // Navigation
  const navigate = useNavigate();

  const getUserInfo = async () => {
    const response = await fetch(`${api.defaults.baseURL}api/users/${user.username}`);
    const data = await response.json();
    setUserInfo(data);
    return data;
  };
  const getCart = async () => {
    const response = await fetch(`${api.defaults.baseURL}api/books/cart/${user.username}`);
    const data = await response.json();
    setCart(data);
    return data;
  };

  const adjustQuantity = async (bookId, quantityChange) => {
    const updatedCart = cart.map((item) => {
      if (item.book_id === bookId) {
        const updatedItem = { ...item, quantity: item.quantity + quantityChange };
        const updateData = {
          order_id: item.order_id,
          book_id: item.book_id,
          quantity: updatedItem.quantity,
        };

        api.put(`${api.defaults.baseURL}api/books/cart/${user.username}`, updateData);
        return updatedItem;
      }
      return item;
    });
    
    setCart(updatedCart);
  };

  const insertInCart = async (bookId) => {
    if (cart.length === 0) {
      const response = await api.post(`${api.defaults.baseURL}api/books/cart/${user.username}/create`, {
        order_time: new Date().toISOString().slice(0, 19).replace("T", " "),
        order_status: 'inCart',
        book_id: bookId
      });
      const data = await response.json();
      setCart([...cart, data]);
    }
    else {
      if (cart.find(item => item.book_id === bookId) === undefined) {
        const response = await api.post(`${api.defaults.baseURL}api/books/cart/${user.username}/insert`, {
          order_id: cart[0].order_id,
          book_id: bookId,
        });
        const data = await response.json();
        setCart([...cart, data]);
      }else{
        adjustQuantity(bookId, 1);
      }
    }
  };

  // Remove item from cart
  const removeItem = async (bookId) => {
    const toDelete = cart.find(item => item.book_id === bookId);
    const updatedCart = cart.filter(item =>item.book_id !== bookId);
    api.post(`${api.defaults.baseURL}api/books/cart/${user.username}/remove`, {
      order_id: toDelete.order_id,
      book_id: toDelete.book_id
    });
    setCart(updatedCart);
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
                className="flex items-center justify-between space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm"
              >
                <div className="flex items-center space-x-4">
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
  
                {/* Quantity Adjustments */}
                <div className="flex items-center space-x-2 flex-grow justify-left">
                  <button 
                    className="px-2 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                    onClick={() => adjustQuantity(item.book_id, -1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    className="px-2 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                    onClick={() => adjustQuantity(item.book_id, 1)}
                  >
                    +
                  </button>
                </div>
  
                {/* Remove Item */}
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeItem(item.book_id)}
                >
                  Remove
                </button>
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
          // onClick={processPayment}
          className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
  
}