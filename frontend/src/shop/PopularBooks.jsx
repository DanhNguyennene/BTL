import React from 'react';
import { Star } from 'lucide-react';

const PopularBooks = ({ books }) => {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Popular This Week</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.slice(0, 4).map((book) => (
          <div key={book.id} className="group">
            <div className="relative overflow-hidden rounded-lg mb-4">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="flex items-center text-white">
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <span className="ml-1 text-sm">{book.rating}</span>
                </div>
              </div>
            </div>
            <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-gray-600">{book.author}</p>
            <p className="text-blue-600 font-medium mt-2">${book.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PopularBooks;