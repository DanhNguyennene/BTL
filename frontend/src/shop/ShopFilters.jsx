import React from 'react';

const ShopFilters = ({ authors, setSelectedAuthor }) => {
    return (
        <div className="shop-filters mb-4">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            
            {/* Filter by Author */}
            <label className="block text-gray-700 mb-2">Author</label>
            <select
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="w-full p-2 border rounded mb-4"
            >
                <option value="">All Authors</option>
                {authors.map((author) => (
                    <option key={author.id} value={author.name}>
                        {author.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ShopFilters;
