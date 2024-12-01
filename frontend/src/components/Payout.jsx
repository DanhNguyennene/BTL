import React, { useState, useCallback,useEffect } from 'react';
import api from "../api/axios";

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  total, 
  userInfo, 
  cart, 
  onPaymentSuccess 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [payPalEmail, setPayPalEmail] = useState('');
  const [bankAccount, setBankAccount] = useState(userInfo.bank_acc);
  const [address, setAddress] = useState(userInfo.address);
  const [phone_number, setPhoneNumber] = useState(userInfo.phone_number);
  useEffect(() => {
    setBankAccount(userInfo.bank_acc);
    setAddress(userInfo.address);
    setPhoneNumber(userInfo.phone_number);
    console.log("userInfo",userInfo);

  }, [userInfo.bank_acc, userInfo.address, userInfo.phone_number]);
  
  const validatePaymentDetails = () => {
    // Basic validation
    if (paymentMethod === 'credit' || paymentMethod === 'debit') {  
    if (!cardNumber || cardNumber.length < 16) {
      setError('Invalid card number');
      return false;
    }
    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      setError('Invalid expiry date (MM/YY)');
      return false;
    }
    if (!cvv || cvv.length < 3) {
      setError('Invalid CVV');
      return false;
    }
  }else if (paymentMethod === 'paypal') {
    if (!payPalEmail || !/^\S+@\S+\.\S+$/.test(payPalEmail)) {
      setError('Invalid PayPal email');
      return false;
    }
  }else if (paymentMethod === 'bank') {
    if (!bankAccount || bankAccount.length < 10) {
      setError('Invalid bank account number');
      return false;
    }
  }
  if (!address) {
    setError('Invalid address');
    return false;
  }
  if (!phone_number || phone_number.length < 10) {
    setError('Invalid phone number');
    return false;
  }
    return true;
  };

  const processPayment = async () => {
    // Reset previous errors
    setError(null);
    
    // Validate payment details
    if (!validatePaymentDetails()) {
      return;
    }
    setLoading(true);

    try {
      // Prepare order details
      const orderDetails = {
        userId: userInfo.username,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        items: cart.map(item => ({
          bookId: item.book_id,
          quantity: item.quantity,
          price: item.price
        })),
        paymentMethod: paymentMethod,
        shippingAddress: userInfo.address
      };
      // Simulate payment processing
      // const response = await api.post(`${api.defaults.baseURL}api/orders/process`, orderDetails);
    const response = {'status' : 200};
      if (response.status === 200) {
        // Payment successful
        onPaymentSuccess(response);
        console.log('Payment successful');
        onClose();
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      console.error('Payment Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Complete Payment</h2>
        
        {/* Payment Method Selection */}
        <div className="space-y-4">
          <label className="mt-1 block text-sm font-bold text-gray-700 ">Payment Method</label>
          <select 
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mt-1 block h-10 w-full rounded-md border shadow-sm"
          >
          <option value="bank">Bank Account</option>
          <option value="cash">Cash On Delivery</option>
          <option value="credit">Credit Card</option>
          <option value="debit">Debit Card</option>
          <option value="paypal">PayPal</option>
        </select>
      
        {/* Conditional inputs */}
        {paymentMethod === 'credit' || paymentMethod === 'debit' ? (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Card Number</label>
            <input 
              type="text" 
              placeholder="Card Number" 
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full p-2 border rounded-md"
              maxLength="16"
            />
            <div className="flex space-x-2">
            <label className="block text-sm font-medium text-gray-700">Expire Date</label>
              <input 
                type="text" 
                placeholder="MM/YY" 
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-1/2 p-2 border rounded-md"
                maxLength="5"
              />
            <label className="block text-sm font-medium text-gray-700">CVV</label>
              <input 
                type="text" 
                placeholder="CVV" 
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-1/2 p-2 border rounded-md"
                maxLength="4"
              />
            </div>
          </div>
        ) : paymentMethod === 'paypal' ? (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">PayPal Email</label>
            <input 
              type="email" 
              placeholder="PayPal Email"
              value={payPalEmail}
              onChange={(e) => setPayPalEmail(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        ) : paymentMethod === 'bank' ? (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Bank Account Number</label>
            <input 
              type="text" 
              placeholder="Bank Account Number" 
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              className="w-full p-2 border rounded-md"
            />

          </div>
        ) : null}
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input 
              type="text" 
              placeholder="Phone Number" 
              value={phone_number}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input 
              type="text" 
              placeholder="Address" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
      </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Payment Summary */}
        <div className="mt-4 text-right">
          <p className="text-xl font-bold">
            Total: ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button 
            onClick={processPayment}
            disabled={loading}
            className={`px-4 py-2 rounded-md ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default PaymentModal;