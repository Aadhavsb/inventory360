import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  console.error('CRITICAL: MongoDB URI is missing from environment variables');
  throw new Error('Please add your MongoDB URI to .env.local');
}

console.log('MongoDB setup - URI exists:', !!uri);
console.log('MongoDB setup - NODE_ENV:', process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };
  if (!globalWithMongo._mongoClientPromise) {
    console.log('Development: Creating new MongoDB client');
    client = new MongoClient(uri!);
    globalWithMongo._mongoClientPromise = client.connect();
  } else {
    console.log('Development: Reusing existing MongoDB client promise');
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  console.log('Production: Creating new MongoDB client');
  client = new MongoClient(uri!);
  clientPromise = client.connect();
}

// Add error handling to the client promise
clientPromise.catch(error => {
  console.error('MongoDB connection failed:', error);
  console.error('URI format check:', uri?.substring(0, 20) + '...');
});

export default clientPromise;
