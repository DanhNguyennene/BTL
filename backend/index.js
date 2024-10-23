const express = require('express');
const cors = require('cors');
const { client } = require('./config/db.config');
const { initBookCollection } = require('./models/book.model');
const bookRoutes = require('./routes/book.routes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/books', bookRoutes);

const startServer = async () => {
    try {
        await client.connect();
        
        
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();