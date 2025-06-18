import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

if (!process.env.MONGODB_URI) {
  console.error('CRITICAL: MongoDB URI is missing from environment variables');
  throw new Error('Please add your MongoDB URI to .env.local');
}

console.log('Mongoose setup - URI exists:', !!uri);
console.log('Mongoose setup - NODE_ENV:', process.env.NODE_ENV);

declare global {
  var mongoose: {
    conn: typeof import('mongoose') | null;
    promise: Promise<typeof import('mongoose')> | null;
  }; // This must be a `var` and not a `let / const`
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    console.log('Mongoose: Using cached connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      family: 4, // Use IPv4, skip trying IPv6
    };

    console.log('Mongoose: Creating new connection');
    cached.promise = mongoose.connect(uri!, opts).then((mongoose) => {
      console.log('Mongoose: Connected successfully');
      return mongoose;
    }).catch((error) => {
      console.error('Mongoose connection failed:', error);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
