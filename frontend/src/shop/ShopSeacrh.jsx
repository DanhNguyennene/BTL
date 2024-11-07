import React from 'react';

const ShopSearch = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="shop-search mb-4">
            <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded"
            />
        </div>
    );
};

export default ShopSearch;
