// src/shop/Shop.jsx
import React, { useState, useEffect } from 'react';
import ShopHeader from '../components/shop/ShopHeader';
import ShopFilters from '../components/shop/ShopFilters';
import ShopGrid from '../components/shop/ShopGrid';
import ShopEmptyState from '../components/shop/ShopEmptyState';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet/Sheet";

const Shop = () => {
   const [books, setBooks] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');
   const [priceRange, setPriceRange] = useState([0, 100]);

   useEffect(() => {
       fetchBooks();
   }, [searchTerm, priceRange]);

   const fetchBooks = async () => {
       setLoading(true);
       try {
           let url = `http://localhost:5000/api/books`;

           // Add query parameters only if filters are applied
           const params = [];
           if (searchTerm) params.push(`title=${encodeURIComponent(searchTerm)}`);
           if (priceRange && priceRange[0] !== 0 && priceRange[1] !== 100) {
               params.push(`minPrice=${priceRange[0]}`, `maxPrice=${priceRange[1]}`);
           }
           // Use /filter endpoint if there are any parameters, otherwise fetch all books
           if (params.length > 0) {
               url += `/filter?${params.join('&')}`;
               console.log(url);
           }

           const response = await fetch(url);
           console.log(response);
           const data = await response.json();
           setBooks(data);
       } catch (error) {
           console.error('Error fetching books:', error);
       } finally {
           setLoading(false);
       }
   };

   return (
       <div className="container mx-auto px-4 py-8">
           <ShopHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} onFilterClick={() => {}} />
           
           <Sheet>
               <SheetTrigger asChild>
                   <button className="p-3 rounded-lg border border-gray-300 hover:bg-gray-100">
                       Filters
                   </button>
               </SheetTrigger>
               <SheetContent>
                   <SheetHeader>
                       <SheetTitle>Filters</SheetTitle>
                   </SheetHeader>
                   <ShopFilters priceRange={priceRange} setPriceRange={setPriceRange} />
               </SheetContent>
           </Sheet>

           {loading ? (
               <div className="text-center">Loading...</div>
           ) : books.length > 0 ? (
               <ShopGrid books={books} />
           ) : (
               <ShopEmptyState />
           )}
       </div>
   );
};

export default Shop;
