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
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('Received data:', data);
    
    const parse = assetSchema.safeParse(data);
    if (!parse.success) {
      console.log('Validation failed:', parse.error.errors);
      return NextResponse.json({ 
        error: 'Invalid asset data', 
        details: parse.error.errors 
      }, { status: 400 });
    }
      console.log('Validation passed, connecting to MongoDB...');
    const client = await clientPromise;
    const db = client.db('Inventory360');
    
    console.log('Inserting asset:', parse.data);
    const result = await db.collection('assets').insertOne(parse.data);
    
    console.log('Asset inserted successfully:', result.insertedId);
    return NextResponse.json({ insertedId: result.insertedId });
  } catch (error) {
    console.error('Error in POST /api/asset:', error);
    return NextResponse.json({ 
      error: 'Failed to add asset', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
