import React, { useContext, useState, useEffect,useCallback  } from "react";
// import { GlobalContext } from "../contexts/GlobalContext";
import { useNavigate,useLocation  } from "react-router-dom";
import api from "../api/axios";
import PaymentModal from "../components/Payout";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const [bookIdInput, setBookIdInput] = useState(queryParams.get('bookId'));     
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const fetchUserInfo = useCallback(async () => {
    try {
      const response = await fetch(`${api.defaults.baseURL}api/users/${user.username}`);
      if (!response.ok) throw new Error('Failed to fetch user info');
      const data = await response.json();
      setUserInfo(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching user info:", err);
    }
  }, [user.username]);

  const fetchCart = useCallback(async () => {
    try {
      const response = await api.get(`${api.defaults.baseURL}api/books/cart/${user.username}`);
      setCart(response.data);
      console.log()
      return response.data;
    } catch (err) {
      setError(err.message);
      console.error("Error fetching cart:", err);
      return [];
    }
  }, [user.username]);

  const insertInCart = async (bookId, existingCart) => {
    try {
      // Convert bookId to number
      bookId = parseInt(bookId);
      
      // Fetch the latest cart to ensure we're working with current data
      existingCart = await fetchCart();
      
      // Check if the book is already in the cart
      const isBookInCart = existingCart.some(item => item.book_id === bookId);
      
      if (!isBookInCart) {
        // If cart is empty, create a new cart
        if (existingCart.length === 0) {
          const book_data = (await api.get(`${api.defaults.baseURL}api/books/${bookId}`)).data;
          await api.post(`${api.defaults.baseURL}api/books/cart/${user.username}/create`, {
            order_time: new Date().toISOString().slice(0, 19).replace("T", " "),
            order_status: 'inCart',
            books: [book_data]
          });
        } else {
          // If cart exists, insert the book
          await api.post(`${api.defaults.baseURL}api/books/cart/${user.username}/insert`, {
            order_id: existingCart[0].order_id,
            book_id: bookId,
          });
        }
        
        // Refresh cart after insertion
        await fetchCart();
      }
      
      // Clear the bookIdInput after processing
      setBookIdInput(null);
    } catch (err) {
      setError(err.message);
      console.error("Error inserting cart item:", err);
    }
  };

  const removeItem = async (bookId) => {
    try {
      bookId = parseInt(bookId);
      const toDelete = cart.find(item => item.book_id === bookId);
      
      if (toDelete) {
        // Remove the item from the backend
        await api.post(`${api.defaults.baseURL}api/books/cart/${user.username}/remove`, {
          order_id: toDelete.order_id,
          book_id: toDelete.book_id
        });
        // Refresh the cart to ensure persistent removal
        const updatedCart = cart.filter(item => item !== toDelete);

        if (updatedCart.length===0){
          await api.post(`${api.defaults.baseURL}api/books/cart/${user.username}/removeCart`, {
            order_id: toDelete.order_id
          });
        }
        await fetchCart();
        // Clear bookIdInput if the removed book matches
        if (parseInt(bookId) === parseInt(bookIdInput)) {
          setBookIdInput(null);
        }
      }
    } catch (err) {
      setError(err.message);
      console.error("Error removing cart item:", err);
    }
  };

  const adjustQuantity = async (bookId, quantityChange) => {
    try {
      const updatedCart = cart.map((item) => {
        if (item.book_id === bookId) {
          const newQuantity = item.quantity + quantityChange;
          
          // Only update if quantity is positive
          if (newQuantity > 0) {
            const updateData = {
              order_id: item.order_id,
              book_id: item.book_id,
              quantity: newQuantity,
            };

            // Update backend
            api.put(`${api.defaults.baseURL}api/books/cart/${user.username}`, updateData);
            
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      });

      // Update local state
      setCart(updatedCart);
    } catch (err) {
      setError(err.message);
      console.error("Error adjusting quantity:", err);
    }
  };
  const handlePaymentSuccess = async () => {
    try {
      console.log('Payment successful');
      const order_id = cart[0].order_id;  
      await api.patch(`${api.defaults.baseURL}api/books/order/${userInfo.username}/${order_id}/status`,
        { order_status: 'Pending' }
      );
      await api.patch(`${api.defaults.baseURL}api/books/cart/${userInfo.username}/clearCart`,
        { order_id: order_id }
      );
      navigate(`/${userInfo.username}/customer-dashboard`);
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };
  useEffect(() => {
    const initializeData = async () => {
      await fetchUserInfo();
      await fetchCart();
    };
    initializeData();
  }, [fetchUserInfo, fetchCart]);

  useEffect(() => {
    if (bookIdInput) {
      insertInCart(bookIdInput, cart);
    }
  }, [bookIdInput]); 


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
          onClick={() => setIsPaymentModalOpen(true)}
          className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          disabled={cart.length === 0}
        >
          Pay Now
        </button>
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        total={cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
        userInfo={userInfo}
        cart={cart}
        onPaymentSuccess={
          handlePaymentSuccess
        }
      />
      </div>
    </div>
  );
  
}