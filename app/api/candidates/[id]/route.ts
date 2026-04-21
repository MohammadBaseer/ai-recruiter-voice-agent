import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Candidate from '@/lib/models/Candidate';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }
    return NextResponse.json(candidate, { status: 200 });
  } catch (error) {
    console.error('Error fetching candidate:', error);
    return NextResponse.json({ error: 'Failed to fetch candidate' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { id } = await params;

    // skills arrives as comma-separated string from the form — convert to array
    if (typeof body.skills === 'string') {
      body.skills = body.skills.trim()
        ? body.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];
    }

    const candidate = await Candidate.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }
    return NextResponse.json(candidate, { status: 200 });
  } catch (error) {
    console.error('Error updating candidate:', error);
    return NextResponse.json({ error: 'Failed to update candidate' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const candidate = await Candidate.findByIdAndDelete(id);
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Candidate deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return NextResponse.json({ error: 'Failed to delete candidate' }, { status: 500 });
  }
}
