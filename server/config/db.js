const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri || !mongoUri.trim()) {
    console.error('⚠️ WARNING: Neither MONGODB_URI nor MONGO_URI is defined in process.env.');
    console.error('Please configure MONGO_URI in your Render Web Service Environment settings.');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri.trim(), {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    return false;
  }
};

module.exports = connectDB;
