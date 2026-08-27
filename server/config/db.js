const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri || !mongoUri.trim()) {
    console.error('CRITICAL DATABASE ERROR: MONGODB_URI/MONGO_URI environment variable is missing');
    throw new Error('MONGODB_URI/MONGO_URI environment variable is missing');
  }

  try {
    const conn = await mongoose.connect(mongoUri.trim(), {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

module.exports = connectDB;
