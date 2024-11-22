import React from 'react';
import BookCards from '../BookCards';

const ShopGrid = ({ books, isShopPage = false }) => (
  console.log(books),
  <div className={`shop-grid my-20 ${isShopPage ? 'shop-page' : ''}`}>
    <BookCards filteredBooks={books} headline="Browse Our Collection" isShopPage={isShopPage} />
  </div>
);

export default ShopGrid;
