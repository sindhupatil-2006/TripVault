const mongoose = require('mongoose');

const DEFAULT_ATLAS_URI = 'mongodb+srv://sindhupatil3101_db_user:TripVault2026%21@cluster0.scwsucw.mongodb.net/tripvault?retryWrites=true&w=majority';

const connectDB = async () => {
  const rawUri = process.env.MONGODB_URI || process.env.MONGO_URI || DEFAULT_ATLAS_URI;
  const mongoUri = rawUri ? rawUri.trim() : DEFAULT_ATLAS_URI;

  try {
    const conn = await mongoose.connect(mongoUri, {
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
