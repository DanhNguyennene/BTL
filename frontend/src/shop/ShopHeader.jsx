import React from 'react';
import { Search } from 'lucide-react';

const ShopHeader = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-12 text-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Discover Your Next Book</h1>
      <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
        Explore our carefully curated collection of books from renowned authors around the world
      </p>
      <div className="relative max-w-xl mx-auto">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title, author, or genre..."
          className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>
    </div>
  );
};
export default ShopHeader;