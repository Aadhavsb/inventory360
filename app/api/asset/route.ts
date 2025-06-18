import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Asset from '@/lib/models/Asset';
import { assetSchema } from '@/lib/validation';

export async function GET() {
  try {
    await connectToDatabase();
    const assets = await Asset.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ assets });
  } catch (error) {
    console.error('Error in GET /api/asset:', error);
    
    // Check if it's a MongoDB connection issue
    if (error instanceof Error && (
      error.message.includes('MongoServerSelectionError') ||
      error.message.includes('ENOTFOUND') ||
      error.message.includes('ssl3_read_bytes') ||
      error.message.includes('tlsv1 alert')
    )) {
      return NextResponse.json({ 
        error: 'Database is currently unavailable. Please try again later.',
        type: 'database_unavailable'
      }, { status: 503 });
    }
    
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  console.log('POST /api/asset - Starting request processing');
  console.log('Environment check - MONGODB_URI exists:', !!process.env.MONGODB_URI);
  console.log('Environment check - NODE_ENV:', process.env.NODE_ENV);
  
  try {
    console.log('Step 1: Parsing request body...');
    const data = await req.json();
    console.log('Received data:', JSON.stringify(data, null, 2));
    
    console.log('Step 2: Validating data with schema...');
    const parse = assetSchema.safeParse(data);
    if (!parse.success) {
      console.log('Validation failed:', JSON.stringify(parse.error.errors, null, 2));
      return NextResponse.json({ 
        error: 'Invalid asset data', 
        details: parse.error.errors 
      }, { status: 400 });
    }
    console.log('Validation passed, validated data:', JSON.stringify(parse.data, null, 2));
    
    console.log('Step 3: Connecting to database...');
    await connectToDatabase();
    console.log('Database connected successfully');
    
    console.log('Step 4: Creating asset document...');
    const asset = new Asset(parse.data);
    
    console.log('Step 5: Saving to database...');
    const savedAsset = await asset.save();
    console.log('Asset saved successfully with ID:', savedAsset._id);
    
    return NextResponse.json({ 
      success: true,
      insertedId: savedAsset._id,
      asset: savedAsset
    });
  } catch (error) {
    console.error('ERROR in POST /api/asset:');
    console.error('Error type:', typeof error);
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Full error object:', error);
    
    // Check if it's a MongoDB connection issue
    if (error instanceof Error && (
      error.message.includes('MongoServerSelectionError') ||
      error.message.includes('ENOTFOUND') ||
      error.message.includes('ssl3_read_bytes') ||
      error.message.includes('tlsv1 alert')
    )) {
      return NextResponse.json({ 
        error: 'Database is currently unavailable. Please try again later.',
        type: 'database_unavailable'
      }, { status: 503 });
    }
    
    // Check for validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.message,
        type: 'validation_error'
      }, { status: 400 });
    }
    
    // Return more detailed error information
    return NextResponse.json({ 
      error: 'Failed to add asset', 
      details: error instanceof Error ? error.message : 'Unknown error',
      type: 'server_error'
    }, { status: 500 });
  }
}
