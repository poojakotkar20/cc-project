const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.warn('⚠️  MONGODB_URI environment variable is not defined!');
      console.warn('⚠️  Database operations will fail until MONGODB_URI is provided in .env or Render environment variables.');
      return false;
    }

    console.log('🔄 Attempting to connect to MongoDB Atlas...');
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout fast if cluster is unreachable
    });

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Atlas Connection Error: ${error.message}`);
    return false;
  }
};

const getDBStatus = () => {
  const states = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };
  const stateCode = mongoose.connection.readyState;
  return {
    stateCode,
    status: states[stateCode] || 'Unknown',
    isConnected: stateCode === 1,
    host: mongoose.connection.host || null,
    dbName: mongoose.connection.name || null,
  };
};

module.exports = { connectDB, getDBStatus };
