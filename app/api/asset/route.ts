import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Asset from '@/lib/models/Asset';
import { assetFormSchema, loggedByFieldSchema } from '@/lib/validation';
import { generateAssetId } from '@/lib/assetId';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Build filter from query params
    const { searchParams } = new URL(req.url);
    const department = searchParams.get('department');
    const category = searchParams.get('category');
    const site = searchParams.get('site');

    const filter: Record<string, string> = {};
    if (department) filter.department = department;
    if (category) filter.category = category;
    if (site) filter.site = site;

    const assets = await Asset.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ assets });
  } catch (error) {
    console.error('Error in GET /api/asset:', error);

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
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({
        error: 'Unauthorized - Please log in to add assets',
        type: 'unauthorized'
      }, { status: 401 });
    }

    const data = await req.json();

    // Validate form data with discriminated union
    const parse = assetFormSchema.safeParse(data);
    if (!parse.success) {
      console.log('Validation failed:', JSON.stringify(parse.error.errors, null, 2));
      return NextResponse.json({
        error: 'Invalid asset data',
        details: parse.error.errors
      }, { status: 400 });
    }

    // Validate loggedBy separately (discriminatedUnion doesn't support .extend)
    const loggedBy = {
      name: session.user.name || session.user.email?.split('@')[0] || 'Unknown User',
      email: session.user.email || 'unknown@email.com',
    };
    const loggedByParse = loggedByFieldSchema.safeParse(loggedBy);
    if (!loggedByParse.success) {
      return NextResponse.json({
        error: 'Invalid user session data',
        details: loggedByParse.error.errors,
      }, { status: 400 });
    }

    await connectToDatabase();

    // Generate unique asset ID
    const assetId = await generateAssetId(parse.data.site, parse.data.department);

    const asset = new Asset({
      ...parse.data,
      assetId,
      loggedBy: loggedByParse.data,
    });

    const savedAsset = await asset.save();

    return NextResponse.json({
      success: true,
      insertedId: savedAsset._id,
      asset: savedAsset,
    });
  } catch (error) {
    console.error('ERROR in POST /api/asset:', error);

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

    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({
        error: 'Validation failed',
        details: error.message,
        type: 'validation_error'
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Failed to add asset',
      details: error instanceof Error ? error.message : 'Unknown error',
      type: 'server_error'
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({
        error: 'Unauthorized - Please log in to update assets',
        type: 'unauthorized'
      }, { status: 401 });
    }

    const data = await req.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({
        error: 'Asset ID is required for updates',
        type: 'validation_error'
      }, { status: 400 });
    }

    // Validate form data
    const parse = assetFormSchema.safeParse(updateData);
    if (!parse.success) {
      console.log('Validation failed:', JSON.stringify(parse.error.errors, null, 2));
      return NextResponse.json({
        error: 'Invalid asset data',
        details: parse.error.errors
      }, { status: 400 });
    }

    const loggedBy = {
      name: session.user.name || session.user.email?.split('@')[0] || 'Unknown User',
      email: session.user.email || 'unknown@email.com',
    };

    await connectToDatabase();

    const updatedAsset = await Asset.findByIdAndUpdate(
      id,
      { ...parse.data, loggedBy },
      { new: true, runValidators: true }
    );

    if (!updatedAsset) {
      return NextResponse.json({
        error: 'Asset not found',
        type: 'not_found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      updatedId: updatedAsset._id,
      asset: updatedAsset,
    });
  } catch (error) {
    console.error('ERROR in PUT /api/asset:', error);

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

    return NextResponse.json({
      error: 'Failed to update asset',
      details: error instanceof Error ? error.message : 'Unknown error',
      type: 'server_error'
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({
        error: 'Unauthorized',
        type: 'unauthorized'
      }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        error: 'Asset ID is required',
        type: 'validation_error'
      }, { status: 400 });
    }

    await connectToDatabase();

    const deleted = await Asset.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({
        error: 'Asset not found',
        type: 'not_found'
      }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('ERROR in DELETE /api/asset:', error);
    return NextResponse.json({
      error: 'Failed to delete asset',
      details: error instanceof Error ? error.message : 'Unknown error',
      type: 'server_error'
    }, { status: 500 });
  }
}
