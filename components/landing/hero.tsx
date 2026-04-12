"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Play,
  Upload,
  PhoneCall,
  CalendarCheck,
  Mic,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 pt-24 pb-20 sm:pt-32 sm:pb-32">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[700px] w-[700px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/8 blur-3xl" />
      </div>

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
            </span>
            AI-Powered Recruiting — Now Available
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.08]">
            Screen Candidates{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                10x Faster
              </span>
            </span>
            {" "}with AI Voice Calls
          </h1>

          {/* Subtext */}
          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
            Import your candidate list and our AI voice agent automatically calls each
            candidate, conducts an initial screening interview, scores responses, and
            schedules qualified candidates — while you focus on closing.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Button
              size="lg"
              className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white text-base font-semibold shadow-xl shadow-indigo-500/25 group"
            >
              Start Screening Free
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="h-12 px-8 text-slate-300 hover:text-white hover:bg-white/10 text-base gap-2 border border-white/10"
            >
              <Play className="h-4 w-4 fill-current" />
              Watch 2-min Demo
            </Button>
          </div>

          {/* Social proof row */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <p className="text-sm text-slate-500">No credit card required</p>
            <div className="hidden sm:block h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["bg-indigo-500","bg-violet-500","bg-emerald-500","bg-amber-500","bg-rose-500"].map((c, i) => (
                  <div key={i} className={`h-7 w-7 rounded-full ${c} ring-2 ring-slate-900 flex items-center justify-center text-[10px] font-bold text-white`}>
                    {["S","M","A","J","K"][i]}
                  </div>
                ))}
              </div>
              <span className="text-sm text-slate-400">
                <span className="text-white font-semibold">500+</span> teams screening today
              </span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-white/10" />
            <div className="flex items-center gap-1.5">
              {Array.from({length:5}).map((_,i) => (
                <svg key={i} className="h-4 w-4 fill-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm text-slate-400 ml-1">4.9/5 rating</span>
            </div>
          </div>
        </div>

        {/* === DASHBOARD MOCKUP === */}
        <div className="mt-20 mx-auto max-w-5xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-white/5 bg-white/3 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400/70" />
              <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
              <div className="h-3 w-3 rounded-full bg-green-400/70" />
              <div className="ml-4 flex-1 max-w-xs rounded-md bg-white/5 px-3 py-1 text-xs text-slate-500 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                app.recruiterai.com/campaigns/senior-engineer
              </div>
            </div>

            <div className="p-5 sm:p-7">
              {/* Top metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { icon: Users, label: "Total Candidates", value: "124", delta: "+12 today", color: "text-indigo-400" },
                  { icon: PhoneCall, label: "Calls Completed", value: "89", delta: "72% rate", color: "text-violet-400" },
                  { icon: TrendingUp, label: "Qualified", value: "23", delta: "26% pass", color: "text-emerald-400" },
                  { icon: CalendarCheck, label: "Interviews Set", value: "18", delta: "This week", color: "text-amber-400" },
                ].map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="rounded-xl border border-white/5 bg-white/5 p-3.5">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`h-3.5 w-3.5 ${metric.color}`} />
                        <span className="text-xs text-slate-500">{metric.label}</span>
                      </div>
                      <p className="text-xl font-bold text-white">{metric.value}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{metric.delta}</p>
                    </div>
                  );
                })}
              </div>

              {/* Main content: left=pipeline, right=live call */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Pipeline left */}
                <div className="sm:col-span-2 rounded-xl border border-white/5 bg-white/3 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <span className="text-xs font-semibold text-slate-300">Candidate Pipeline</span>
                    <span className="text-xs text-slate-500">Senior Engineer · 124 total</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {[
                      { name: "Sarah Mitchell", score: 94, status: "Interview Scheduled", statusColor: "text-emerald-400", badge: "bg-emerald-500/20 text-emerald-300" },
                      { name: "James Kowalski", score: 88, status: "Qualified", statusColor: "text-indigo-400", badge: "bg-indigo-500/20 text-indigo-300" },
                      { name: "Priya Sharma", score: 91, status: "Screening now...", statusColor: "text-yellow-400", badge: "bg-yellow-500/20 text-yellow-300" },
                      { name: "Alex Reyes", score: 72, status: "Under Review", statusColor: "text-slate-400", badge: "bg-slate-500/20 text-slate-400" },
                      { name: "Chen Wei", score: 85, status: "Interview Scheduled", statusColor: "text-emerald-400", badge: "bg-emerald-500/20 text-emerald-300" },
                    ].map((c) => (
                      <div key={c.name} className="flex items-center justify-between px-4 py-2.5 hover:bg-white/3 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {c.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-200">{c.name}</p>
                            <p className={`text-xs ${c.statusColor}`}>{c.status}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="hidden sm:block text-right">
                            <p className="text-xs font-bold text-white">{c.score}</p>
                            <p className="text-xs text-slate-500">score</p>
                          </div>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.badge}`}>
                            {c.score >= 85 ? "Top" : "Avg"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live call right */}
                <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-violet-500/10 bg-violet-500/10">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                    </span>
                    <span className="text-xs font-semibold text-violet-300">Live Call · 2:14</span>
                  </div>
                  <div className="p-4 space-y-3">
                    {/* Waveform */}
                    <div className="flex items-center justify-center gap-0.5 h-8 mb-2">
                      {[2,4,7,10,14,11,8,12,9,5,10,13,8,4,6,9,5,3].map((h, i) => (
                        <div
                          key={i}
                          className="w-1 rounded-full bg-violet-400/80 animate-soundwave"
                          style={{ height: `${h * 2}px`, animationDelay: `${i * 0.07}s` }}
                        />
                      ))}
                    </div>
                    {/* Transcript bubbles */}
                    <div className="space-y-2">
                      <div className="rounded-lg bg-indigo-600 px-3 py-2 text-xs text-white rounded-tl-none">
                        Can you describe your experience with distributed systems?
                      </div>
                      <div className="rounded-lg bg-white/10 px-3 py-2 text-xs text-slate-300 rounded-tr-none text-right">
                        Sure, I&apos;ve worked with Kafka and Cassandra at scale...
                      </div>
                      <div className="rounded-lg bg-indigo-600 px-3 py-2 text-xs text-white rounded-tl-none">
                        Interesting! What was the peak throughput you handled?
                      </div>
                    </div>
                    {/* AI sensing */}
                    <div className="rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-2">
                      <p className="text-xs text-violet-300 font-medium mb-1">AI Analysis</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Confidence</span>
                          <span className="text-emerald-400 font-medium">High</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Tech fit signal</span>
                          <span className="text-emerald-400 font-medium">Strong</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
