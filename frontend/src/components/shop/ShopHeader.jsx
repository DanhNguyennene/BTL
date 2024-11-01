// src/components/shop/ShopHeader.jsx
import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const ShopHeader = ({ searchTerm, setSearchTerm, onFilterClick }) => (
    <div className="shop-header flex gap-4 items-center mb-8">
        <div className="relative flex-1">
            <input
                type="text"
                placeholder="Search books..."
                aria-label="Search books"
                className="search-input w-full p-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-3 text-gray-400" />
        </div>
        <button onClick={onFilterClick} className="filter-button p-3 rounded-lg border border-gray-300 hover:bg-gray-100">
            <SlidersHorizontal className="h-6 w-6" />
        </button>
    </div>
);

export default ShopHeader;
