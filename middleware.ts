import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const RATE_LIMIT = 60; // requests per minute
const WINDOW = 60 * 1000; // 1 minute
const ipCache = new Map();

export function middleware(req: NextRequest) {
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const entry = ipCache.get(ip) || { count: 0, start: now };

  if (now - entry.start > WINDOW) {
    entry.count = 1;
    entry.start = now;
  } else {
    entry.count++;
  }

  ipCache.set(ip, entry);

  if (entry.count > RATE_LIMIT) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
