const connection = require('../config/database');

module.exports = {
    allBooks: async () => {
        try {
            const [rows] = await connection.query('SELECT * FROM book');
            return rows;
        } catch (error){
            console.log(error);
        }
    },
    getBookByID: async (id) => {
        try {
            const [rows] = await connection.query('SELECT * FROM book WHERE id = ?', [id]);
            return rows.length ? rows[0] : null;
        } catch (error) { 
            console.log(error);
            throw error;
        }
    }
}