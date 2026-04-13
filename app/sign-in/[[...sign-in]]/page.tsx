import { SignIn } from "@clerk/nextjs";
import { Mic2, PhoneCall, BrainCircuit, CalendarCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

const perks = [
  {
    icon: BrainCircuit,
    title: "AI screens every candidate",
    desc: "Natural voice calls, 24/7 — no human effort needed.",
  },
  {
    icon: PhoneCall,
    title: "10× faster than manual calling",
    desc: "Process hundreds of candidates while you sleep.",
  },
  {
    icon: CalendarCheck,
    title: "Auto-schedules qualified candidates",
    desc: "Only the best land on your calendar.",
  },
];

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* ── Left panel: branding ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-12 py-10 overflow-hidden">
        {/* Background glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-3xl" />
        </div>
        {/* Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/40">
            <Mic2 className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">
            Recruiter<span className="text-indigo-400">AI</span>
          </span>
        </div>

        {/* Center: headline + perks */}
        <div className="relative flex-1 flex flex-col justify-center py-16">
          <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
            </span>
            500+ teams recruiting with AI today
          </div>

          <h2 className="mt-5 text-3xl font-bold leading-snug text-white">
            Your AI recruiter
            <br />
            never stops working.
          </h2>
          <p className="mt-3 text-slate-400 text-sm leading-relaxed max-w-sm">
            Import candidates, let the AI call and screen them, then review only the best — all from one dashboard.
          </p>

          {/* Perks */}
          <div className="mt-8 space-y-4">
            {perks.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="flex items-start gap-3.5">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-600/30 border border-indigo-500/20">
                    <Icon className="h-4 w-4 text-indigo-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{p.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mini dashboard mockup */}
          <div className="mt-10 rounded-xl border border-white/8 bg-white/4 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400 font-medium">Today&apos;s pipeline</span>
              <span className="flex items-center gap-1 text-xs text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                Live
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Called", value: "47", color: "text-indigo-400" },
                { label: "Qualified", value: "12", color: "text-emerald-400" },
                { label: "Scheduled", value: "8", color: "text-amber-400" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg bg-white/5 px-2 py-2 text-center">
                  <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: testimonial */}
        <div className="relative rounded-xl border border-white/8 bg-white/4 p-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            &ldquo;RecruiterAI replaced our entire phone-screen process. We went from 3 days to
            3 hours to fill a pipeline.&rdquo;
          </p>
          <div className="mt-3 flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
              SC
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Sarah Chen</p>
              <p className="text-xs text-slate-500">Head of Talent, TechCorp</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel: sign-in form ────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12 sm:px-10">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
            <Mic2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">
            Recruiter<span className="text-indigo-600">AI</span>
          </span>
        </div>

        <div className="w-full max-w-sm">
          {/* Back to home */}
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to home
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-slate-500 text-sm mb-7">
            Sign in to your recruiter dashboard
          </p>

          <SignIn
            fallbackRedirectUrl="/dashboard"
            appearance={{
              layout: {
                showOptionalFields: false,
              },
              variables: {
                colorPrimary: "#4f46e5",
                colorText: "#0f172a",
                colorTextSecondary: "#64748b",
                colorBackground: "#ffffff",
                colorInputBackground: "#f8fafc",
                colorInputText: "#0f172a",
                borderRadius: "0.75rem",
                fontFamily: "inherit",
              },
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0 p-0 bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                header: "hidden",
                socialButtonsBlockButton:
                  "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium shadow-sm transition-colors rounded-xl h-11",
                socialButtonsBlockButtonText: "font-medium text-slate-700",
                socialButtonsBlockButtonArrow: "text-slate-400",
                dividerLine: "bg-slate-200",
                dividerText: "text-slate-400 text-xs",
                formFieldLabel: "text-sm font-medium text-slate-700",
                formFieldInput:
                  "border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 rounded-xl h-11 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all",
                formButtonPrimary:
                  "bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-500/20 rounded-xl h-11 transition-colors",
                footerActionText: "text-slate-500 text-sm",
                footerActionLink: "text-indigo-600 hover:text-indigo-500 font-medium",
                identityPreviewText: "text-slate-700",
                identityPreviewEditButtonIcon: "text-indigo-500",
                formFieldAction: "text-indigo-600 hover:text-indigo-500 text-xs",
                alertText: "text-sm",
                formResendCodeLink: "text-indigo-600 hover:text-indigo-500",
              },
            }}
          />

          <p className="mt-5 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
