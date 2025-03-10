import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const MONGODB_URI: string = process.env.MONGODB_URI;

if (!mongoose.connections[0].readyState) {
  mongoose.connect(MONGODB_URI);
}

async function connectDB() {
  try {
    if (mongoose.connections[0].readyState) {
      return mongoose;
    }

    return await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default connectDB; 