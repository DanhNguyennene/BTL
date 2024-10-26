const express = require('express');
const router = express.Router();
const {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    deleteAllBooks
} = require('../controllers/book.controllers');

router.get('/', getBooks);
router.get('/:book_id', getBook);
router.post('/', createBook);
router.put('/:book_id', updateBook);
router.delete('/:book_id', deleteBook);
router.delete('/', deleteAllBooks); 

module.exports = router;
