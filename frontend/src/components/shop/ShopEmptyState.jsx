// src/components/shop/ShopEmptyState.jsx
import React from 'react';

const ShopEmptyState = () => (
    <div className="empty-state text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No books found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
    </div>
);

export default ShopEmptyState;
