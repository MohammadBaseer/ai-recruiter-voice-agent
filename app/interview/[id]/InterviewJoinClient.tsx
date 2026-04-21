"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mic2,
  Clock,
  ArrowRight,
  Wifi,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  User,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type InterviewData,
  getInterviewData,
  startInterviewSession,
} from "./interview-data";

// ─── Types ─────────────────────────────────────────────────────────────────

type PageStep = "loading" | "ready" | "starting" | "error";

interface ErrorMeta {
  reason: "not_found" | "expired" | "completed";
}

// ─── Root Client Component ──────────────────────────────────────────────────

export default function InterviewJoinClient({ interviewId }: { interviewId: string }) {
  const router = useRouter();
  const [step, setStep] = useState<PageStep>("loading");
  const [interview, setInterview] = useState<InterviewData | null>(null);
  const [errorMeta, setErrorMeta] = useState<ErrorMeta | null>(null);
  const [fullName, setFullName] = useState("");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    getInterviewData(interviewId)
      .then((data) => {
        if (!data) {
          setErrorMeta({ reason: "not_found" });
          setStep("error");
          return;
        }
        if (data.status === "expired") {
          setErrorMeta({ reason: "expired" });
          setStep("error");
          return;
        }
        if (data.status === "completed") {
          setErrorMeta({ reason: "completed" });
          setStep("error");
          return;
        }
        setInterview(data);
        setStep("ready");
      })
      .catch(() => {
        setErrorMeta({ reason: "not_found" });
        setStep("error");
      });
  }, [interviewId]);

  async function handleStart() {
    const trimmed = fullName.trim();
    if (!trimmed) {
      setNameError("Your full name is required to continue.");
      return;
    }
    if (trimmed.split(/\s+/).length < 2) {
      setNameError("Please enter both your first and last name.");
      return;
    }
    setNameError("");
    setStep("starting");

    try {
      await startInterviewSession({ interviewId, candidateName: trimmed });
      router.push(
        `/interview/${interviewId}/session?name=${encodeURIComponent(trimmed)}`
      );
    } catch {
      setStep("ready");
      setNameError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
      {/* ── App Header ── */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-5xl flex h-14 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 group-hover:bg-indigo-500 transition-colors">
              <Mic2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight">
              Recruiter<span className="text-indigo-600">AI</span>
            </span>
          </Link>
          <Badge
            variant="secondary"
            className="hidden sm:flex text-xs font-medium bg-indigo-50 text-indigo-700 border-indigo-200"
          >
            AI Interview Platform
          </Badge>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 flex items-start justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-lg">
          {step === "loading" && <LoadingSkeleton />}
          {step === "error" && <ErrorState reason={errorMeta?.reason ?? "not_found"} />}
          {(step === "ready" || step === "starting") && interview && (
            <InterviewForm
              interview={interview}
              fullName={fullName}
              nameError={nameError}
              isStarting={step === "starting"}
              onNameChange={(v) => {
                setFullName(v);
                if (nameError) setNameError("");
              }}
              onStart={handleStart}
            />
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
        Powered by{" "}
        <span className="font-semibold text-indigo-600">RecruiterAI</span>
        {" · "}Secure, AI-powered screening interviews
      </footer>
    </div>
  );
}

// ─── Loading Skeleton ───────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-in fade-in-0 duration-300">
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="rounded-2xl border border-border bg-white p-6 space-y-4 shadow-sm">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-px w-full" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full shrink-0" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-white p-6 space-y-4 shadow-sm">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

// ─── Error State ────────────────────────────────────────────────────────────

const ERROR_CONTENT: Record<
  "not_found" | "expired" | "completed",
  { icon: React.ReactNode; title: string; description: string }
> = {
  not_found: {
    icon: <XCircle className="h-10 w-10 text-red-500" />,
    title: "Interview Not Found",
    description:
      "This interview link is invalid or does not exist. Please check the link and try again, or contact your recruiter.",
  },
  expired: {
    icon: <AlertTriangle className="h-10 w-10 text-amber-500" />,
    title: "Interview Link Expired",
    description:
      "This interview link has expired. Please reach out to your recruiter to receive a new link.",
  },
  completed: {
    icon: <CheckCircle2 className="h-10 w-10 text-emerald-500" />,
    title: "Interview Already Completed",
    description:
      "This interview has already been completed. If you believe this is an error, please contact your recruiter.",
  },
};

function ErrorState({ reason }: { reason: "not_found" | "expired" | "completed" }) {
  const content = ERROR_CONTENT[reason];
  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
      <div className="rounded-2xl border border-border bg-white p-8 shadow-sm text-center space-y-4">
        <div className="flex justify-center">{content.icon}</div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-foreground">{content.title}</h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
            {content.description}
          </p>
        </div>
        <Separator />
        <p className="text-xs text-muted-foreground">
          Need help?{" "}
          <a
            href="mailto:support@recruiterai.com"
            className="text-indigo-600 hover:underline font-medium"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}

// ─── Interview Form ─────────────────────────────────────────────────────────

const INSTRUCTION_ICONS: React.ReactNode[] = [
  <Wifi key="wifi" className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />,
  <Volume2 key="vol" className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />,
  <CheckCircle2 key="c1" className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />,
  <CheckCircle2 key="c2" className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />,
  <CheckCircle2 key="c3" className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />,
];

interface InterviewFormProps {
  interview: InterviewData;
  fullName: string;
  nameError: string;
  isStarting: boolean;
  onNameChange: (value: string) => void;
  onStart: () => void;
}

function InterviewForm({
  interview,
  fullName,
  nameError,
  isStarting,
  onNameChange,
  onStart,
}: InterviewFormProps) {
  return (
    <div className="space-y-5 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
      {/* Page heading */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Welcome to Your Interview
        </h1>
        <p className="text-sm text-muted-foreground">
          Review the details below, then enter your name to get started.
        </p>
      </div>

      {/* Interview details card */}
      <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
        {/* Gradient accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-violet-500" />

        <div className="p-6 space-y-5">
          {/* Status + duration */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Active Interview
            </Badge>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-indigo-400" />
              <span>{interview.duration} minutes</span>
            </div>
          </div>

          {/* Title + role */}
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground leading-snug">
              {interview.title}
            </h2>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{interview.role}</span>
              <span className="text-border">·</span>
              <span>{interview.company}</span>
            </div>
          </div>

          <Separator />

          {/* Instructions */}
          {interview.instructions.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Before You Begin
              </p>
              <ul className="space-y-2.5">
                {interview.instructions.map((instruction, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                    {INSTRUCTION_ICONS[i] ?? (
                      <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-snug">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Candidate input card */}
      <div className="rounded-2xl border border-border bg-white shadow-sm p-6 space-y-5">
        <div className="space-y-0.5">
          <h3 className="text-base font-semibold text-foreground">Your Details</h3>
          <p className="text-sm text-muted-foreground">
            Enter your name as it appears on your application.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-foreground">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="fullName"
              type="text"
              placeholder="e.g. Jane Smith"
              value={fullName}
              onChange={(e) => onNameChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isStarting && onStart()}
              disabled={isStarting}
              className={`pl-9 h-11 rounded-lg transition-colors ${
                nameError
                  ? "border-red-400 focus-visible:ring-red-400/30"
                  : "focus-visible:ring-indigo-500/30"
              }`}
              autoComplete="name"
              autoFocus
            />
          </div>
          {nameError && (
            <p className="text-xs text-red-600 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              {nameError}
            </p>
          )}
        </div>

        <Button
          onClick={onStart}
          disabled={isStarting}
          size="lg"
          className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold gap-2 transition-all h-11"
        >
          {isStarting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Initializing Interview…
            </>
          ) : (
            <>
              Start Interview
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By starting, you agree that this interview will be processed by an AI system.
        </p>
      </div>
    </div>
  );
}

