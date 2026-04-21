import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

// Lightweight schema — stores interview session results without requiring
// a matched Interview document (works with both real and mock interview IDs)
const ResultSchema = new mongoose.Schema(
  {
    interviewId: { type: String, required: true, index: true },
    candidateName: { type: String, required: true },
    role: String,
    company: String,
    duration: Number,
    completedAt: { type: Date, default: Date.now },
    transcript: [
      {
        role: { type: String, enum: ["ai", "user"] },
        text: String,
        ts: String,
      },
    ],
    questionCount: Number,
    answerCount: Number,
  },
  { timestamps: true }
);

const InterviewResult =
  mongoose.models.InterviewResult ??
  mongoose.model("InterviewResult", ResultSchema);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { interviewId, candidateName, role, company, duration, transcript } = body;

    if (!interviewId || !candidateName) {
      return NextResponse.json({ error: "interviewId and candidateName required" }, { status: 400 });
    }

    await connectToDatabase();

    const answerCount = (transcript as { role: string }[]).filter((m) => m.role === "user").length;
    const questionCount = (transcript as { role: string }[]).filter((m) => m.role === "ai").length;

    const result = await InterviewResult.create({
      interviewId,
      candidateName,
      role,
      company,
      duration,
      transcript,
      questionCount,
      answerCount,
    });

    return NextResponse.json({ id: result._id }, { status: 201 });
  } catch (err) {
    console.error("[interview-results] save error:", err);
    return NextResponse.json({ error: "Failed to save result" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const interviewId = req.nextUrl.searchParams.get("interviewId");
    await connectToDatabase();

    const query = interviewId ? { interviewId } : {};
    const results = await InterviewResult.find(query).sort({ createdAt: -1 }).limit(50);

    return NextResponse.json(results);
  } catch (err) {
    console.error("[interview-results] fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}
