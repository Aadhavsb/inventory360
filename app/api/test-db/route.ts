import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('Environment check - MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    const client = await clientPromise;
    console.log('MongoDB client connected successfully');
    
    const db = client.db('Inventory360');
    console.log('Database instance obtained');
    
    // Test database connection by listing collections
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.map(c => c.name));
    
    // Test a simple insert and delete
    const testResult = await db.collection('test').insertOne({ 
      test: true, 
      timestamp: new Date() 
    });
    console.log('Test insert successful:', testResult.insertedId);
    
    // Clean up test document
    await db.collection('test').deleteOne({ _id: testResult.insertedId });
    console.log('Test cleanup successful');
    
    return NextResponse.json({ 
      success: true,
      message: 'MongoDB connection test passed',
      collections: collections.map(c => c.name),
      testInsertId: testResult.insertedId
    });
    
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : 'No stack trace'
    }, { status: 500 });
  }
}
