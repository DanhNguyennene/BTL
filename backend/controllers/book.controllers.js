const dayjs = require('dayjs');

const { getAllBooks, getBookByID, createABook,
    updateABook, deleteABook, deleteAllofBooks, getBookTitles, createUserCustomer, validUser, filterBook,
    updateBookGenres
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
                `INSERT INTO book_genre (book_id, gen_id) VALUES (?, ?)`,
                [newBook.book_id, genre_ids[i]]
            );
        }
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: error.message + " inside createBook" });
    }
};

const updateBook = async (req, res) => {
    try {
        const book_id = req.params.book_id;
        const { title, price, author_id, pu_id, genre_ids, imageURL } = req.body;
        console.log(req.body);
        const bookUpdated = await updateABook(book_id, title, price, author_id, pu_id, imageURL);
        console.log(genre_ids)
        if (!bookUpdated) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (genre_ids && Array.isArray(genre_ids)) {
            await updateBookGenres(book_id, genre_ids);
        }

        res.json(bookUpdated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const deleteBook = async (req, res) => {
    try {
        const book_id = req.params.book_id;
        const [result] = await connection.query(
            `DELETE FROM BOOK WHERE book_id = ?`,[book_id]
        )
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Book not found"
            });
        }
        res.status(200).json({
            message: 'Book deleted successfully'
        })
    } catch (error) {
        console.error("Error in deleteBook: ", error);
        if (error.code === 'ER_SIGNAL_EXCEPTION'){
            res.status(400).json({message: error.sqlMessage})
        }else{
            res.status(500).json({message: error.message})
        }
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


const getPublishers = async (req, res) => {
    try {
        const [rows] = await connection.query(
            `SELECT * FROM publisher`
        );
        res.json(rows);
    } catch (error) {
        console.error('Error in getPublishers:', error);
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
// TODO:
const getOrders = async (req, res) => {
    try {
        const [rows] = await connection.query(
            `SELECT * FROM \`order\``
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
        // find order where username = username
        // join with order_book table to get books in each order
        // and then join the book_id with book table to get book title
        const [rows] = await connection.query(
            `SELECT 
                \`order\`.*,
                order_book.*,
                book.*
            FROM 
                \`order\`
            JOIN 
                order_book ON \`order\`.order_id = order_book.order_id
            JOIN 
                book ON order_book.book_id = book.book_id
            WHERE 
                \`order\`.username = ?;
        ` , [username]
        );
        
        res.json(rows);
    } catch (error) {
        console.error('Error in getOrder:', error);
        res.status(500).json({ message: error.message });
    }
}

const updateOrderStatus = async(req, res) => {
    try{
        const{order_id} = req.params;
        const {order_status} = req.body;
        const validStatuses = ['Pending', 'Processing', 'Completed', 'Cancelled', 'Failed'];
        if(!validStatuses.includes(order_status)){
            return res.status(400).json({
                success:false,
                message: "Invalid order status"
            })
        }
        console.log(order_id)
        console.log(order_status)
        const [result] = await connection.query(
            `UPDATE \`order\` SET order_status = ? WHERE order_id = ?`, 
            [order_status, order_id]
        )
        if (result.affectedRows===0){
            return res.status(404).json({
                success:false,
                message: 'Order not found'
            })
        }

        res.json({
            success:true,
            message:"Order status has been update"
        })
    }catch(error){ 
        console.error('Error in updateOrderStatus:', error);
        if (error.code === 'ER_SIGNAL_EXCEPTION'){
            res.status(400).json({
                success:false,
                message: error.sqlMessage
            });
        }else{
            res.status(500).json({
                success:false,
                message: "An error occured while updating order status",
                error: error.message
            });
        };
    }
}


const updatePublisherOrderStatus = async(req, res) => {
    try{
        const{pu_order_id} = req.params;
        const {pu_order_status} = req.body;

        const validStatuses = ['Success', 'Pending', 'Failed'];
        if(!validStatuses.includes(pu_order_status)){
            return res.status(400).json({
                success:false,
                message: "Invalid order status"
            })
        }

        const [result] = await connection.query(
            `UPDATE \`ORDER_PUBLISHER\` SET pu_order_status = ? WHERE pu_order_id = ?`, 
            [pu_order_status, pu_order_id]
        )
        if (result.affectedRows===0){
            return res.status(404).json({
                success:false,
                message: 'Order not found'
            })
        }

        res.json({
            success:true,
            message:"Order status has been update"
        })
    }catch(error){ 
        console.error('Error in updateOrderStatus:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating order status'
        });
    }
}



const getPublisherOrders = async (req, res) => {
    try {
        // console.log("hello")
        const [rows] = await connection.query(
            `SELECT * FROM order_publisher`
        );
        console.log("hello")
        // join with order_publisher_book table to get books in each order
        console.log(rows)
        for (let i = 0; i < rows.length; i++) {
            const [books] = await connection.query(
                `SELECT book_id, quantity FROM order_publisher_book WHERE pu_order_id = ?`,
                [rows[i].pu_order_id]
            );
            rows[i].books = books;
        }

        for (let i = 0; i < rows.length; i ++){
            const [publisherName] = await connection.query(
                `SELECT pu_name FROM PUBLISHER WHERE pu_id = ?`, [rows[i].pu_id]
            )
            rows[i].publisherName = publisherName
        }
        res.json(rows);
       
    } catch (error) {
        console.log("hello")
        console.error('Error in getPublisherOrders:', error);
        res.status(500).json({ message: error.message });
    }
}


const getPublisherOrder = async (req, res) => {
    try{
        const {employeeUsername} = req.params;

        const [rows] = await connection.query(
            `SELECT * from ORDER_PUBLISHER WHERE username = ?`, [employeeUsername]
        )

        for (let i = 0; i < rows.length; i++) {
            const [books] = await connection.query(
                `SELECT book_id, quantity FROM order_publisher_book WHERE pu_order_id = ?`,
                [rows[i].pu_order_id]
            );
            rows[i].books = books;
        }
        res.json(rows)
    }catch(error){
        console.error('Error in getOrder:', error);
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
        const { order_time, order_status, books } = req.body;
        const username = req.params.username;
        const [result] = await connection.query(
            `INSERT INTO \`order\` (order_time, order_status, username) VALUES (?, ?, ?)`,
            [order_time, order_status, username]
        );
        const order_id = result.insertId;
        for (let i = 0; i < books.length; i++) {
            await connection.query(
                `INSERT INTO order_book (order_id, book_id, quantity) VALUES (?, ?, ?)`,
                [order_id, books[i].book_id, 1]
            );
        }
        res.status(201).json({ order_id, order_time, order_status, username, books });
    } catch (error) {
        console.error('Error in createOrder:', error);
        res.status(500).json({ message: error.message });
    }
}
const insertAlreadyInCart = async (req, res) => {
    try {
        const { order_id, book_id } = req.body;
        const username = req.params.username;
        const [result] = await connection.query(
            `INSERT INTO 
                order_book (order_id, book_id)
            SELECT 
                ?, ?
            FROM 
                \`order\` o
            WHERE 
                o.username = ? AND o.order_id = ?`,
            [order_id, book_id, username]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(201).json({ order_id, book_id, quantity });
    } catch (error) {
        console.error('Error in updateOrderBook:', error);
        res.status(500).json({ message: error.message });
    }
} 
const showAllBookInCart = async (req, res) => {
    try {
        const { username } = req.params;
        // find order where username = username
        // join with order_book table to get books in each order
        // and then join the book_id with book table to get book title
        const [rows] = await connection.query(
            `SELECT 
                \`order\`.*,
                order_book.*,
                book.book_id,
                book.title,
                book.price, 
                book.author_id,
                book.pu_id,
                book.imageURL
            FROM 
                \`order\`
            JOIN 
                order_book ON \`order\`.order_id = order_book.order_id
            JOIN 
                book ON order_book.book_id = book.book_id
            WHERE 
                \`order\`.username = ? 
            AND
                order_book.in_cart IS TRUE;
        ` , [username]
        );
        res.status(201).json(rows);
    } catch (error) {
        console.error('Error in getOrder:', error);
        res.status(500).json({ message: error.message });
    }
}
const updateOrderBookQuantity = async (req, res) => {
    try {
        const { order_id, book_id, quantity } = req.body;
        const username = req.params.username;
        const [result] = await connection.query(
            `UPDATE 
                order_book ob
            JOIN 
                \`order\` o ON o.order_id = ob.order_id
            SET 
                ob.quantity = ?
            WHERE 
                o.username = ?
            AND 
                ob.order_id = ?
            AND 
                ob.book_id = ?`,
            [quantity,username, order_id, book_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(201).json({ order_id, book_id, quantity });
    } catch (error) {
        console.error('Error in updateOrderBook:', error);
        res.status(500).json({ message: error.message });
    }
}
const deleteOrderBook = async (req, res) => {
    try {
        const { order_id, book_id } = req.body;
        const username = req.params.username;
        const [result] = await connection.query(
            `DELETE 
                ob
            FROM 
                order_book ob
            JOIN
                \`order\` o ON o.order_id = ob.order_id
            WHERE 
                o.username = ?
            AND
                ob.order_id = ? 
            AND 
                ob.book_id = ?`,
            [username,order_id, book_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(201).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error in deleteOrderBook:', error);
        res.status(500).json({ message: error.message });
    }
}

const createOrderPublisher = async (req, res) => {
    try {
        const { pu_order_status, pu_order_time, username, pu_id, books } = req.body;
        const pu_order_time_change = dayjs(pu_order_time).format('YYYY-MM-DD');

        // update order_publisher table
        // also update order_publisher_book table from books
        // book: {book_id, quantity}
        // books: [{book_id, quantity}]
        const [result] = await connection.query(
            `INSERT INTO order_publisher (pu_order_status, pu_order_time, username, pu_id) VALUES (?, ?, ?, ?)`,
            [pu_order_status, pu_order_time_change, username, pu_id]
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

const getUserInfo = async (req, res) => {
    try {
        // get user info from customer table to get bank_acc and address
        const { username } = req.params;
        const [rows] = await connection.query(
            `SELECT * FROM customer WHERE username = ?`,
            [username]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error in getUserInfo:', error);
        res.status(500).json({ message: error.message });
    }
}




// -- API for related to notifications



const getEmployeeNotifications = async (req, res) => {
    try{
        const {notifications} = await connection.query(
            `
            SELECT 
                n.* 
                CASE
                    WHEN n.notification_type = 'LowStock' THEN
                        (SELECT title from BOOK where book_id = n.reference_id)
                    
                    WHEN n.notification_type in ('NewOrder', 'StockWarning') THEN
                        CONCAT('ORDER #', n.reference_id)
                    ELSE NULL
                END as reference_name
        
            FROM NOTIFICATION n
            ORDER BY 
                CASE priority 
                    WHEN 'High' THEN 1
                    WHEN 'Medium' THEN 2
                    WHEn 'Low' THEN 3
                END,
                create_at DESC
            ` 
        );
        const groupedNotifications = notifications.reduce((acc, notification) => {
            const date = new Date(notification.create_at).toLocaleDateString();
            if (!acc[date]){
                acc[date] = {
                    read: [],
                    unread: []
                };
            }
            if (notification.is_read){
                acc[date].read.push(notification);
            }else{
                acc[date].unread.push(notification);
            }
            return acc;
        }, {});


        res.status(200).json({
            success:true,
            notifications: groupedNotifications,
            total_count: notifications.length,
            unread_count: notifications.filter(n => !n.is_read).length
        });
    }catch(error){
        console.log("Error in getEmployeeNotifications: ", error);
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
};

const getEmployeeUnreadNotifications   = async (req, res) => {
    try{
        const {notifications} = await connection.query(
            `
            SELECT 
                n.* 
                CASE
                    WHEN n.notification_type = 'LowStock' THEN
                        (SELECT title from BOOK where book_id = n.reference_id)
                    
                    WHEN n.notification_type in ('NewOrder', 'StockWarning') THEN
                        CONCAT('ORDER #', n.reference_id)
                    ELSE NULL
                END as reference_name
        
            FROM NOTIFICATION n
            WHERE is_read = false
            ORDER BY 
                CASE priority 
                    WHEN 'High' THEN 1
                    WHEN 'Medium' THEN 2
                    WHEn 'Low' THEN 3
                END,
                create_at DESC
            ` 
        );
        res.status(200).json({
            success:true,
            notifications,
            unread_count: notifications.length
        });
    }catch(error){
        console.error("Error in getEmployeeUnreadNotifications: ", error);
        res.status(500).json({
            success:false,
            message: error.message
        });
    };
};


const getCustomerNotifications  = async (req, res) => {
    try{
        const { username } = req.params;
        const [orders] = await connection.query(
            `
            SELECT order_id FROM \`ORDER\`  WHERE username = ?
            `, [username]
        );
        if (orders.length === 0){
            return res.status(200).json({
                success:true,
                notifications: {},
                total_count: 0,
                unread_count: 0
            });
        } 

        const orderIds = orders.map(order => order.order_id)
        const [notifications] = await  connection.query(
            `
            SELECT 
                n.*
                CASE 
                    WHEN n.notification_type IN ('NewOrder', 'StockWarning') THEN 
                        CONCAT('Order #', n.reference_id)
                    ELSE NULL
                END as reference_name,
                o.order_status as current_order_status
            FROM NOTIFICATION n
            LEFT JOIN \`ORDER\` o ON n.reference_id = o.order_id
            WHERE n.reference_id IN (?)
            AND n.notification_type IN ('NewOrder', 'StockWarning', 'OrderStatus')
            ORDER BY n.create_at DESC
            `,[orderIds]
        );
        const groupedNotifications = notifications.reduce((acc, notification) => {
            const date = new Date(notification.create_at).toLocaleDateString();
            if (!acc[date]){
                acc[date] = {
                    read: [],
                    unread: []
                };
            }
            if (notification.is_read){
                acc[date].read.push(notification)
            }else{
                acc[date].unread.push(notification)
            }
            return acc;
        },{});
        res.status(200).json({
            success:true,
            notifications: groupedNotifications,
            total_count: notifications.length,
            unread_count: notifications.filter(n => !n.is_read).length
        })
    }catch(error){
        console.error("Error in getCustomerNotifications: ", error);
        res.status(500).json({
            success:false,
            message: error.message
        });
    };
};


const getCustomerUnreadNotifications   = async (req, res) => {
    try{
        const { username } = req.params;
        const [orders] = await connection.query(
            `
            SELECT order_id FROM \`ORDER\`  WHERE username = ?
            `, [username]
        );
        if (orders.length === 0){
            return res.status(200).json({
                success:true,
                notifications: {},
                total_count: 0,
                unread_count: 0
            });
        } 

        const orderIds = orders.map(order => order.order_id)
        const [notifications] = await  connection.query(
            `
            SELECT 
                n.*
                CASE 
                    WHEN n.notification_type IN ('NewOrder', 'StockWarning') THEN 
                        CONCAT('Order #', n.reference_id)
                    ELSE NULL
                END as reference_name,
                o.order_status as current_order_status
            FROM NOTIFICATION n
            LEFT JOIN \`ORDER\` o ON n.reference_id = o.order_id
            WHERE n.reference_id IN (?)
            AND n.notification_type IN ('NewOrder', 'StockWarning', 'OrderStatus')
            AND n.is_read = false
            ORDER BY n.create_at DESC
            `,[orderIds]
        );
        const groupedNotifications = notifications.reduce((acc, notification) => {
            const date = new Date(notification.create_at).toLocaleDateString();
            if (!acc[date]){
                acc[date] = {
                    read: [],
                    unread: []
                };
            }
            if (notification.is_read){
                acc[date].read.push(notification)
            }else{
                acc[date].unread.push(notification)
            }
            return acc;
        },{});
        res.status(200).json({
            success:true,
            notifications: groupedNotifications,
            total_count: notifications.length,
            unread_count: notifications.filter(n => !n.is_read).length
        })
    }catch(error){
        console.error("Error in getCustomerNotifications: ", error);
        res.status(500).json({
            success:false,
            message: error.message
        });
    };
};

const markNotificationAsRead = async (req, res) => {
    try{
        const {notification_id} = req.params;
        const {username, user_type} = req.body;
        if (user_type === 'customer'){
            const [orders]  = await connection.query(
                `SELECT order_id FROM \`ORDER\` WHERE username = ? `, [username]
            )
            const orderIds = orders.map(order => order.order_id);
            const [notification] = await connection.query(
                `SELECT reference_id FROM NOTIFICATION WHERE notification_id = ?`, [notification_id]
            )
            if (!notification || !orderIds.includes(notification[0].reference_id)){
                return res.status(403).json({
                    success: false,
                    message: "Inside markNotificationAsRead, has no authorization to this access"
                });
            }
        }

        const [result] = await connection.query(
            `UPDATE NOTIFICATION SET is_read = true WHERE notification_id = ?`, [notification_id]
        );

        if (result.affectedRows === 0){
            return res.status(404).json({
                success: false,
                message: "Notification not found!"
            })
        };

        res.status(200).json({
            success: true,
            message: "Notification marked as read successfully!"
        });
    }catch(error){
        console.error('Error in markNotificationAsRead: ', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteNotification = async (req, res) => {
    try{
        const {notification_id} = req.params;
        const {username, user_type} = req.body;
        if (user_type === 'customer'){
            const [orders]  = await connection.query(
                `SELECT order_id FROM \`ORDER\` WHERE username = ? `, [username]
            )
            const orderIds = orders.map(order => order.order_id);
            const [notification] = await connection.query(
                `SELECT reference_id FROM NOTIFICATION WHERE notification_id = ?`, [notification_id]
            )
            if (!notification || !orderIds.includes(notification[0].reference_id)){
                return res.status(403).json({
                    success: false,
                    message: "Inside markNotificationAsRead, has no authorization to this access"
                });
            }
        }
        const [result] = await connection.query(
            `DELETE FROM NOTIFICATION WHERE notification_id = ?`, []
        )
    }catch(error){

    }
}




// -- hàm này retrieve hết order logs với name của user, và được sắp xếp theo thứ tự. Hàm này cũng trả về thông tin employee tac động vào
const getAllOrderLogs = async(req, res) => {
    try{
        const [logs] = await connection.query(
            `SELECT
                l.*,
                u.name as action_by_name,
                o.username as order_username
            FROM ORDER_ACTION_LOG l
            LEFT JOIN USER u ON l.action_by = u.username
            LEFT JOIN \`ORDER\` o ON l.order_id = o.order_id
            ORDER BY l.action_timestamp DESC
            `
        );
        res.status(200).json(logs);
    }catch(error){
        console.error("Error in getAllOrderLogs: ", error);
        res.status(500).json({message:error.message});
    }
}


// this function will get the logs for a specific order
const getOrderLogs = async (req, res) => {
    try{
        const {order_id} = req.params;
        const {logs} = await connection.query(
            `
            SELECT 
                l.*,
                u.name as action_by_name
            FROM ORDER_ACTION_LOG l
            LEFT JOIN USER u ON l.action_by = u.username
            WHERE l.order_id = ?
            ORDER BY l.action_timestamp DESC
            `, [order_id] 
        )

        if (logs.length === 0){
            return res.status(404).json({
                success:false,
                message: "No logs found for this order!"
            });
        };
        res.status(200).json({
            success:true,
            order_id,
            logs
        });
    }catch(error){
        console.error('Error in getOrderLogs:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    };
};
// this function will get the logs for a specific customers
const getCustomerOrderLogs = async (req, res) => {
    try{
        const {username} = req.params;
        const {logs} = await connection.query(
            `SELECT 
                l.*,
                u.name as action_by_name,
                o.order_status as current_status
            FROM ORDER_ACTION_LOG l
            JOIN \`ORDER\` o ON  l.order_id = o.order_id
            LEFT JOIN USER u on l.action_by = u.username
            WHERE o.username = ?,
            ORDER BY l.action_timestamp DESC  
            `, [username]
        )
        if (logs.length === 0){
            return res.status(404).json({
                success:false,
                message:"No order logs not found for this customer"
            });
        }

        const groupedLogs = logs.reduce((acc,log) => {
            if (!acc[log.order_id]){
                acc[log.order_id] = {
                    order_id: log.order_od,
                    current_status: log.current_status,
                    logs: []
                }
            };
            acc[log.order_id].logs.push({
                log_id: log.log_id,
                action_type: log.action_type,
                old_status: log.old_status,
                new_status: log.new_status,
                action_note: log.action_note,
                action_by: log.action_by,
                action_by_name: log.action_by_name,
                action_timestamp: log.action_timestamp
            });
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            username,
            orders: Object.values(groupedLogs)
        })
    }catch(error){
        console.error("Error in getCustomerOrderLogs: ", error);
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
}


const  getOrderStatusHistory = async (req, res) => {
    try{
        const {order_id} = req.params;
        const {logs} = await connection.query(
            `
            SELECT
                l.log_id,
                l.old_status,
                l.new_status,
                l.action_timestamp,
                l.action_note,
                u.name as changed_by_name,
                u.username as change_by_username
            FROM ORDER_ACTION_LOG l
            LEFT JOIN USER u ON l.action_by = u.username
            WHERE l.order_id = ? AND l.action_type = 'StatusChanged'
            ORDER BY l.action_timestamp ASC 
            `[order_id]
        )
        if (logs.length === 0){
            return res.status(404).json({
                success: false,
                message: 'No status change in the history found for this order'
            });
        }

        res.status(200).json({
            success:true,
            order_id,
            status_history: logs
        })

    }catch(error){
        console.error('Error in getOrderStatusHistory:', error);
        return res.status(500).json({
            success:false,
            message: error.message
        })
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
    getOrders,
    getGenres,
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
    updatePublisherOrderStatus,
    createOrderPublisher,
    getOrder,
    showAllBookInCart,
    updateOrderBookQuantity,
    deleteOrderBook,
    insertAlreadyInCart,
    getPublisherOrder,
    getUserInfo,
    updateOrderStatus,

    // getNotifications,
    // getUnreadNotifications,
    markNotificationAsRead,
    deleteNotification,
    // getNotificationCount,
    getAllOrderLogs,
    getOrderLogs,
    getCustomerOrderLogs,
    getOrderStatusHistory
};