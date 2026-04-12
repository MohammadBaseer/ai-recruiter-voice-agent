import {
  BrainCircuit,
  FileText,
  BarChart3,
  Calendar,
  Clock,
  Globe,
  Mic2,
  ShieldCheck,
  Zap,
  TrendingUp,
} from "lucide-react";

/* ── Bento grid – advanced feature showcase ─────────────────────────────── */

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-600 mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Everything you need to hire at scale
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            A complete AI recruitment toolkit — from the first call to the final offer.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto">

          {/* LARGE — Conversational AI */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-7 hover:shadow-lg transition-shadow group">
            <div className="flex items-start gap-4 mb-5">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-md">
                <BrainCircuit className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Conversational AI</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Natural, human-like voice powered by the latest LLMs. Handles follow-ups, detects confusion, and keeps
                  conversations on track — without sounding robotic.
                </p>
              </div>
            </div>

            {/* Live transcript mockup */}
            <div className="rounded-xl border border-indigo-100 bg-white/80 p-4 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-1 items-center">
                  {[3,6,9,6,4,8,5,7,3,6].map((h,i) => (
                    <div key={i} className="w-0.5 rounded-full bg-indigo-400 animate-soundwave"
                      style={{ height: `${h * 2}px`, animationDelay: `${i * 0.08}s` }} />
                  ))}
                </div>
                <span className="text-xs font-medium text-indigo-600">RecruiterAI · Live</span>
              </div>
              {[
                { role: "AI", text: "Hi Sarah! I'm calling on behalf of Acme Corp regarding your application for the Senior Engineer role. Is now a good time?", align: "left" },
                { role: "Candidate", text: "Yes, absolutely! I've been looking forward to this.", align: "right" },
                { role: "AI", text: "Great! Let's start — can you tell me about your experience with distributed systems at scale?", align: "left" },
              ].map((msg, i) => (
                <div key={i} className={`flex ${msg.align === "right" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    msg.align === "right"
                      ? "bg-slate-100 text-slate-700 rounded-tr-none"
                      : "bg-indigo-600 text-white rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TALL — 24/7 Always On */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50 to-orange-50 p-7 hover:shadow-lg transition-shadow">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-md mb-4">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">24/7 Always On</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
              Your AI recruiter never sleeps. Calls at optimal times for each candidate's timezone — weekdays, weekends, any hour.
            </p>
            {/* Clock visual */}
            <div className="flex items-center justify-center mt-2">
              <div className="relative h-24 w-24">
                <svg viewBox="0 0 100 100" className="w-full h-full text-amber-200">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
                  {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
                    const rad = (deg - 90) * Math.PI / 180;
                    const x1 = 50 + 38 * Math.cos(rad);
                    const y1 = 50 + 38 * Math.sin(rad);
                    const x2 = 50 + (i % 3 === 0 ? 30 : 34) * Math.cos(rad);
                    const y2 = 50 + (i % 3 === 0 ? 30 : 34) * Math.sin(rad);
                    return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={i % 3 === 0 ? "2.5" : "1.5"} />;
                  })}
                  <line x1="50" y1="50" x2="50" y2="20" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                  <line x1="50" y1="50" x2="68" y2="58" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="3" fill="#f59e0b" />
                </svg>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].slice(0,3).map((d) => (
                <div key={d} className="rounded-lg bg-amber-100/80 py-1.5 text-xs font-medium text-amber-700">{d}</div>
              ))}
            </div>
          </div>

          {/* AI Scoring */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-purple-50 to-pink-50 p-7 hover:shadow-lg transition-shadow">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-md mb-4">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">AI Scoring & Ranking</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Every candidate gets a multi-dimensional score with an explainable AI breakdown.
            </p>
            {/* Score bars */}
            <div className="space-y-2.5">
              {[
                { label: "Technical Fit", score: 92, color: "bg-purple-500" },
                { label: "Communication", score: 78, color: "bg-pink-500" },
                { label: "Culture Fit", score: 85, color: "bg-violet-500" },
                { label: "Experience", score: 88, color: "bg-indigo-500" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-slate-600">{item.label}</span>
                    <span className="text-xs font-semibold text-slate-800">{item.score}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100">
                    <div
                      className={`h-1.5 rounded-full ${item.color}`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Auto Transcription */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-violet-50 to-indigo-50 p-7 hover:shadow-lg transition-shadow">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md mb-4">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Auto Transcription</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Every call transcribed with speaker labels, timestamps, and AI-highlighted key moments.
            </p>
            {/* Transcript preview */}
            <div className="rounded-lg border border-violet-100 bg-white/70 p-3 space-y-2 text-xs">
              <div className="flex gap-2">
                <span className="text-violet-500 font-semibold shrink-0">00:42</span>
                <span className="text-slate-600"><span className="font-semibold">AI:</span> What&apos;s your experience with React?</span>
              </div>
              <div className="flex gap-2">
                <span className="text-violet-500 font-semibold shrink-0">00:48</span>
                <span className="text-slate-600"><span className="font-semibold">Sarah:</span> 5 years, mostly Next.js...</span>
              </div>
              <div className="flex gap-2 rounded-md bg-yellow-50 border border-yellow-100 px-2 py-1">
                <span className="text-yellow-600 font-semibold shrink-0">Key</span>
                <span className="text-slate-600">5 years React/Next.js experience flagged</span>
              </div>
            </div>
          </div>

          {/* LARGE — Auto Scheduling */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-7 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4 mb-5">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 shadow-md">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Smart Interview Scheduling</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Qualified candidates are automatically sent calendar links. The AI finds slots that work for
                  both parties and handles rescheduling — syncs with Google Calendar, Outlook, and Calendly.
                </p>
              </div>
            </div>
            {/* Calendar mini-mockup */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-emerald-100 bg-white/80 p-3">
                <p className="text-xs font-semibold text-slate-700 mb-2">This Week</p>
                <div className="space-y-1.5">
                  {[
                    { name: "James K.", role: "SWE II", time: "Mon 10:00", tag: "Technical" },
                    { name: "Priya S.", role: "PM", time: "Tue 2:00", tag: "Culture Fit" },
                    { name: "Alex R.", role: "Designer", time: "Wed 11:00", tag: "Portfolio" },
                  ].map((c) => (
                    <div key={c.name} className="flex items-center justify-between rounded-lg bg-emerald-50 px-2.5 py-1.5">
                      <div>
                        <p className="text-xs font-medium text-slate-800">{c.name}</p>
                        <p className="text-xs text-slate-500">{c.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-emerald-700">{c.time}</p>
                        <p className="text-xs text-emerald-500">{c.tag}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-white/80 p-3">
                <p className="text-xs font-semibold text-slate-700 mb-2">Auto-sent Invites</p>
                <div className="space-y-2">
                  {[
                    { icon: "📅", text: "Google Calendar synced" },
                    { icon: "📧", text: "Confirmation emails sent" },
                    { icon: "🔔", text: "24h reminders active" },
                    { icon: "🔁", text: "Reschedule handled" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-2 text-xs text-slate-600">
                      <span>{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Multilingual */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50 to-blue-50 p-7 hover:shadow-lg transition-shadow">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-blue-600 shadow-md mb-4">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">40+ Languages</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Auto-detects and adapts to the candidate&apos;s language. Hire globally without language barriers.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["English","Spanish","French","German","Mandarin","Hindi","Arabic","Portuguese","Japanese","Korean"].map((lang) => (
                <span key={lang} className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700">
                  {lang}
                </span>
              ))}
              <span className="rounded-full bg-sky-50 border border-sky-200 px-2.5 py-0.5 text-xs text-sky-500">+30 more</span>
            </div>
          </div>

          {/* Custom Voice */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-rose-50 to-pink-50 p-7 hover:shadow-lg transition-shadow">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-600 to-pink-600 shadow-md mb-4">
              <Mic2 className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Custom Voice & Script</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Set your own persona, tone, and screening questions. The agent represents your brand, not ours.
            </p>
            <div className="rounded-lg border border-rose-100 bg-white/70 p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Voice persona</span>
                <span className="font-medium text-slate-700">Alex (Professional)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Tone</span>
                <span className="font-medium text-slate-700">Friendly & Direct</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Custom questions</span>
                <span className="font-medium text-emerald-600">12 active</span>
              </div>
            </div>
          </div>

          {/* Bias Free */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-cyan-50 p-7 hover:shadow-lg transition-shadow">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 shadow-md mb-4">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Bias-Free Screening</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Standardized questions for every candidate ensures a fair, consistent, and legally compliant process.
            </p>
            <div className="flex flex-col gap-2">
              {["Equal questions for every candidate","GDPR & CCPA compliant","Full audit trail","EEO-aligned scoring"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <svg className="h-2.5 w-2.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
