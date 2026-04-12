import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Candidate from '@/lib/models/Candidate';

// GET /api/candidates - Get all candidates
export async function GET() {
  try {
    await connectToDatabase();
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    return NextResponse.json(candidates, { status: 200 });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}

// POST /api/candidates - Create a new candidate
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const { firstName, lastName, email, phone, resumeUrl, linkedInUrl, notes } = body;

    // Check if candidate with email already exists
    const existingCandidate = await Candidate.findOne({ email });
    if (existingCandidate) {
      return NextResponse.json(
        { error: 'Candidate with this email already exists' },
        { status: 409 }
      );
    }

    const candidate = await Candidate.create({
      firstName,
      lastName,
      email,
      phone,
      resumeUrl,
      linkedInUrl,
      notes,
    });

    return NextResponse.json(candidate, { status: 201 });
  } catch (error) {
    console.error('Error creating candidate:', error);
    return NextResponse.json(
      { error: 'Failed to create candidate' },
      { status: 500 }
    );
  }
}