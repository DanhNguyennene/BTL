const { getAllBooks, getBookByID, createABook,
    updateABook, deleteABook, deleteAllofBooks, filterBook
 } = require('../models/book.model');
const connection = require('../config/database');


const getBooks = async (req, res) => {
    try {
        const books = await getAllBooks();
        res.json(books);
    } catch (error) {
        console.error('Error in getBooks:', error);
        res.status(500).json({ message: error.message });
    }
};
const filterBooks = async (req, res) => {
    try {
        const filters = {
            title: req.query.title,
            minPrice: req.query.minPrice,
            maxPrice: req.query.maxPrice,
            author_id: req.query.author_id,
            author_name: req.query.author_name,
            pu_id: req.query.pu_id
        };
        const books = await filterBook(filters);
        res.json(books);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Database query error' });
    }
};
const getBook = async (req, res) => {
    try {
        const book_id = req.params.book_id;
        const book = await getBookByID(book_id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        console.error('Error in getBook:', error);
        res.status(500).json({ message: error.message });
    }
};

const createBook = async (req, res) => {
    try {
        const { title, price, author_id, pu_id } = req.body;
        const result = await createABook(title, price, author_id, pu_id);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateBook = async (req, res) => {
    try {
        const book_id = req.params.book_id;
        const { title, price, author_id, pu_id } = req.body;
        console.log(req.body);
        const result = await updateABook(book_id, title, price, author_id, pu_id);
        if (!result) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const deleteBook = async (req, res) => {
    try {
        const book_id = req.params.book_id;
        const result = await deleteABook(book_id);
        if (!result){
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const deleteAllBooks = async (req, res) => {
    try {
        await deleteAllofBooks();
        res.status(200).json({ message: 'All books deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    getBooks,
    getBook,
    deleteAllBooks,
    createBook,
    updateBook,
    deleteBook,
    filterBooks
};