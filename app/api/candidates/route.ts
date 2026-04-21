import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Candidate from '@/lib/models/Candidate';

export async function GET() {
  try {
    await connectToDatabase();
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    return NextResponse.json(candidates, { status: 200 });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const {
      firstName, lastName, email, phone,
      jobTitle, location, linkedInUrl, portfolioUrl, githubUrl,
      resumeUrl, skills, experience, education, notes, status,
    } = body;

    const existing = await Candidate.findOne({ email: email?.toLowerCase?.() });
    if (existing) {
      return NextResponse.json(
        { error: 'A candidate with this email already exists' },
        { status: 409 },
      );
    }

    // skills arrives as a comma-separated string from the form — convert to array
    const skillsArray: string[] = Array.isArray(skills)
      ? skills
      : typeof skills === 'string' && skills.trim()
        ? skills.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];

    const candidate = await Candidate.create({
      firstName, lastName, email, phone,
      jobTitle, location, linkedInUrl, portfolioUrl, githubUrl,
      resumeUrl, skills: skillsArray, experience, education, notes, status,
    });

    return NextResponse.json(candidate, { status: 201 });
  } catch (error) {
    console.error('Error creating candidate:', error);
    return NextResponse.json({ error: 'Failed to create candidate' }, { status: 500 });
  }
}
