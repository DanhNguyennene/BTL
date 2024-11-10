import React, { useEffect, useState } from 'react'
import BookCards from '../components/BookCards';

  



const FavBooks = () => {
    // const [books, setBooks] = useState([]);

    // useEffect( () => {
    //     fetch('http://localhost:5000/api/books').then(res => res.json()).then(data => setBooks(data.slice(0, 8)));
    // })
    // không dùng fetch làm zì

  return (
    <div>
        <BookCards headline="Best Seller Books"/>
    </div>
  )
}

export default FavBooks
