import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FiShoppingCart } from "react-icons/fi";
import { Star } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';

const PopularBooks = ({ books }) => {
  if (!books || books.length === 0) {
    return (
      <div className="text-center text-gray-600 p-4">
        No popular books available this week.
      </div>
    );
  }

  return (
    <div className='my-16 px-4 lg:px-24'>
      <h2 className='text-5xl text-center font-bold text-gray-900 my-5 transition-colors duration-300 hover:text-blue-600'>
        Popular This Week
      </h2>

      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 4, spaceBetween: 40 },
          1024: { slidesPerView: 5, spaceBetween: 50 },
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {books.map(book => (
          <SwiperSlide key={book.book_id}>
            <Link to={`/books/${book.book_id}`} className="group">
              <div className='relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105'>
                {/* Book Cover Image */}
                <img 
                  src={book.imageURL || 'https://via.placeholder.com/150'}
                  alt={book.title}
                  className="w-full h-64 object-cover"
                />
                
                {/* Rating and Cart Button */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center text-white">
                    <Star className="h-4 w-4 fill-current text-yellow-400" />
                    <span className="ml-1 text-sm">{book.rating || 'N/A'}</span>
                  </div>
                </div>

                {/* Shopping Cart Button */}
                <div className='absolute top-4 right-2 transform transition-transform duration-300 group-hover:scale-110'>
                  <button className='bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 transition-colors duration-300'>
                    <FiShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Book Info */}
              <div className='mt-4'>
                <h3 className='font-medium text-gray-800 group-hover:text-blue-600 transition-colors'>
                  {book.title}
                </h3>
                <p className='text-sm text-gray-600'>{book.authorName}</p>
                <p className='text-blue-600 font-medium mt-2'>${book.price}</p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PopularBooks;
