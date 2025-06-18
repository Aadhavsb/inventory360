import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { WithId, Document } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { assetSchema } from '@/lib/validation';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('Inventory360');
    const assets = await db.collection('assets').find({}).toArray() as WithId<Document>[];
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
    
    console.log('Step 3: Connecting to MongoDB...');
    const client = await clientPromise;
    console.log('MongoDB client connected successfully');
    
    console.log('Step 4: Getting database instance...');
    const db = client.db('Inventory360');
    console.log('Database instance obtained');
    
    console.log('Step 5: Inserting document...');
    const result = await db.collection('assets').insertOne(parse.data);
    console.log('Asset inserted successfully with ID:', result.insertedId);
    
    return NextResponse.json({ 
      success: true,
      insertedId: result.insertedId 
    });
  } catch (error) {
    console.error('ERROR in POST /api/asset:');
    console.error('Error type:', typeof error);
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Full error object:', error);
    
    // Return more detailed error information
    return NextResponse.json({ 
      error: 'Failed to add asset', 
      details: {
        message: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.name : typeof error,
        stack: error instanceof Error ? error.stack : 'No stack trace available'
      }
    }, { status: 500 });
  }
}
