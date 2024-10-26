const { allBooks, getBookByID } = require('../models/book.model');
const connection = require('../config/database');


const getBooks = async (req, res) => {
    try {
        const books = await allBooks();
        res.json(books);
    } catch (error) {
        console.error('Error in getBooks:', error);
        res.status(500).json({ message: error.message });
    }
};

const getBook = async (req, res) => {
    try {
        const book_id = req.params.id;
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
        if (Array.isArray(req.body)) {
            const result = await getBookCollection(client).insertMany(req.body);
            res.status(201).json({
                message: `${result.insertedCount} books were added successfully`,
                insertedIds: result.insertedIds
            });
        } else {
            const result = await getBookCollection(client).insertOne(req.body);
            res.status(201).json(result);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateBook = async (req, res) => {
    try {
        const result = await getBookCollection(client).updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const deleteBook = async (req, res) => {
    try {
        const result = await getBookCollection(client).deleteOne({
            _id: new ObjectId(req.params.id)
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const deleteAllBooks = async (req, res) => {
    console.log('Delete all books route called');
    try {
        const result = await getBookCollection(client).deleteMany({});
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No books found to delete' });
        }
        res.json({ message: 'All books deleted successfully', deletedCount: result.deletedCount });
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
    deleteBook
};