import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Debug endpoint - Testing MongoDB connection...');
    console.log('Environment variables check:');
    console.log('- MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- URI format check (first 20 chars):', process.env.MONGODB_URI?.substring(0, 20));
    console.log('- URI contains ssl params:', process.env.MONGODB_URI?.includes('ssl=true'));
    console.log('- URI contains retryWrites:', process.env.MONGODB_URI?.includes('retryWrites'));
    console.log('- URI contains w=majority:', process.env.MONGODB_URI?.includes('w=majority'));
    
    const client = await clientPromise;
    console.log('MongoDB client connected successfully');
    
    const db = client.db('Inventory360');
    console.log('Database instance obtained');
    
    // Test a simple operation
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.map(c => c.name));
    
    // Test inserting a dummy document
    const testResult = await db.collection('debug').insertOne({
      test: true,
      timestamp: new Date(),
      environment: process.env.NODE_ENV
    });
    console.log('Test insert successful:', testResult.insertedId);
    
    // Clean up the test document
    await db.collection('debug').deleteOne({ _id: testResult.insertedId });
    console.log('Test document cleaned up');
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection and operations successful',
      environment: process.env.NODE_ENV,
      collections: collections.map(c => c.name),
      testInsertId: testResult.insertedId,
      uriFormat: process.env.MONGODB_URI?.substring(0, 20),
      hasSslParams: process.env.MONGODB_URI?.includes('ssl=true') || process.env.MONGODB_URI?.includes('tls=true')
    });
    
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      environment: process.env.NODE_ENV,
      mongoUriExists: !!process.env.MONGODB_URI,
      uriFormat: process.env.MONGODB_URI?.substring(0, 20),
      hasSslParams: process.env.MONGODB_URI?.includes('ssl=true') || process.env.MONGODB_URI?.includes('tls=true'),
      errorType: error instanceof Error ? error.constructor.name : typeof error
    }, { status: 500 });
  }
}
