// backend/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  console.log('🔗 Connecting to MongoDB...');

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Optional: Handle MongoDB connection events
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠ MongoDB disconnected');
    });

  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    throw error; // Let server.js handle exit
  }
};

module.exports = connectDB;
