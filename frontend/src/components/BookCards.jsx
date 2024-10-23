import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FiShoppingCart } from "react-icons/fi";
import 'swiper/css';
import 'swiper/css/pagination';
import './BookCards.css';
import { Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';

const BookCards = ({books, headline}) => {
  return (
    <div className='my-16 px-4 lg:px-24'>
        <h2 className='text-5xl text-center font-bold text-gray-900 my-5 transition-colors duration-300 hover:text-blue-600'>
            {headline}
        </h2>

        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 50,
            },
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {books.map(book => (
            <SwiperSlide key={book._id}>
              <Link to={`/api/books/${book._id}`} className="group">
                <div className='relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105'>
                  <img 
                    src={book.imageURL} 
                    alt=""
                    className="w-full object-cover"
                  />
                  <div className='absolute top-4 right-2 transform transition-transform duration-300 group-hover:scale-110'>
                    <button className='bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 transition-colors duration-300'>
                      <FiShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className='mt-4 '>
                  <div className='flex items-center space-x-2'>
                    <span className='text-gray-600 font-medium text-base'>Author:</span>
                    <span className='text-gray-900 font-semibold transition-colors duration-300 group-hover:text-blue-600 text-base'>
                      {book.authorName}
                    </span>
                  </div>
                  
                  <div className='flex items-center justify-between mb-10'>
                    <span className='bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full transition-all duration-300 group-hover:bg-blue-200'>
                      Price: ${book.price}
                    </span>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
    </div>
  );
};

export default BookCards;