import React from 'react';
import BookCards from '../BookCards';

const ShopGrid = ({ books, isShopPage = false }) => (
  <div className={`shop-grid my-16 ${isShopPage ? 'shop-page' : ''}`}>
    <BookCards books={books} headline="Browse Our Collection" isShopPage={isShopPage} />
  </div>
);

export default ShopGrid;
