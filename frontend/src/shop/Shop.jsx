<<<<<<< HEAD
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
  const [searchType, setSearchType] = useState('title'); // New state for search type
  const [authors, setAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState('');
=======
import React, {useState, useCallback} from 'react'
import SearchBar from '../components/SearchBar'
import BookLists from '../components/BookLists'


const Shop = () => {

  const {search, setSearch} = useState('')

  const handleSearch = useCallback((searchItem) => {
    setSearch(searchItem);
  }, []);

  

  return (
    <>
    <div>dasd</div>
    </>
  )
}
>>>>>>> f28f1963aa2a6b1b08b7592255d05cd78057a477

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
  }, [searchTerm, searchType, selectedAuthor]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      // Construct the query parameters based on searchType and selectedAuthor
      let url = `http://localhost:5000/api/books/filter`;
      const queryParams = [];

      if (searchTerm) {
        if (searchType === 'title') {
          queryParams.push(`title=${encodeURIComponent(searchTerm)}`);
        } else if (searchType === 'author') {
          queryParams.push(`author_name=${encodeURIComponent(searchTerm)}`);
        }
      }

      if (selectedAuthor) {
        queryParams.push(`author_name=${encodeURIComponent(selectedAuthor)}`);
      }

      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }
      console.log(url);
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
      <div className="max-w-7xl mx-auto px-4 py-8 flex space-x-8">
        {/* Sticky Filters on the left */}
        <div className="w-1/4">
          <div className="sticky top-16"> {/* Sticky positioning */}
            <ShopFilters authors={authors} setSelectedAuthor={setSelectedAuthor} />
          </div>
        </div>

        {/* Main content on the right */}
        <div className="w-3/4">
          {/* Search Component */}
          <ShopSearch 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            searchType={searchType}
            setSearchType={setSearchType}
          />


          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : books.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {searchTerm || selectedAuthor ? 'Search Results' : 'All Books'}
              </h2>

              {console.log(books)}
              <ShopGrid books={books} />
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-gray-800 mb-2">No books found</h3>
              <p className="text-gray-600">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
