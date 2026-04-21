import type { Metadata } from "next";
import InterviewSessionClient from "./InterviewSessionClient";
import { getInterviewData } from "../interview-data";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string }>;
}

export const metadata: Metadata = {
  title: "Interview in Progress · RecruiterAI",
};

export default async function InterviewSessionPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { name } = await searchParams;

  const interview = await getInterviewData(id);

  if (!interview || interview.status !== "active") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white text-center px-4">
        <div className="space-y-2">
          <p className="text-lg font-semibold">Invalid session</p>
          <p className="text-slate-400 text-sm">This interview link is expired or does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <InterviewSessionClient
      interviewId={id}
      candidateName={name ?? "Candidate"}
      interview={interview}
    />
  );
}
