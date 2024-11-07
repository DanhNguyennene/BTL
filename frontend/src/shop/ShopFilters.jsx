// src/components/shop/ShopFilters.jsx
import React from 'react';

const ShopFilters = ({ authors, setAuthors }) => {
    // Here you can add other filter options as needed (e.g., genre, price range).
    return (
        <div className="shop-filters mb-4">
            <h3 className="text-lg font-semibold mb-2">Filters</h3>
            {/* Example: Filter by Author */}
            <select
                onChange={(e) => setAuthors(e.target.value)}
                className="w-full p-2 border rounded mb-4"
            >
                <option value="">All Authors</option>
                {authors.map((author) => (
                    <option key={author.id} value={author.name}>
                        {author.name}
                    </option>
                ))}
            </select>
            {/* Additional filters (e.g., price range) can be added here */}
        </div>
    );
};

export default ShopFilters;
