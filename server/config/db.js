const mongoose = require('mongoose');

// Disable query buffering so Mongoose never hangs HTTP requests for 10s when connecting
mongoose.set('bufferCommands', false);

const DEFAULT_ATLAS_URI = 'mongodb+srv://sindhupatil3101_db_user:TripVault2026%21@cluster0.scwsucw.mongodb.net/tripvault?retryWrites=true&w=majority';

let isConnecting = false;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (isConnecting) {
    return false;
  }

  isConnecting = true;
  const rawUri = process.env.MONGODB_URI || process.env.MONGO_URI || DEFAULT_ATLAS_URI;
  const mongoUri = rawUri ? rawUri.trim() : DEFAULT_ATLAS_URI;

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    isConnecting = false;
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    isConnecting = false;
    return false;
  }
};

module.exports = connectDB;
