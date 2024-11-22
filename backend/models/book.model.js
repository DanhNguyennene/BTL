const { connections } = require('mongoose');
const connection = require('../config/database');
module.exports = {
    getBookTitles : async(searchItem) => {
        try{
            const [rows] = await connection.query(`
                SELECT title from BOOK WHERE title like ? LIMIT 10
            `, [`${searchItem}`])
            return rows.map(row => row.title)
        }catch(error){
            console.log(error);
            throw error;
        }
    },
    getAllBooks: async () => {
        try {
            const [rows] = await connection.query(`
                SELECT
                    b.*,
                    a.name AS authorName,
                    p.pu_name AS publisherName,
                    GROUP_CONCAT(g.gen_id) AS genreID,
                    GROUP_CONCAT(g.genre_name) AS genreName
                FROM 
                    BOOK b
                LEFT JOIN 
                    AUTHOR a ON b.author_id = a.author_id
                LEFT JOIN 
                    PUBLISHER p ON b.pu_id = p.pu_id
                LEFT JOIN 
                    BOOK_GENRE bg ON b.book_id = bg.book_id
                LEFT JOIN 
                    GENRE g ON bg.gen_id = g.gen_id
                GROUP BY
                    b.book_id, a.name, p.pu_name;
            `)
            return rows;
        } catch (error) {
            console.log(error);
        }
    },
    filterBook: async ({ title, minPrice, maxPrice, author_id, author_name, pu_id }) => {
        try {
            let query = 'SELECT * FROM book WHERE 1=1';
            const queryParams = [];

            if (title) {
                query += ' AND title LIKE ?';
                queryParams.push(`%${title}%`);
            }
            if (minPrice !== undefined && maxPrice !== undefined) {
                query += ' AND price BETWEEN ? AND ?';
                queryParams.push(minPrice, maxPrice);
            }
            if (author_id) {
                query += ' AND author_id = ?';
                queryParams.push(author_id);
            }
            if (author_name) {
                query += ' AND author_id IN (SELECT author_id FROM author WHERE name LIKE ?)';
                queryParams.push(`%${author_name}%`);
            }
            if (pu_id) {
                query += ' AND pu_id = ?';
                queryParams.push(pu_id);
            }

            const [rows] = await connection.query(query, queryParams);
            return rows;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    getBookByID: async (book_id) => {
        try {
            const [rows] = await connection.query(`
                SELECT
                    b.*,
                    a.name AS authorName,
                    p.pu_name AS publisherName,
                    GROUP_CONCAT(g.gen_id) AS genreID,
                    GROUP_CONCAT(g.genre_name) AS genreName
                FROM 
                    BOOK b
                LEFT JOIN 
                    AUTHOR a ON b.author_id = a.author_id
                LEFT JOIN 
                    PUBLISHER p ON b.pu_id = p.pu_id
                LEFT JOIN 
                    BOOK_GENRE bg ON b.book_id = bg.book_id
                LEFT JOIN 
                    GENRE g ON bg.gen_id = g.gen_id
                WHERE 
                    b.book_id = ?
                GROUP BY
                    b.book_id, a.name, p.pu_name
            `, [book_id])
            return rows.length ? rows[0] : null;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    createABook: async (title, price, author_id, pu_id, imageURL) => {
        try {
            if (!title || !price || !author_id || !pu_id) {
                throw new Error('Missing required fields');
            }
            console.log('Creating book with values:', {
                title,
                price,
                author_id,
                pu_id,
                imageURL
            });
            const [result] = await connection.query(
                'INSERT INTO BOOK (title, price, author_id, pu_id, imageURL) VALUES (?, ?, ?, ?, ?)',
                [title, price, author_id, pu_id, imageURL]
            );

            return {
                book_id: result.insertId,
                title,
                price,
                author_id,
                pu_id,
                imageURL
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    updateABook: async (book_id, title, price, author_id, pu_id, imageURL) => {
        try {
            const [rows] = await connection.query(
                'UPDATE book SET title = ?, price = ?, author_id = ?, pu_id = ?, imageURL = ? WHERE book_id = ?',
                [title, price, author_id, pu_id, imageURL, book_id]
            );
            return rows.affectedRows === 0 ? false : true;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    updateBookGenres : async (book_id, genres) => {
        try{
            await connection.query(
                'DELETE FROM book_genre where book_id = ?', [book_id]
            )
            if (genres.length > 0){
                const query = 'INSERT INTO book_genre (book_id, gen_id) VALUES ?';

                const values = genres.map(gen_id => [parseInt(book_id), gen_id]);
                console.log(values)
                await connection.query(query, [values]);
            }
            return true;
        }catch(error){
            console.log(error);
            return false;
        }
    },
    deleteABook: async (book_id) => {
        try {
            const [rows] = await connection.query('DELETE FROM book WHERE book_id = ?', [book_id]);
            console.log(rows);
            return rows.affectedRows === 0? false : true
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    deleteAllofBooks: async () => {
        try {
            await connection.query('DELETE FROM book');
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    createUserCustomer: async (userData) => {
        const connection_t = await require('../config/database').getConnection()
        try {
            const {username, name, phone_number, email, passw   , address, bank_acc} = userData;
            console.log("Received userData:", userData);
            console.log("Destructured values:", {username, name, phone_number, email, password, address, bank_acc});
            await connection_t.beginTransaction();
            
            const [existing] = await connection_t.query(
                'SELECT username FROM USER WHERE username = ?',
                [username]
            );
            
            if (existing.length > 0) {
                throw new Error("Username already exists!");
            }
            console.log("Inside createUserCustomer: ", username, name, phone_number, email, password)
            await connection_t.execute(
                `INSERT INTO USER (username, name, phone_number, email, password) 
                 VALUES (?, ?, ?, ?, ?)`,
                [username, name, phone_number, email, password]
            );
    
            await connection_t.execute(
                `INSERT INTO CUSTOMER (username, address, bank_acc) 
                 VALUES (?, ?, ?)`,
                [username, address, bank_acc]
            );
            
            await connection_t.commit();
            
            return {
                username,
                name,
                phone_number,
                email,
                address,
                bank_acc
            };
        } catch (error) {
            await connection_t.rollback();
            console.error("Database error:", error); 
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Username already exists!');
            }
            throw error;
        }
    },

    validUser: async (username, password) => {
        try{
            const [rows] = await connection.query(
                `SELECT 
                    u.*,
                    CASE
                        WHEN c.username IS NOT NULL THEN 'customer'
                        WHEN e.username IS NOT NULL THEN 'employee'
                    END as user_type
                FROM USER u
                LEFT JOIN CUSTOMER c ON u.username = c.username
                LEFT JOIN EMPLOYEE e ON u.username = e.username
                WHERE u.username = ?
                `, [username]
            );
            if (rows.length === 0){
                return null;
            }
            const isValid = rows[0].password === password;
            if (!isValid){
                return null;
            }
            return {
                username: rows[0].username,
                name: rows[0].name,
                email: rows[0].email,
                phone_number: rows[0].phone_number,
                user_type: rows[0].user_type
            };

        }catch(error){
            console.error('Error in validUser:', error);
            throw error;
        }
    }
}