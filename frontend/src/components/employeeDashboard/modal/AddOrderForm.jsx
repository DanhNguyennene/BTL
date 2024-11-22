// AddOrderForm.jsx
import React, { useState, useEffect } from 'react';

const AddOrderForm = ({ books, publishers, newOrder, setNewOrder, setShowAddOrderForm, handleSubmitOrder}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooks, setSelectedBooks] = useState([]);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookSelect = (e) => {
    const bookId = e.target.value;
    console.log("Selected bookId:", bookId);

    if (bookId) {
      const selectedBook = books.find(b => b.book_id.toString() === bookId);
      if (!selectedBooks.some(b => b.book_id === selectedBook.book_id)) {
        const newSelectedBook = { ...selectedBook, quantity: 1 };
        setSelectedBooks(prevBooks => {
          const updatedBooks = [...prevBooks, newSelectedBook];
          console.log('Updated Selected Books:', updatedBooks);
          return updatedBooks;
        });

        setNewOrder(prev => {
          const updatedOrder = {
            ...prev,
            books: [...prev.books, { book_id: selectedBook.book_id, quantity: 1 }]
          };
          console.log('Updated New Order:', updatedOrder);
          return updatedOrder;
        });
      }
    }
  };

  const handleQuantityChange = (bookId, quantity) => {
    const validQuantity = Math.max(1, parseInt(quantity) || 1);

    setSelectedBooks(prevBooks => 
      prevBooks.map(book => 
        book.book_id === bookId 
          ? { ...book, quantity: validQuantity } 
          : book
      )
    );

    // Update newOrder simultaneously
    setNewOrder(prev => ({
      ...prev,
      books: prev.books.map(book => 
        book.book_id === bookId 
          ? { ...book, quantity: validQuantity }
          : book
      )
    }));
  };

  const removeBook = (bookId) => {
    setSelectedBooks(prevBooks => 
      prevBooks.filter(book => book.book_id !== bookId)
    );

    // Update newOrder simultaneously
    setNewOrder(prev => ({
      ...prev,
      books: prev.books.filter(book => book.book_id !== bookId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    handleSubmitOrder();
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        <h2 className='text-xl font-bold mb-6 text-center'>New Publisher Order</h2>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Publisher Selection */}
          <div className='mb-6'>
            <label htmlFor='publisher' className='block text-lg font-medium mb-2'>
              Select Publisher
            </label>
            <select
              id='publisher'
              name='publisher'
              required
              className='w-full border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 py-3 px-4'
              value={publishers.filter(publisher => publisher.pu_id === newOrder.pu_id).pu_name}
              onChange={(e) => {
                const selectedPublisherName = e.target.value; 
                const selectedPublisherId = publishers.find(publisher => publisher.pu_name === selectedPublisherName);

                setNewOrder(prev => ({
                  ...prev,
                  pu_id: selectedPublisherId.pu_id,
                }));
              }}
            > 
              <option value="">Select a publisher</option>
              {publishers.map(publisher => (
                <option key={publisher.id} value={publisher.id}>
                  {publisher.pu_name}
                </option>
              ))}
            </select>
          </div>

          {/* Book Selection */}
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Add Books</label>

            {/* Book Selection Group */}
            <div className="space-y-4">
              {/* Search and Select Group */}
              <div className="flex gap-4">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  placeholder="Filter books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  onChange={handleBookSelect}
                  value=""
                >
                  <option value="">Select a book</option>
                  {filteredBooks.map(book => (
                    <option 
                      key={book.book_id} 
                      value={book.book_id}
                      disabled={selectedBooks.some(b => b.book_id === book.book_id)}
                    >
                      {book.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Books List */}
              <div className="space-y-3 mt-4">
                {selectedBooks.map(book => (
                  <div key={book.book_id} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                    <div className="flex-1">
                      <h4 className="font-medium">{book.title}</h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="text-sm">Quantity:</label>
                      <input
                        type="number"
                        min="1"
                        className="w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={book.quantity}
                        onChange={(e) => handleQuantityChange(book.book_id, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeBook(book.book_id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => setShowAddOrderForm(false)}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={!newOrder.pu_id || selectedBooks.length === 0}
            >
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrderForm;