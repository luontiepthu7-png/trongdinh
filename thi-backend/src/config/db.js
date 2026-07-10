const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Timeout in 2 seconds to trigger fallback if offline
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learts', {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`\x1b[32m[Database] MongoDB Connected: ${conn.connection.host}\x1b[0m`);
    process.env.USE_FALLBACK_DB = 'false';
  } catch (error) {
    console.error(`\x1b[31m[Database Error] Failed to connect to MongoDB:\x1b[0m`, error.message);
    process.env.USE_FALLBACK_DB = 'true';
    console.log(`\x1b[33m[Database Fallback] Activated JSON File Fallback DB under 'data/' directory. Server will function normally without MongoDB.\x1b[0m`);
  }
};

module.exports = connectDB;
