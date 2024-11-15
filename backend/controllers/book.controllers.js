const { getAllBooks, getBookByID, createABook,
    updateABook, deleteABook, deleteAllofBooks, getBookTitles, createUserCustomer, validUser, filterBook
} = require('../models/book.model');
const jwt = require('jsonwebtoken');
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
const searchBookTitles = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Query parameter "q" is required.' });

        }
        const titles = await getBookTitles(q);
        res.json(titles);
    } catch (error) {
        console.error(`Error in searchBookTitles: ${error}`);
        res.status(500).json({ message: error.message });
    }
}

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
        // title, price, author_id, pu_id, imageURL, as well as [genre_id], so we need to update book_genre table
        const { title, price, author_id, pu_id, imageURL, genre_ids } = req.body;
        const newBook = await createABook(title, price, author_id, pu_id, imageURL);
        // update book_genre table
        for (let i = 0; i < genre_ids.length; i++) {
            await connection.query(
                `INSERT INTO book_genre (book_id, genre_id) VALUES (?, ?)`,
                [newBook.book_id, genre_ids[i]]
            );
        }
        res.status(201).json(newBook);
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
        if (!result) {
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

const signUp = async (req, res) => {
    try {
        const userData = {
            username,
            name,
            phone_number,
            email,
            password,
            address,
            bank_acc
        } = req.body;
        console.log("Inside signup: ", username, name, phone_number, email, password, address, bank_acc)
        if (!username || !name || !phone_number || !email || !password || !address || !bank_acc) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
                required: ['username', 'name', 'phone_number', 'email', 'password', 'address', 'bank_acc']
            });
        }


        const newUser = await createUserCustomer(userData);
        res.status(201).json(
            {
                message: "User created Successfully!",
                user: {
                    username: newUser.username,
                    name: newUser.name,
                    email: newUser.email,
                    phone_number: newUser.phone_number,
                    address: newUser.address
                },
                success: true
            }
        )

    } catch (error) {
        console.error("Signup error: ", error)
        if (error.message === "Username already exists!") {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }
        return res.status(500).json({
            success: false,
            message: 'An error occurred during registration',
            error: error.message
        });
    }
}

const signIn = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        const user = await validUser(username, password);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            {
                username: user.username,
                user_type: user.user_type
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '24h'
            }
        );

        res.json({
            success: true,
            token,
            user: {
                username: user.username,
                name: user.name,
                email: user.email,
                phone_number: user.phone_number,
                user_type: user.user_type
            }
        })
    } catch (error) {
        console.error('SignIn Error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred during sign in',
            error: error.message
        });
    }
}

const getAuthors = async (req, res) => {
    try {
        const [rows] = await connection.query(
            `SELECT * FROM author`
        );
        res.json(rows);
    } catch (error) {
        console.error('Error in getAuthors:', error);
        res.status(500).json({ message: error.message });
    }
};


const getPublishers = async(req, res)  => {
    try{
        const [rows] = await connection.query(
            `SELECT * FROM publisher`
        );
        res.json(rows);
    }catch(error){
        console.error('Error in getPublishers:', error);
        res.status(500).json({ message: error.message });
    }
}
// TODO:
const getOrders = async (req, res) => {
    try {
        const [rows] = await connection.query(
            `SELECT * FROM order`
        );
        // join with order_book table to get books in each order
        for (let i = 0; i < rows.length; i++) {
            const [books] = await connection.query(
                `SELECT book_id, quantity FROM order_book WHERE order_id = ?`,
                [rows[i].order_id]
            );
            rows[i].books = books;
        }
        res.json(rows);
    } catch (error) {
        console.error('Error in getOrders:', error);
        res.status(500).json({ message: error.message });
    }
}
const getOrder = async (req, res) => {
    try {
        const { username } = req.params;
        const [rows] = await connection.query(
            `SELECT * FROM order WHERE username = ?`,
            [username]
        );
        // join with order_book table to get books in each order
        for (let i = 0; i < rows.length; i++) {
            const [books] = await connection.query(
                `SELECT book_id, quantity FROM order_book WHERE order_id = ?`,
                [rows[i].order_id]
            );
            rows[i].books = books;
        }
        res.json(rows);
    } catch (error) {
        console.error('Error in getOrder:', error);
        res.status(500).json({ message: error.message });
    }
}



const getPublisherOrders = async (req, res) => {
    try {
        const [rows] = await connection.query(
            `SELECT * FROM order_publisher`
        );
        // join with order_publisher_book table to get books in each order
        for (let i = 0; i < rows.length; i++) {
            const [books] = await connection.query(
                `SELECT book_id, quantity FROM order_publisher_book WHERE pu_order_id = ?`,
                [rows[i].pu_order_id]
            );
            rows[i].books = books;
        }
        res.json(rows);
    } catch (error) {
        console.error('Error in getPublisherOrders:', error);
        res.status(500).json({ message: error.message });
    }
}

const createAuthor = async (req, res) => {
    try {
        const { name, dob, biography } = req.body;
        // if some of them is null, it is okay

        const [result] = await connection.query(
            `INSERT INTO author (name, dob, biography) VALUES (?, ?, ?)`,
            [name, dob, biography]
        );
        res.status(201).json({ author_id: result.insertId, name });
    } catch (error) {
        console.error('Error in createAuthor:', error);
        res.status(500).json({ message: error.message });
    }
}
const updateAuthor = async (req, res) => {
    try {
        const { author_id, name, dob, biography } = req.body;
        const [result] = await connection.query(
            `UPDATE author SET name = ?, dob = ?, biography = ? WHERE author_id = ?`,
            [name, dob, biography, author_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Author not found' });
        }
        res.json({ author_id, name });
    } catch (error) {
        console.error('Error in updateAuthor:', error);
        res.status(500).json({ message: error.message });
    }
}
const deleteAuthor = async (req, res) => {
    try {
        const author_id = req.params.author_id;
        const [result] = await connection.query(
            `DELETE FROM author WHERE author_id = ?`,
            [author_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Author not found' });
        }
        res.json({ message: 'Author deleted successfully' });
    } catch (error) {
        console.error('Error in deleteAuthor:', error);
        res.status(500).json({ message: error.message });
    }
}
const getGenres = async (req, res) => {
    try {
        const [rows] = await connection.query(
            `SELECT * FROM genre`
        );
        res.json(rows);
    } catch (error) {
        console.error('Error in getGenres:', error);
        res.status(500).json({ message: error.message });
    }
}
const createGenre = async (req, res) => {
    try {
        const { genre_name, description } = req.body;
        const [result] = await connection.query(
            `INSERT INTO genre (genre_name, description) VALUES (?, ?)`,
            [genre_name, description]
        );
        res.status(201).json({ genre_id: result.insertId, genre_name });
    } catch (error) {
        console.error('Error in createGenre:', error);
        res.status(500).json({ message: error.message });
    }
}
const updateGenre = async (req, res) => {
    try {
        const { gen_id, genre_name, description } = req.body;

        const [result] = await connection.query(
            `UPDATE genre SET genre_name = ?, description = ? WHERE gen_id = ?`,
            [genre_name, description, gen_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Genre not found' });
        }

        res.json({ gen_id, genre_name });
    } catch (error) {
        console.error('Error in updateGenre:', error);
        res.status(500).json({ message: error.message });
    }
}
const deleteGenre = async (req, res) => {
    try {
        const gen_id = req.params.gen_id;
        const [result] = await connection.query(
            `DELETE FROM genre WHERE gen_id = ?`,
            [gen_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Genre not found' });
        }
        res.json({ message: 'Genre deleted successfully' });
    } catch (error) {
        console.error('Error in deleteGenre:', error);
        res.status(500).json({ message: error.message });
    }
}

const createPublisher = async (req, res) => {
    try {
        const { pu_name, pu_phone_number, pu_address } = req.body;
        console.log(req.body);
        const [result] = await connection.query(
            `INSERT INTO publisher (pu_name, pu_phone_number, pu_address) VALUES (?, ?, ?)`,
            [pu_name, pu_phone_number, pu_address]
        );
        res.status(201).json({ pu_id: result.insertId, pu_name });
    } catch (error) {
        console.error('Error in createPublisher:', error);
        res.status(500).json({ message: error.message });
    }
}
const updatePublisher = async (req, res) => {
    try {
        const { pu_id, pu_name, pu_phone_number, pu_address } = req.body;
        const [result] = await connection.query(
            `UPDATE publisher SET pu_name = ?, pu_phone_number = ?, pu_address = ? WHERE pu_id = ?`,
            [pu_name, pu_phone_number, pu_address, pu_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Publisher not found' });
        }
        res.json({ pu_id, pu_name });
    } catch (error) {
        console.error('Error in updatePublisher:', error);
        res.status(500).json({ message: error.message });
    }
}
const deletePublisher = async (req, res) => {
    try {
        const pu_id = req.params.pu_id;
        console.log(req.params);
        const [result] = await connection.query(
            `DELETE FROM publisher WHERE pu_id = ?`,
            [pu_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Publisher not found' });
        }
        res.json({ message: 'Publisher deleted successfully' });
    } catch (error) {
        console.error('Error in deletePublisher:', error);
        res.status(500).json({ message: error.message });
    }
}

const createBookGenre = async (req, res) => {
    try {
        const { book_id, genre_id } = req.body;
        const [result] = await connection.query(
            `INSERT INTO book_genre (book_id, genre_id) VALUES (?, ?)`,
            [book_id, genre_id]
        );
        res.status(201).json({ book_id, genre_id });
    } catch (error) {
        console.error('Error in createBookGenre:', error);
        res.status(500).json({ message: error.message });
    }
}

const createOrder = async (req, res) => {
    try {
        const { order_time, order_status, username, books } = req.body;
        // update order table
        // also update order_book table from books
        // book: {book_id, quantity}
        // books: [{book_id, quantity}]
        const [result] = await connection.query(
            `INSERT INTO order (order_time, order_status, username) VALUES (?, ?, ?)`,
            [order_time, order_status, username]
        );
        const order_id = result.insertId;
        for (let i = 0; i < books.length; i++) {
            await connection.query(
                `INSERT INTO order_book (order_id, book_id, quantity) VALUES (?, ?, ?)`,
                [order_id, books[i].book_id, books[i].quantity]
            );
        }
        res.status(201).json({ order_id, order_time, order_status, username, books });
    } catch (error) {
        console.error('Error in createOrder:', error);
        res.status(500).json({ message: error.message });
    }
}

const createOrderPublisher = async (req, res) => {
    try {
        const { pu_order_status, pu_order_time, username, pu_id, books } = req.body;
        // update order_publisher table
        // also update order_publisher_book table from books
        // book: {book_id, quantity}
        // books: [{book_id, quantity}]
        const [result] = await connection.query(
            `INSERT INTO order_publisher (pu_order_status, pu_order_time, username, pu_id) VALUES (?, ?, ?, ?)`,
            [pu_order_status, pu_order_time, username, pu_id]
        );
        const pu_order_id = result.insertId;
        for (let i = 0; i < books.length; i++) {
            await connection.query(
                `INSERT INTO order_publisher_book (pu_order_id, book_id, quantity) VALUES (?, ?, ?)`,
                [pu_order_id, books[i].book_id, books[i].quantity]
            );
        }
        res.status(201).json({ pu_order_id, pu_order_status, pu_order_time, username, pu_id, books });
    } catch (error) {
        console.error('Error in createOrderItem:', error);
        res.status(500).json({ message: error.message });
    }
}



module.exports = {
    getBooks,
    getBook,
    deleteAllBooks,
    createBook,
    updateBook,
    deleteBook,
    filterBooks,
    searchBookTitles,
    getAuthors,
    signUp,
    signIn,
    //TODO:
    getOrders,
    getPublishers,
    getPublisherOrders,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    getGenres,
    createGenre,
    updateGenre,
    deleteGenre,
    createPublisher,
    updatePublisher,
    deletePublisher,
    createBookGenre,
    createOrder,
    createOrderPublisher,
    getOrder,
};