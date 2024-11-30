import React, { useContext } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { FiDollarSign, FiBook, FiUser, FiTag } from 'react-icons/fi';
import { FaBook } from "react-icons/fa6";
import { useAuth } from '../contexts/AuthContext';
// import {getCart} from '../shop/Checkout';
import { GlobalContext } from '../contexts/GlobalContext';

const BookDetail = ({ label, icon: Icon, value, className = '' }) => (
  <div className='flex items-center space-x-3 text-gray-700'>
    <Icon className="w-5 h-5 text-blue-600" />
    <span className='font-medium'>{label}:</span>
    <span className={`${className}`}>{value}</span>
  </div>
);

const ActionButton = ({ onClick, children }) => (
  <button 
    onClick={onClick}
    className='transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 hover:shadow-lg rounded-2xl px-8 py-3 font-semibold text-white'
  >
    {children}
  </button>
);

const SingleBook = () => {
  const navigate = useNavigate();
  const { userInfo, isAuthenticated, isEmployee, isCustomer } = useAuth();
  const {
    authorName,
    book_id,
    genreName, 
    imageURL,
    price,
    publisherName,
    title
  } = useLoaderData();


  const { cart, updateCart } = useContext(GlobalContext);
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    // Add to cart logic here
    updateCart({
      book_id,
      title,
      authorName,
      imageURL,
      price,
      publisherName
    });
    console.log(cart);
  };

  const handlePurchase = () => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    // Purchase logic here
    updateCart({
      book_id,
      title,
      authorName,
      imageURL,
      price,
      publisherName
    });
    // navigate to checkout page
    navigate('/${userInfo.username}/cart');
  };

  const renderActionButtons = () => {
    if (isEmployee) {
      return (
        <ActionButton 
          onClick={() => navigate(`/${userInfo.username}/employee-dashboard`)}
        >
          Back to Dashboard
        </ActionButton>
      );
    }

    return (
      <>
        <ActionButton onClick={handleAddToCart}>
          Add to Cart
        </ActionButton>
        {isCustomer && (
          <ActionButton onClick={handlePurchase}>
            Purchase
          </ActionButton>
        )}
      </>
    );
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:py-32 py-40'>
      <div className='flex flex-col lg:flex-row gap-12'>
        {/* Book Image Section */}
        <div className='bg-blue-100 lg:w-1/3'>
          <div className='relative group'>
            <img 
              src={imageURL} 
              alt={title} 
              className='w-full rounded-lg shadow-xl transition-transform duration-300 group-hover:scale-105' 
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 rounded-lg" />
          </div>
        </div>

        {/* Book Details Section */}
        <div className='bg-green-100 lg:w-2/3 space-y-6 px-10 rounded-2xl shadow-2xl'>
          <h1 className='text-center font-bold text-4xl text-gray-500 transition-colors duration-300 hover:text-blue-600 pt-10'>
            {title}
          </h1>

          {/* Book Information Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <BookDetail 
              label="Author"
              icon={FiUser}
              value={authorName}
              className="text-gray-900"
            />
            <BookDetail 
              label="Category"
              icon={FiTag}
              value={genreName}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            />
            <BookDetail 
              label="Price"
              icon={FiDollarSign}
              value={`${price}`}
              className="text-green-600 font-bold"
            />
            <BookDetail 
              label="Publisher"
              icon={FaBook}
              value={publisherName}
              className="text-gray-900"
            />
          </div>

          {/* Book Description */}
          <div className='space-y-3 font-semibold text-gray-500'>
            <h2 className="text-2xl font-semibold text-gray-900">
              About this book
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {"bookDescription"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-wrap gap-4 pt-6'>
            {renderActionButtons()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBook;