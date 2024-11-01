// src/components/shop/ShopGrid.jsx
import React from 'react';
import ShopBookCard from '../BookCards';

const ShopGrid = ({ books }) => (
    <div className="shop-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
            <ShopBookCard key={book.book_id} book={book} />
        ))}
    </div>
);

export default ShopGrid;
