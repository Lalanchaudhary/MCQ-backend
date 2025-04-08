// db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    const MongoDb_Url = process.env.MongoDb_Url;
    await mongoose.connect(MongoDb_Url);
    console.log('MongoDB Atlas Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1); // Exit the app if the connection fails
  }
};

module.exports = connectDB;
