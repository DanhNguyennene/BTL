const connection = require('../config/database');

module.exports = {
    getAllBooks: async () => {
        try {
            const [rows] = await connection.query('SELECT * FROM book');
            return rows;
        } catch (error) {
            console.log(error);
        }
    },
    filterBook: async ({ title, minPrice, maxPrice, author_id, pu_id }) => {
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
            const [rows] = await connection.query('SELECT * FROM book WHERE book_id = ?', [book_id]);
            return rows.length ? rows[0] : null;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    createABook: async (title, price, author_id, pu_id) => {
        try {
            const [rows] = await connection.query('INSERT INTO book (title, price, author_id, pu_id) VALUE(?, ?, ?, ?)',
                [title, price, author_id, pu_id]);
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    updateABook: async (book_id, title, price, author_id, pu_id) => {
        try {
            const [rows] = await connection.query('UPDATE book SET title = ?, price = ?, author_id = ?, pu_id = ? WHERE book_id = ?', [title, price, author_id, pu_id, book_id]);
            if (rows.affectedRows === 0) {
                return false;
            } else {
                return true;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    deleteABook: async (book_id) => {
        try {
            const [rows] = await connection.query('DELETE FROM book WHERE book_id = ?', [book_id]);
            console.log(rows);
            if (rows.affectedRows === 0) {
                return false;
            }
            else {
                return true;
            }
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
    }
}