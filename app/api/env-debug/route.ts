import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const uri = process.env.MONGODB_URI;
    
    console.log('Raw URI value:', JSON.stringify(uri));
    console.log('URI exists:', !!uri);
    console.log('URI length:', uri?.length);
    console.log('URI starts with mongodb:', uri?.startsWith('mongodb'));
    console.log('URI first 20 chars:', uri?.substring(0, 20));
    console.log('URI has invisible chars:', uri !== uri?.trim());
    
    return NextResponse.json({
      uri_exists: !!uri,
      uri_length: uri?.length,
      uri_preview: uri?.substring(0, 30) + '...',
      starts_with_mongodb: uri?.startsWith('mongodb'),
      has_extra_whitespace: uri !== uri?.trim(),
      trimmed_length: uri?.trim().length
    });
    
  } catch (error) {
    console.error('Environment debug error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
