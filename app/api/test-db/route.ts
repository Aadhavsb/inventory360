import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    console.log('Testing Mongoose connection...');
    console.log('Environment check - MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    await dbConnect();
    console.log('Mongoose connected successfully');
    
    const dbName = mongoose.connection.db?.databaseName;
    console.log('Connected to database:', dbName);
    
    // Test database connection by getting connection state
    const connectionState = mongoose.connection.readyState;
    const stateNames = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    console.log('Connection state:', stateNames[connectionState] || 'unknown');
    
    // Test a simple operation - create a temporary collection and document
    const TestSchema = new mongoose.Schema({
      test: Boolean,
      timestamp: Date
    });
    
    const TestModel = mongoose.models.Test || mongoose.model('Test', TestSchema);
    
    const testDoc = await TestModel.create({ 
      test: true, 
      timestamp: new Date() 
    });
    console.log('Test document created:', testDoc._id);
    
    // Clean up test document
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('Test cleanup successful');
    
    return NextResponse.json({ 
      success: true,
      message: 'Mongoose connection test passed',
      database: dbName,
      connectionState: stateNames[connectionState],
      testDocumentId: testDoc._id
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
