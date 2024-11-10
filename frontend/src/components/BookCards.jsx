// Ensure all imports are at the top of the file
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FiShoppingCart } from "react-icons/fi";
import 'swiper/css';
import 'swiper/css/pagination';
import './BookCards.css';
import { Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import api from '../api/axios';

// Define your custom hook at the top level
const useBooks = (filteredBooks = null) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/books');
      const booksData = response.data;

      const detailedBooks = await Promise.all(
        booksData.map(async (book) => {
          const responseDetail = await api.get(`/api/books/${book.book_id}`);
          return {
            ...book,
            authorName: responseDetail.data.authorName,
            genre: responseDetail.data.genre,
          };
        })
      );

      const finalBooks = filteredBooks
        ? detailedBooks.filter((book) =>
            filteredBooks.some((filteredBook) => filteredBook.book_id === book.book_id)
          )
        : detailedBooks;

      setBooks(finalBooks);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch books: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [filteredBooks]);

  return { books, loading, error, refetchBooks: fetchBooks };
};

// Define your component
const BookCards = ({ filteredBooks, headline }) => {
  const { books, loading, error } = useBooks(filteredBooks);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='my-16 px-4 lg:px-24'>
      <h2 className='text-5xl text-center font-bold text-gray-900 my-5'>{headline}</h2>
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
        {books.map((book) => (
          <SwiperSlide key={book.book_id}>
            <Link to={`/api/books/${book.book_id}`} className="group">
              <div className='relative overflow-hidden rounded-lg shadow-lg'>
              {/* image url đâu ra */}
                <img src={book.imageURL} alt={book.title} className="w-full object-cover" />
                <div className='mt-4'>
                  <p className='text-gray-600'>Author: {book.authorName}</p>
                  <p className='text-blue-800 font-bold'>Price: ${book.price}</p>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

// Export the component
export default BookCards;
