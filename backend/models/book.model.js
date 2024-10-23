const {client} = require('../config/db.config');
const getBookCollection = (client) => {
    return client.db('BookInventory').collection("books");
};

module.exports = { getBookCollection };