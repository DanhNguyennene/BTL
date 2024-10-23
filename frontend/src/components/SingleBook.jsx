import React from 'react'
import { useLoaderData } from 'react-router-dom'
import { FiDollarSign, FiBook, FiUser, FiTag } from 'react-icons/fi';


const SingleBook = () => {
  const {
      bookTitle,
      authorName,
      imageURL,
      category,
      bookDescription,
      bookPDFURL,
      price
  } = useLoaderData();

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:py-32 py-40'>
      <div className='flex flex-col lg:flex-row gap-12'>
        {/* Left side-image */}
        <div className='bg-blue-100 lg:w-1/3'>
          <div className='relative group'>
            <img src={imageURL} alt={bookTitle} className='w-full rounded-lg shadow-xl transition-transform duration-300 group-hover:scale-105' />

            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 rounded-lg" />
          </div>
        </div>

        {/* Right side - content */}
        <div className='bg-green-100 lg:w-2/3 space-y-6 px-10 rounded-2xl shadow-2xl'>
          <h1 className='text-center font-bold text-4xl text-gray-500 transition-colors duration-300 hover:text-blue-600 pt-10'>
            {bookTitle}
          </h1>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex item-center space-x-3 text-gray-700'>
              <FiUser className="w-5 h-5 text-blue-600" />
              <span className='font-medium'>Author: </span>
              <span className='text-gray-900'>{authorName}</span>
            </div>

            <div className='flex item-center space-x-3 text-gray-700'>
              <FiTag className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Category:</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {category}
              </span>
            </div>

            <div className='flex item-center space-x-3 text-gray-700'>
              <FiDollarSign className="w-5 h-5 text-blue-600"/>
              
              <span className="font-medium">Price:</span>
              <span className="text-green-600 font-bold">{price}</span>
            </div>

            <div className='flex item-center space-x-3 text-gray-700'>
              <FiBook className="w-5 h-5 text-blue-600" />
              <a href={bookPDFURL} target='_blank' rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">Read on GoodReads</a>
            </div>
          </div>

          <div className='space-y-3 font-semibold text-gray-500'>
            <h2 className="text-2xl font-semibold text-gray-900">About this book</h2>
            <p className="text-gray-600 leading-relaxed">
                {bookDescription}
            </p>
          </div>

          <div className='flex flex-wrap gap-4 pt-6'>
            <button className='transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 hover:shadow-lg rounded-2xl px-8 py-3 font-semibold text-white '>
              Add to cart
            </button>
            <button className='transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 hover:shadow-lg rounded-2xl px-8 py-3 font-semibold text-white'>
              Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleBook
