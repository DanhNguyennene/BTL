// src/components/shop/ShopGrid.jsx
import React from 'react';
import BookCards from '../BookCards';

const ShopGrid = ({ books }) => (
  <div className="shop-grid my-16 px-4 lg:px-24">
    <BookCards books={books} headline="Browse Our Collection" />
  </div>
);

export default ShopGrid;
