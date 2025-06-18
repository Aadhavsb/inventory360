import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Asset from '@/lib/models/Asset';
import mongoose from 'mongoose';

export async function GET() {
  try {
    console.log('Debug endpoint - Testing Mongoose connection...');
    console.log('Environment variables check:');
    console.log('- MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- URI format check (first 20 chars):', process.env.MONGODB_URI?.substring(0, 20));
    
    await connectToDatabase();
    console.log('Mongoose connected successfully');
    
    // Test database operations
    const assetsCount = await Asset.countDocuments();
    console.log('Assets count:', assetsCount);
    
    // Test inserting a dummy document
    const testAsset = new Asset({
      name: 'Debug Test Asset',
      type: 'medical',
      status: 'active',
      acquired: 'donated',
      date: new Date(),
      site: 'Debug Center'
    });
    
    const savedTest = await testAsset.save();
    console.log('Test asset created:', savedTest._id);
    
    // Clean up the test document
    await Asset.findByIdAndDelete(savedTest._id);
    console.log('Test asset cleaned up');
    
    return NextResponse.json({
      success: true,
      message: 'Mongoose connection and operations successful',
      environment: process.env.NODE_ENV,
      assetsCount,
      testInsertId: savedTest._id,
      uriFormat: process.env.MONGODB_URI?.substring(0, 20),
      mongooseVersion: mongoose.version,
      connectionState: mongoose.connection.readyState // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
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
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      mongooseVersion: mongoose.version,
      connectionState: mongoose.connection.readyState
    }, { status: 500 });
  }
}
