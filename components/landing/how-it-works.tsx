import { Upload, Bot, CalendarCheck, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Import Your Candidates",
    description:
      "Upload a CSV, paste a spreadsheet, or connect your ATS. RecruiterAI accepts any format — names, phone numbers, job roles, and custom screening criteria.",
    details: ["CSV / Excel upload", "ATS integrations", "Manual entry", "Bulk paste"],
    color: "indigo",
  },
  {
    number: "02",
    icon: Bot,
    title: "AI Agent Calls & Screens",
    description:
      "Our conversational AI calls each candidate, introduces itself, asks your custom screening questions, and assesses their responses in real-time — 24/7.",
    details: ["Natural conversation", "Custom questions", "Real-time transcription", "Sentiment analysis"],
    color: "violet",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Review & Schedule Interviews",
    description:
      "Review call summaries, AI-generated scores, and full transcripts. Qualified candidates are automatically sent calendar invites for the next round.",
    details: ["AI scoring & ranking", "Full transcripts", "Auto-scheduling", "Team notifications"],
    color: "emerald",
  },
];

const colorMap: Record<string, string> = {
  indigo: "bg-indigo-600/10 text-indigo-600 border-indigo-200",
  violet: "bg-violet-600/10 text-violet-600 border-violet-200",
  emerald: "bg-emerald-600/10 text-emerald-600 border-emerald-200",
};

const iconBgMap: Record<string, string> = {
  indigo: "bg-indigo-600",
  violet: "bg-violet-600",
  emerald: "bg-emerald-600",
};

const numberMap: Record<string, string> = {
  indigo: "text-indigo-100 bg-indigo-600",
  violet: "text-violet-100 bg-violet-600",
  emerald: "text-emerald-100 bg-emerald-600",
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-600 mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            From import to interview in minutes
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Three steps is all it takes. No complex setup, no training required. Just paste your
            candidate list and let the AI handle the rest.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-14 left-[calc(16.66%-1px)] right-[calc(16.66%-1px)] h-0.5 bg-gradient-to-r from-indigo-200 via-violet-200 to-emerald-200" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative flex flex-col">
                  {/* Mobile connector */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center my-4">
                      <ArrowRight className="h-5 w-5 text-slate-300 rotate-90" />
                    </div>
                  )}

                  {/* Card */}
                  <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow h-full">
                    {/* Step number + icon */}
                    <div className="flex items-center gap-4 mb-5">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBgMap[step.color]} shadow-md`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <span className={`text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${colorMap[step.color]}`}>
                        Step {step.number}
                      </span>
                    </div>

                    {/* Title + description */}
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-5">{step.description}</p>

                    {/* Details list */}
                    <ul className="mt-auto space-y-2">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2 text-sm text-slate-600">
                          <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${iconBgMap[step.color]}`} />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
