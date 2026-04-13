import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import UserProfile from '@/lib/models/UserProfile';
import { userProfileSchema } from '@/lib/validation';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const profile = await UserProfile.findOne({ email: session.user.email });

    if (!profile) {
      return NextResponse.json({ profile: null });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = userProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid profile data', details: parsed.error.errors },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const profile = await UserProfile.findOneAndUpdate(
      { email: session.user.email },
      {
        email: session.user.email,
        name: session.user.name || session.user.email,
        centre: parsed.data.centre,
        department: parsed.data.department,
      },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Failed to save user profile:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
