const stats = [
  {
    value: "10x",
    label: "Faster Screening",
    sub: "vs. manual phone screens",
  },
  {
    value: "80%",
    label: "Time Saved",
    sub: "for your recruiting team",
  },
  {
    value: "40+",
    label: "Languages",
    sub: "supported out of the box",
  },
  {
    value: "99.2%",
    label: "Call Success Rate",
    sub: "across all carriers worldwide",
  },
];

const testimonials = [
  {
    quote:
      "We went from screening 20 candidates a week to 200. RecruiterAI handles every first call — our team only talks to the people who truly fit.",
    name: "Sarah Chen",
    role: "Head of Talent, TechCorp",
    avatar: "SC",
    avatarColor: "bg-indigo-500",
  },
  {
    quote:
      "The AI asks better questions than most of our junior recruiters. It stays on script, adapts naturally, and the transcripts save us hours of note-taking.",
    name: "Marcus Webb",
    role: "Recruiting Lead, Finova",
    avatar: "MW",
    avatarColor: "bg-violet-500",
  },
  {
    quote:
      "Candidates actually love it. We get 40% higher response rates compared to scheduling calls with humans — people pick up because it's frictionless.",
    name: "Priya Nair",
    role: "VP People, Launchpad",
    avatar: "PN",
    avatarColor: "bg-emerald-500",
  },
];

export function Stats() {
  return (
    <section className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden mb-20">
          {stats.map((stat) => (
            <div
              key={stat.value}
              className="flex flex-col items-center justify-center py-10 px-6 bg-white/5 text-center"
            >
              <span className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="mt-2 text-base font-semibold text-white">{stat.label}</span>
              <span className="mt-1 text-xs text-slate-500">{stat.sub}</span>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Loved by recruiting teams
          </h2>
          <p className="mt-3 text-slate-400">
            Join hundreds of companies screening smarter, not harder.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:bg-white/8 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="h-4 w-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="flex-1 text-sm text-slate-300 leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="mt-5 flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${t.avatarColor} text-xs font-bold text-white`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
