const {MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const client = new MongoClient(
    process.env.MONGO_URI,
    {
        serverApi:{
            version: ServerApiVersion.v1,
            strict:true,
            deprecationErrors:true,
        }
    }
);
client.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });
const connectDB = async () => {
    try {
        await client.connect();
        console.log("Successfully connected to MongoDB!");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
module.exports = { client, connectDB };

