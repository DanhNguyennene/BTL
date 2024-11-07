// src/shop/Shop.jsx
import React, { useState, useEffect } from 'react';
import ShopSearch from './ShopSearch';
import ShopFilters from './ShopFilters';
import PopularBooks from './PopularBooks';
import FeaturedAuthors from './FeaturedAuthors';
import ShopGrid from '../components/shop/ShopGrid';

const Shop = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
  }, [searchTerm]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const url = `http://localhost:5000/api/books${
        searchTerm ? `/filter?title=${encodeURIComponent(searchTerm)}` : ''
      }`;
      const response = await fetch(url);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/authors');
      const data = await response.json();
      setAuthors(data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  return (
    <div className="pt-16"> {/* Add padding-top to account for fixed navbar */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ShopSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <ShopFilters authors={authors} setAuthors={setAuthors} />
        
        {!searchTerm && (
          <>
            <PopularBooks books={books.slice(0, 4)} />
            <FeaturedAuthors authors={authors} />
          </>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : books.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {searchTerm ? 'Search Results' : 'All Books'}
            </h2>
            <ShopGrid books={books} />
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-800 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
