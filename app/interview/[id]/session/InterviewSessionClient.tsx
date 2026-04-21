"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Mic2, MicOff, Video, VideoOff, PhoneOff,
  Volume2, VolumeX, Clock, Loader2, CheckCircle2,
  Copy, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { InterviewData } from "../interview-data";

// ─── Types ──────────────────────────────────────────────────────────────────

type Phase = "requesting" | "connecting" | "active" | "ended";

interface Message {
  id: number;
  role: "ai" | "user";
  text: string;
  ts: string;
}

interface Summary {
  candidateName: string;
  role: string;
  company: string;
  date: string;
  duration: string;
  pairs: { question: string; answer: string }[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function nowTs() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// ─── Question generator ──────────────────────────────────────────────────────

function buildQuestions(interview: InterviewData, firstName: string): string[] {
  const { role, company, title } = interview;
  return [
    `Hello ${firstName}! Welcome to your ${title} for the ${role} position at ${company}. I am your AI interviewer from RecruiterAI. Let us get started. Could you please begin by introducing yourself and briefly walking me through your professional background?`,
    `Thank you for that introduction. What specifically drew you to apply for the ${role} role at ${company}?`,
    `Can you walk me through a significant project or achievement from your recent experience that is most relevant to this position?`,
    `Tell me about a time when you faced a particularly challenging problem at work. How did you approach it, and what was the outcome?`,
    `What would you say are your top two or three strengths that make you a strong fit for the ${role} role?`,
    `How do you typically handle tight deadlines or high-pressure situations in a professional setting?`,
    `Where do you see your career heading over the next three to five years, and how does this role at ${company} fit into that vision?`,
    `Thank you so much for your time today, ${firstName}. That brings us to the end of our interview. Your responses have been recorded and our hiring team will review them carefully. We will be in touch with the next steps very soon. Have a wonderful day!`,
  ];
}

// ─── Summary builder ─────────────────────────────────────────────────────────

function buildSummary(
  messages: Message[],
  questions: string[],
  candidateName: string,
  interview: InterviewData,
  elapsed: number
): Summary {
  const aiMessages = messages.filter((m) => m.role === "ai");
  const userMessages = messages.filter((m) => m.role === "user");

  const pairs = aiMessages
    .slice(0, -1) // exclude closing message
    .map((q, i) => ({
      question: q.text,
      answer: userMessages[i]?.text ?? "(No response recorded)",
    }));

  return {
    candidateName,
    role: interview.role,
    company: interview.company,
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    duration: fmt(elapsed),
    pairs,
  };
}

function summaryToText(s: Summary): string {
  const lines: string[] = [
    "INTERVIEW SUMMARY REPORT",
    "═".repeat(50),
    `Candidate : ${s.candidateName}`,
    `Position  : ${s.role} at ${s.company}`,
    `Date      : ${s.date}`,
    `Duration  : ${s.duration}`,
    "",
    "QUESTIONS & RESPONSES",
    "─".repeat(50),
  ];

  s.pairs.forEach(({ question, answer }, i) => {
    lines.push(`\nQ${i + 1}: ${question}`);
    lines.push(`A${i + 1}: ${answer}`);
  });

  lines.push("");
  lines.push("─".repeat(50));
  lines.push("RECRUITER NOTES");
  lines.push("─".repeat(50));
  lines.push("");
  lines.push("[ Add your assessment here ]");

  return lines.join("\n");
}

// ─── Waveform bars ───────────────────────────────────────────────────────────

const BAR_CFG = [
  { h: 40, dur: 0.55, d: 0.00 }, { h: 70, dur: 0.70, d: 0.06 },
  { h: 95, dur: 0.50, d: 0.12 }, { h: 60, dur: 0.65, d: 0.18 },
  { h: 85, dur: 0.75, d: 0.05 }, { h: 50, dur: 0.60, d: 0.22 },
  { h: 100, dur: 0.55, d: 0.10 }, { h: 75, dur: 0.70, d: 0.16 },
  { h: 45, dur: 0.65, d: 0.02 }, { h: 90, dur: 0.50, d: 0.20 },
  { h: 60, dur: 0.75, d: 0.08 }, { h: 80, dur: 0.60, d: 0.14 },
];

function Waveform({ active, color = "#818cf8" }: { active: boolean; color?: string }) {
  return (
    <div className="flex items-end gap-0.5 h-10">
      {BAR_CFG.map((b, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full"
          style={{
            height: active ? `${b.h}%` : "12%",
            backgroundColor: color,
            opacity: active ? 1 : 0.3,
            transformOrigin: "bottom",
            transition: active ? "none" : "height 0.4s ease, opacity 0.4s ease",
            animationName: active ? "waveBar" : "none",
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.d}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDirection: "alternate",
          }}
        />
      ))}
    </div>
  );
}

// ─── AI Orb ─────────────────────────────────────────────────────────────────

function AiOrb({ speaking }: { speaking: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex items-center justify-center">
        {speaking && (
          <>
            <div className="absolute h-44 w-44 rounded-full bg-indigo-500/10 animate-ping"
              style={{ animationDuration: "1.8s" }} />
            <div className="absolute h-36 w-36 rounded-full bg-indigo-500/15 animate-ping"
              style={{ animationDuration: "1.4s", animationDelay: "0.3s" }} />
          </>
        )}
        <div className={`relative flex h-32 w-32 items-center justify-center rounded-full border-2 transition-all duration-500 ${
          speaking
            ? "bg-gradient-to-br from-indigo-600 to-violet-700 border-indigo-400 animate-orb-pulse"
            : "bg-slate-800 border-slate-600"
        }`}>
          <Mic2 className={`h-12 w-12 transition-colors duration-300 ${speaking ? "text-white" : "text-slate-400"}`} />
        </div>
      </div>
      <Waveform active={speaking} />
      <p className="text-xs font-medium">
        {speaking
          ? <span className="text-indigo-400 animate-pulse">AI Interviewer is speaking…</span>
          : <span className="text-slate-400">AI Interviewer</span>}
      </p>
    </div>
  );
}

// ─── Chat message ─────────────────────────────────────────────────────────────

function ChatBubble({ msg }: { msg: Message }) {
  const isAi = msg.role === "ai";
  return (
    <div className={`flex gap-2.5 ${isAi ? "" : "flex-row-reverse"}`}>
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold mt-0.5 ${
        isAi ? "bg-indigo-600 text-white" : "bg-violet-600 text-white"
      }`}>
        {isAi ? "AI" : "You"}
      </div>
      <div className={`max-w-[80%] space-y-1 ${isAi ? "" : "flex flex-col items-end"}`}>
        <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isAi ? "bg-slate-800 text-slate-100 rounded-tl-sm" : "bg-indigo-600 text-white rounded-tr-sm"
        }`}>
          {msg.text}
        </div>
        <p className="text-[11px] text-slate-500 px-1">{msg.ts}</p>
      </div>
    </div>
  );
}

// ─── Control button ───────────────────────────────────────────────────────────

function ControlBtn({ active, onClick, title, iconOn, iconOff }: {
  active: boolean; onClick: () => void; title: string;
  iconOn: React.ReactNode; iconOff: React.ReactNode;
}) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick} title={title}
      className={`h-12 w-12 rounded-full transition-colors ${
        active ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-red-600/20 text-red-400 hover:bg-red-600/30"
      }`}>
      {active ? iconOn : iconOff}
    </Button>
  );
}

// ─── Full-screen dark layout ──────────────────────────────────────────────────

function FullDark({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4">
      <div className="flex items-center gap-2.5 mb-12">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <Mic2 className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-sm text-white tracking-tight">
          Recruiter<span className="text-indigo-400">AI</span>
        </span>
      </div>
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  interviewId: string;
  candidateName: string;
  interview: InterviewData;
}

export default function InterviewSessionClient({ interviewId, candidateName, interview }: Props) {
  const firstName = candidateName.split(" ")[0];
  const questions = buildQuestions(interview, firstName);

  const [phase, setPhase] = useState<Phase>("requesting");
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [interimText, setInterimText] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [copied, setCopied] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isActiveRef = useRef(false);
  const micEnabledRef = useRef(true);
  const speakerEnabledRef = useRef(true);
  const msgIdRef = useRef(0);
  const messagesRef = useRef<Message[]>([]);
  const elapsedRef = useRef(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { micEnabledRef.current = micEnabled; }, [micEnabled]);
  useEffect(() => {
    speakerEnabledRef.current = speakerEnabled;
    if (audioRef.current) audioRef.current.muted = !speakerEnabled;
  }, [speakerEnabled]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { elapsedRef.current = elapsed; }, [elapsed]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interimText]);

  // ── Media setup ───────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        mediaStreamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setPhase("connecting");
        setTimeout(() => { if (!cancelled) setPhase("active"); }, 1800);
      })
      .catch((err) => {
        if (cancelled) return;
        setPermissionError(
          err.name === "NotAllowedError"
            ? "Camera and microphone access was denied. Please allow permissions and reload."
            : "Could not access your camera or microphone. Please check your device settings."
        );
      });
    return () => { cancelled = true; };
  }, []);

  // ── Start interview ───────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "active") return;
    isActiveRef.current = true;
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    runInterview();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  function addMessage(role: "ai" | "user", text: string) {
    const msg: Message = { id: ++msgIdRef.current, role, text, ts: nowTs() };
    setMessages((prev) => {
      const next = [...prev, msg];
      messagesRef.current = next;
      return next;
    });
  }

  // Browser speechSynthesis fallback
  function browserSpeak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window)) { setTimeout(resolve, 500); return; }
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.92;
      utter.pitch = 1.05;
      // prefer a natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find((v) =>
        v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Enhanced"))
      ) ?? voices.find((v) => v.lang.startsWith("en")) ?? null;
      if (preferred) utter.voice = preferred;
      utter.onend = () => resolve();
      utter.onerror = () => resolve();
      window.speechSynthesis.speak(utter);
    });
  }

  async function speakText(text: string): Promise<void> {
    return new Promise(async (resolve) => {
      if (!isActiveRef.current) { resolve(); return; }
      setIsAiSpeaking(true);

      let usedMurf = false;
      try {
        const res = await fetch("/api/murf-tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (!res.ok) throw new Error(`Murf error ${res.status}`);

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.muted = !speakerEnabledRef.current;
        audioRef.current = audio;
        usedMurf = true;

        audio.onended = () => { URL.revokeObjectURL(url); setIsAiSpeaking(false); resolve(); };
        audio.onerror = () => { URL.revokeObjectURL(url); setIsAiSpeaking(false); resolve(); };
        await audio.play();
      } catch (err) {
        if (!usedMurf) {
          console.warn("[session] Murf TTS failed, using browser fallback:", err);
        }
        // Browser speechSynthesis fallback — always works, no API key needed
        await browserSpeak(text);
        setIsAiSpeaking(false);
        resolve();
      }
    });
  }

  function listenForUser(): Promise<string> {
    return new Promise((resolve) => {
      if (!isActiveRef.current) { resolve(""); return; }
      if (!micEnabledRef.current) { setTimeout(() => resolve(""), 3000); return; }

      const SR =
        (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition })
          .SpeechRecognition ??
        (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition })
          .webkitSpeechRecognition;

      if (!SR) { setTimeout(() => resolve(""), 3000); return; }

      const rec = new SR();
      recognitionRef.current = rec;
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = "en-US";

      let finalText = "";
      const timeout = setTimeout(() => {
        try { rec.stop(); } catch { /* ignore */ }
        resolve(finalText || "");
      }, 25000);

      rec.onresult = (e: SpeechRecognitionEvent) => {
        finalText = Array.from(e.results).map((r) => r[0].transcript).join(" ");
        setInterimText(finalText);
      };
      rec.onend = () => {
        clearTimeout(timeout);
        setIsListening(false);
        setInterimText("");
        resolve(finalText);
      };
      rec.onerror = () => {
        clearTimeout(timeout);
        setIsListening(false);
        setInterimText("");
        resolve(finalText || "");
      };

      try { rec.start(); setIsListening(true); }
      catch { clearTimeout(timeout); resolve(""); }
    });
  }

  async function runInterview() {
    for (let i = 0; i < questions.length; i++) {
      if (!isActiveRef.current) break;
      setCurrentQ(i);
      addMessage("ai", questions[i]);
      await speakText(questions[i]);
      if (!isActiveRef.current) break;
      if (i === questions.length - 1) break; // closing line, no answer needed
      const answer = await listenForUser();
      if (answer.trim()) addMessage("user", answer.trim());
      await new Promise((r) => setTimeout(r, 700));
    }

    if (isActiveRef.current) {
      isActiveRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      await finishInterview();
    }
  }

  async function finishInterview() {
    const finalMessages = messagesRef.current;
    const finalElapsed = elapsedRef.current;

    const s = buildSummary(finalMessages, questions, candidateName, interview, finalElapsed);
    setSummary(s);
    setPhase("ended");

    // Save to DB (non-blocking)
    fetch("/api/interview-results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        interviewId,
        candidateName,
        role: interview.role,
        company: interview.company,
        duration: finalElapsed,
        transcript: finalMessages,
      }),
    }).catch((err) => console.error("[session] save error:", err));
  }

  // ── Controls ──────────────────────────────────────────────────────────────

  function toggleMic() {
    const newVal = !micEnabled;
    mediaStreamRef.current?.getAudioTracks().forEach((t) => { t.enabled = newVal; });
    setMicEnabled(newVal);
    if (!newVal) { try { recognitionRef.current?.stop(); } catch { /* ignore */ } }
  }

  function toggleCamera() {
    const newVal = !cameraEnabled;
    mediaStreamRef.current?.getVideoTracks().forEach((t) => { t.enabled = newVal; });
    setCameraEnabled(newVal);
  }

  function toggleSpeaker() {
    setSpeakerEnabled((v) => {
      if (audioRef.current) audioRef.current.muted = v; // toggling to opposite
      return !v;
    });
  }

  const handleEndCall = useCallback(() => {
    isActiveRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
    if (audioRef.current) { audioRef.current.pause(); }
    window.speechSynthesis?.cancel();
    try { recognitionRef.current?.stop(); } catch { /* ignore */ }
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    setIsAiSpeaking(false);
    setIsListening(false);
    finishInterview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCopy() {
    if (!summary) return;
    navigator.clipboard.writeText(summaryToText(summary)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // ── Render: permission error ───────────────────────────────────────────────
  if (permissionError) {
    return (
      <FullDark>
        <div className="max-w-sm text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 border border-red-500/30">
            <MicOff className="h-8 w-8 text-red-400" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-white">Permissions Required</h2>
            <p className="text-slate-400 text-sm leading-relaxed">{permissionError}</p>
          </div>
          <Button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-500 text-white">
            Try Again
          </Button>
        </div>
      </FullDark>
    );
  }

  // ── Render: connecting ────────────────────────────────────────────────────
  if (phase === "requesting" || phase === "connecting") {
    return (
      <FullDark>
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 shadow-2xl shadow-indigo-500/40">
            <Mic2 className="h-10 w-10 text-white" />
            <span className="absolute inset-0 rounded-full animate-ping bg-indigo-400 opacity-20"
              style={{ animationDuration: "1.8s" }} />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold text-white">
              {phase === "requesting" ? "Requesting permissions…" : "Connecting…"}
            </h2>
            <p className="text-indigo-200 text-sm">
              {phase === "requesting"
                ? "Please allow camera and microphone access"
                : "Setting up your AI interview session"}
            </p>
          </div>
          <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
        </div>
      </FullDark>
    );
  }

  // ── Render: ended with summary ────────────────────────────────────────────
  if (phase === "ended") {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        {/* Header */}
        <header className="flex h-14 items-center justify-between px-4 sm:px-6 border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
              <Mic2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight">
              Recruiter<span className="text-indigo-400">AI</span>
            </span>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 text-xs">
              Return to Home
            </Button>
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-8 max-w-3xl mx-auto w-full space-y-6">
          {/* Done card */}
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30">
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold">Interview Complete</h2>
            <p className="text-slate-400 text-sm">
              Thank you, <span className="text-white font-medium">{firstName}</span>. Your responses have been saved.
            </p>
            <div className="flex items-center justify-center gap-4 pt-1 flex-wrap text-sm text-slate-400">
              <span>Duration: <span className="text-white font-medium">{fmt(elapsed)}</span></span>
              <span>Questions answered: <span className="text-white font-medium">
                {messages.filter((m) => m.role === "user").length}
              </span></span>
            </div>
          </div>

          {/* Summary report */}
          {summary && (
            <div className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden">
              {/* Report header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div>
                  <h3 className="text-base font-semibold">Interview Report</h3>
                  <p className="text-xs text-slate-400 mt-0.5">For recruiter review · Confidential</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="border-white/20 text-slate-300 hover:bg-white/10 gap-1.5 text-xs"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy Report"}
                </Button>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5 border-b border-white/10">
                {[
                  { label: "Candidate", value: summary.candidateName },
                  { label: "Position", value: summary.role },
                  { label: "Company", value: summary.company },
                  { label: "Date", value: summary.date },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-900 px-4 py-3">
                    <p className="text-[11px] text-slate-500 uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-medium text-white mt-0.5 truncate">{value}</p>
                  </div>
                ))}
              </div>

              {/* Q&A pairs */}
              <div className="divide-y divide-white/5">
                {summary.pairs.map(({ question, answer }, i) => (
                  <div key={i} className="px-5 py-4 space-y-2">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600/30 text-[10px] font-bold text-indigo-400">
                        Q{i + 1}
                      </span>
                      <p className="text-sm text-slate-300 leading-relaxed">{question}</p>
                    </div>
                    <div className="flex items-start gap-2.5 ml-0">
                      <span className="mt-0.5 shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600/30 text-[10px] font-bold text-violet-400">
                        A{i + 1}
                      </span>
                      <p className={`text-sm leading-relaxed ${
                        answer === "(No response recorded)" ? "text-slate-600 italic" : "text-white"
                      }`}>
                        {answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recruiter notes */}
              <div className="px-5 py-4 border-t border-white/10 bg-slate-900/60">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Recruiter Notes
                </p>
                <textarea
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  rows={4}
                  placeholder="Add your assessment, hire recommendation, or notes here…"
                />
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ── Render: active interview ───────────────────────────────────────────────
  const progress = Math.round(((currentQ + 1) / questions.length) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white overflow-hidden">

      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between px-4 sm:px-6 border-b border-white/10 bg-slate-900/80 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
            <Mic2 className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight">
            Recruiter<span className="text-indigo-400">AI</span>
          </span>
          <span className="hidden sm:block text-slate-500 text-xs ml-1">
            · {interview.role} @ {interview.company}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs gap-1.5 hidden sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
            LIVE
          </Badge>
          <div className="flex items-center gap-1.5 text-slate-300 text-sm font-mono">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            {fmt(elapsed)}
          </div>
          <Button onClick={handleEndCall} size="sm"
            className="bg-red-600 hover:bg-red-500 text-white h-8 px-3 text-xs gap-1.5">
            <PhoneOff className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">End</span>
          </Button>
        </div>
      </header>

      {/* Progress */}
      <div className="h-0.5 bg-slate-800 shrink-0">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
          style={{ width: `${progress}%` }} />
      </div>

      {/* Main */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden min-h-0">

        {/* Left: AI orb + webcam */}
        <div className="flex flex-col items-center justify-between gap-4 p-5
          md:w-[400px] md:shrink-0 md:border-r md:border-white/10
          border-b border-white/10 md:border-b-0 bg-slate-900/40">

          <div className="flex flex-col items-center justify-center flex-1 w-full gap-5">
            <AiOrb speaking={isAiSpeaking} />

            {isListening && (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Listening…
                </div>
                <Waveform active color="#34d399" />
              </div>
            )}

            <div className="text-xs text-slate-500 font-medium">
              Question {Math.min(currentQ + 1, questions.length)} of {questions.length}
            </div>
          </div>

          {/* Webcam */}
          <div className="relative w-full max-w-[280px] md:max-w-full aspect-video rounded-xl overflow-hidden bg-slate-800 border border-white/10 shrink-0">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-opacity duration-300 ${cameraEnabled ? "opacity-100" : "opacity-0"}`}
            />
            {!cameraEnabled && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-800">
                <VideoOff className="h-8 w-8 text-slate-500" />
                <p className="text-xs text-slate-500">Camera off</p>
              </div>
            )}
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/60 backdrop-blur px-2 py-1 text-xs text-white">
              {candidateName}
              {!micEnabled && <MicOff className="h-3 w-3 text-red-400" />}
            </div>
          </div>
        </div>

        {/* Right: chat */}
        <div className="flex flex-1 flex-col min-h-0 min-w-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Transcript</p>
            <Badge variant="outline" className="border-white/20 text-slate-500 text-[11px]">
              ID: {interviewId}
            </Badge>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
            {messages.length === 0 && (
              <p className="text-slate-600 text-sm text-center mt-10">Transcript will appear here…</p>
            )}
            {messages.map((m) => <ChatBubble key={m.id} msg={m} />)}

            {/* Interim user speech */}
            {interimText && (
              <div className="flex gap-2.5 flex-row-reverse opacity-60">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[11px] font-bold mt-0.5">You</div>
                <div className="max-w-[80%]">
                  <div className="rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm bg-violet-600/60 text-white leading-relaxed italic">
                    {interimText}
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Status */}
          <div className="shrink-0 px-4 py-2 border-t border-white/10 flex items-center gap-2 text-xs text-slate-500">
            {isAiSpeaking && <><span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />AI Interviewer is speaking</>}
            {isListening && <><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />Listening to your response…</>}
            {!isAiSpeaking && !isListening && <><span className="h-1.5 w-1.5 rounded-full bg-slate-600" />Processing…</>}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="shrink-0 flex items-center justify-center gap-3 border-t border-white/10 bg-slate-900 px-4 py-4">
        <ControlBtn active={micEnabled} onClick={toggleMic}
          title={micEnabled ? "Mute microphone" : "Unmute microphone"}
          iconOn={<Mic2 className="h-5 w-5" />} iconOff={<MicOff className="h-5 w-5" />} />
        <ControlBtn active={cameraEnabled} onClick={toggleCamera}
          title={cameraEnabled ? "Turn off camera" : "Turn on camera"}
          iconOn={<Video className="h-5 w-5" />} iconOff={<VideoOff className="h-5 w-5" />} />
        <ControlBtn active={speakerEnabled} onClick={toggleSpeaker}
          title={speakerEnabled ? "Mute speaker" : "Unmute speaker"}
          iconOn={<Volume2 className="h-5 w-5" />} iconOff={<VolumeX className="h-5 w-5" />} />
        <div className="h-8 w-px bg-white/10 mx-1" />
        <Button onClick={handleEndCall} size="icon" title="End interview"
          className="h-12 w-12 rounded-full bg-red-600 hover:bg-red-500 text-white shrink-0">
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
