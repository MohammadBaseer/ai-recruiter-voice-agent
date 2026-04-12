import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Interview from '@/lib/models/Interview';

// GET /api/interviews - Get all interviews
export async function GET() {
  try {
    await connectToDatabase();
    const interviews = await Interview.find()
      .populate('candidate', 'firstName lastName email')
      .populate('job', 'title department')
      .sort({ scheduledAt: -1 });
    return NextResponse.json(interviews, { status: 200 });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interviews' },
      { status: 500 }
    );
  }
}

// POST /api/interviews - Create a new interview
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const {
      candidate,
      job,
      scheduledAt,
      status,
      transcript,
      score,
      feedback,
      recordingUrl,
      duration,
    } = body;

    const interview = await Interview.create({
      candidate,
      job,
      scheduledAt,
      status,
      transcript,
      score,
      feedback,
      recordingUrl,
      duration,
    });

    return NextResponse.json(interview, { status: 201 });
  } catch (error) {
    console.error('Error creating interview:', error);
    return NextResponse.json(
      { error: 'Failed to create interview' },
      { status: 500 }
    );
  }
}