import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { WithId, Document } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { assetSchema } from '@/lib/validation';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const assets = await db.collection('assets').find({}).toArray() as WithId<Document>[];
    return NextResponse.json({ assets });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const parse = assetSchema.safeParse(data);
    if (!parse.success) {
      return NextResponse.json({ error: 'Invalid asset data', details: parse.error.errors }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('assets').insertOne(data);
    return NextResponse.json({ insertedId: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add asset' }, { status: 500 });
  }
}
