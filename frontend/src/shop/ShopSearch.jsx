import React from 'react';

const ShopSearch = ({ searchTerm, setSearchTerm, searchType, setSearchType }) => {
    return (
        <div className="shop-search mb-4 flex items-center space-x-4">
            {/* Dropdown to select search type */}
            <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="p-2 border rounded"
            >
                <option value="title">Search by Title</option>
                <option value="author">Search by Author</option>
            </select>
            
            {/* Search input field */}
            <input
                type="text"
                placeholder={`Search books by ${searchType}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow p-2 border rounded"
            />
        </div>
    );
};

export default ShopSearch;
