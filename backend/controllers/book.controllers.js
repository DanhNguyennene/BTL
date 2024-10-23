const { client } = require('../config/db.config');
const { getBookCollection } = require('../models/book.model');
const { ObjectId } = require('mongodb');
const getBooks = async (req, res) => {
    try {
        const collection = getBookCollection(client);
        console.log('Database:', collection.dbName);
        console.log('Collection:', collection.collectionName);
        
        const books = await collection.find({}).toArray();
        console.log('Total books found:', books.length);
        
        books.forEach(book => {
            console.log({
                id: book._id.toString(),
                title: book.bookTitle,
                idType: typeof book._id
            });
        });
        
        res.json(books);
    } catch (error) {
        console.error('Error in getBooks:', error);
        res.status(500).json({ message: error.message });
    }
};

const getBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        console.log('Requested ID:', bookId);
        
        // Verify the collection
        const collection = getBookCollection(client);
        
        // Get all books and check if the ID exists
        const allBooks = await collection.find({}).toArray();
        const exists = allBooks.some(book => book._id.toString() === bookId);
        console.log('ID exists in collection:', exists);
        
        if (exists) {
            console.log('Found matching ID in collection');
            const matchingBooks = allBooks.filter(book => 
                book._id.toString() === bookId
            );
            console.log('Matching books:', matchingBooks);
        }

        const book = await collection.findOne({ _id: new ObjectId(bookId) });
        
        if (!book) {
            console.log('No book found by ObjectId, checking for raw ID match');
            const rawBook = await collection.findOne({ _id: bookId });
            console.log('Raw query result:', rawBook);
            if (!rawBook) { // This should check rawBook, not book
                return res.status(404).json({ 
                    message: 'Book not found',
                    requestedId: bookId,
                    exists: exists,
                    totalBooks: allBooks.length
                });
            }
            res.json(rawBook); 
        } else {
            res.json(book); 
        }
    } catch (error) {
        console.error('Error in getBook:', error);
        res.status(500).json({ 
            message: error.message,
            type: error.constructor.name
        });
    }
};
const createBook = async (req, res) => {
    try{
        if (Array.isArray(req.body)){
            const result = await getBookCollection(client).insertMany(req.body);
            res.status(201).json({ 
                message: `${result.insertedCount} books were added successfully`, 
                insertedIds: result.insertedIds 
            });
        }else{
            const result = await getBookCollection(client).insertOne(req.body);
            res.status(201).json(result);
        }
    }catch(error){
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