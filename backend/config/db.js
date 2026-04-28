import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of hanging
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Atlas connection failed: ${error.message}`);
    console.log('Starting local in-memory MongoDB fallback...');
    
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(mongoUri);
      console.log(`Fallback MongoDB Connected: ${conn.connection.host} (In-Memory)`);
    } catch (fallbackError) {
      console.error(`Fallback Error: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
