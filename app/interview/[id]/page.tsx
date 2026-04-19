import type { Metadata } from "next";
import InterviewJoinClient from "./InterviewJoinClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Join Interview · RecruiterAI",
  description: "Join your AI-powered screening interview.",
};

export default async function InterviewJoinPage({ params }: PageProps) {
  const { id } = await params;
  return <InterviewJoinClient interviewId={id} />;
}
