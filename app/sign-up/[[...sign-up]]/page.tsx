import { SignUp } from "@clerk/nextjs";
import { Mic2, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";

const benefits = [
  "50 free AI screening calls every month",
  "Full call transcripts & AI scoring",
  "Auto interview scheduling",
  "No credit card required",
];

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      {/* ── Left panel: branding ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-12 py-10 overflow-hidden">
        {/* Background glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-3xl" />
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
            <Mic2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-white">
            Recruiter<span className="text-indigo-400">AI</span>
          </span>
        </div>

        {/* Center content */}
        <div className="relative flex-1 flex flex-col justify-center py-16">
          <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            Free plan · No card required
          </div>

          <h2 className="mt-5 text-3xl font-bold leading-snug text-white">
            Start hiring smarter
            <br />
            in under 15 minutes.
          </h2>
          <p className="mt-3 text-slate-400 text-sm leading-relaxed max-w-sm">
            Set up your first AI screening campaign, import your candidates, and watch the calls happen automatically.
          </p>

          {/* Benefits */}
          <div className="mt-8 space-y-3">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-3">
                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30">
                  <Check className="h-3 w-3 text-emerald-400" />
                </div>
                <span className="text-sm text-slate-300">{b}</span>
              </div>
            ))}
          </div>

          {/* Step preview */}
          <div className="mt-10 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
              How it works
            </p>
            {[
              { step: "1", text: "Create account & import candidates" },
              { step: "2", text: "AI calls & screens each candidate" },
              { step: "3", text: "Review scores, schedule interviews" },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600/40 border border-indigo-500/30 text-xs font-bold text-indigo-300">
                  {s.step}
                </div>
                <span className="text-sm text-slate-400">{s.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: social proof numbers */}
        <div className="relative grid grid-cols-3 gap-3">
          {[
            { value: "500+", label: "Teams onboarded" },
            { value: "2M+", label: "Calls completed" },
            { value: "4.9★", label: "Average rating" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/8 bg-white/4 px-3 py-3 text-center"
            >
              <p className="text-lg font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel: sign-up form ────────────────────────── */}
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

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
          <p className="text-slate-500 text-sm mb-7">
            Free forever · 50 calls/month · No credit card
          </p>

          <SignUp
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
                formFieldAction: "text-indigo-600 hover:text-indigo-500 text-xs",
                alertText: "text-sm",
                formResendCodeLink: "text-indigo-600 hover:text-indigo-500",
              },
            }}
          />

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-slate-400">
            By signing up, you agree to our{" "}
            <Link href="#" className="underline hover:text-slate-600">Terms</Link>
            {" "}and{" "}
            <Link href="#" className="underline hover:text-slate-600">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
