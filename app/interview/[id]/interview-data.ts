export interface InterviewData {
  id: string;
  title: string;
  role: string;
  company: string;
  duration: number;
  instructions: string[];
  status: "active" | "expired" | "completed";
}

const MOCK_INTERVIEWS: Record<string, InterviewData> = {
  "int-001": {
    id: "int-001",
    title: "Technical Screening Interview",
    role: "Senior Frontend Developer",
    company: "Acme Corp",
    duration: 45,
    instructions: [
      "Ensure you have a stable internet connection",
      "Find a quiet, distraction-free environment",
      "Speak clearly and at a comfortable, natural pace",
      "Have a glass of water nearby",
      "The AI interviewer will guide you through each question",
    ],
    status: "active",
  },
  "int-002": {
    id: "int-002",
    title: "Initial Screening Call",
    role: "Product Manager",
    company: "TechVentures Inc.",
    duration: 30,
    instructions: [
      "Ensure you have a stable internet connection",
      "Find a quiet, distraction-free environment",
      "Be ready to discuss your past experience",
      "Have your resume handy for reference",
    ],
    status: "active",
  },
  "int-003": {
    id: "int-003",
    title: "Culture Fit Interview",
    role: "UX Designer",
    company: "DesignStudio",
    duration: 60,
    instructions: [
      "Ensure you have a stable internet connection",
      "Find a quiet, distraction-free environment",
      "Prepare a few examples of past projects to discuss",
      "Speak naturally — this is a conversational interview",
    ],
    status: "active",
  },
  "int-expired": {
    id: "int-expired",
    title: "Expired Interview",
    role: "Engineer",
    company: "OldCo",
    duration: 30,
    instructions: [],
    status: "expired",
  },
};

/**
 * Fetch interview data by ID.
 * Replace the mock implementation with a real API call:
 *   const res = await fetch(`/api/interviews/${id}/public`);
 *   return res.ok ? res.json() : null;
 */
export async function getInterviewData(id: string): Promise<InterviewData | null> {
  await new Promise((r) => setTimeout(r, 1000));
  return MOCK_INTERVIEWS[id] ?? null;
}

export interface SessionStartPayload {
  interviewId: string;
  candidateName: string;
}

/**
 * Initialize an interview session.
 * Replace mock with:
 *   const res = await fetch(`/api/interview-sessions`, { method: "POST", body: JSON.stringify(payload) });
 *   return res.json();
 */
export async function startInterviewSession(payload: SessionStartPayload): Promise<{ sessionId: string }> {
  await new Promise((r) => setTimeout(r, 1500));
  return { sessionId: `session-${Date.now()}` };
}
