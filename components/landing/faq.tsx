import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "How does the AI voice sound to candidates?",
    a: "RecruiterAI uses state-of-the-art neural TTS voices that are indistinguishable from a human in most cases. You can choose from a library of voices — professional, friendly, formal — and fully customize the persona name. The AI discloses it is automated if directly asked, ensuring ethical and transparent operation.",
  },
  {
    q: "Can I customize the screening questions?",
    a: "Absolutely. You can define a full question script per job role — required questions, follow-up probes, and scoring rubrics. The AI sticks to your script while handling natural variations in candidate responses. You can also set dynamic questions that only trigger based on previous answers.",
  },
  {
    q: "What happens if a candidate doesn't answer?",
    a: "RecruiterAI automatically retries up to 3 times at different times of day before marking the candidate as 'unreachable' and sending them an SMS/email fallback. You configure the retry logic — intervals, max attempts, and fallback message content.",
  },
  {
    q: "Can candidates tell they're talking to an AI?",
    a: "Many candidates don't realize it's an AI — our response latency is under 500ms and the conversation flows naturally. However, we follow ethical AI principles: if a candidate directly asks \"Am I talking to a real person?\", the agent discloses it is an AI voice assistant.",
  },
  {
    q: "What languages are supported?",
    a: "RecruiterAI supports 40+ languages including English, Spanish, French, German, Mandarin, Hindi, Arabic, Portuguese, Japanese, Korean, and more. The AI auto-detects the candidate's language from their greeting and switches seamlessly — no configuration needed.",
  },
  {
    q: "Does it work with our ATS?",
    a: "Yes. We have native integrations with Greenhouse, Lever, Workday, BambooHR, Ashby, and Rippling. Candidate data, call outcomes, transcripts, and scores sync back automatically. We also offer a REST API and Zapier connector for any other ATS.",
  },
  {
    q: "Is RecruiterAI GDPR and CCPA compliant?",
    a: "Yes. All calls include an optional consent recording at the start. Call data is encrypted at rest and in transit. We provide full data deletion on request, data processing agreements (DPAs), and maintain a detailed audit trail for compliance. Our infrastructure is hosted in EU and US regions.",
  },
  {
    q: "How do you prevent bias in AI screening?",
    a: "Every candidate for a given role is asked the exact same set of questions in the same order — removing the inconsistency introduced by different human interviewers. Scoring rubrics are based on role-relevant criteria you define. We continuously audit score distributions across demographic groups and flag anomalies.",
  },
  {
    q: "What's the difference between the Pro and Enterprise plans?",
    a: "Pro is ideal for teams doing up to ~500 screenings per month with standard ATS integrations. Enterprise adds unlimited call volume, custom voice personas, white-labeling, SSO/SCIM, a dedicated customer success manager, and SLA-backed uptime guarantees. Contact sales for a custom quote.",
  },
  {
    q: "How long does setup take?",
    a: "Most teams are live within 15 minutes. You import your candidate list, pick a job role template (or create your own), connect your calendar, and press go. No engineering work required for the standard setup. Enterprise integrations typically take 1–2 business days.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 sm:py-32 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-16">
          {/* Left: heading + CTA */}
          <div className="mb-12 lg:mb-0">
            <span className="inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-600 mb-4">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-slate-500 leading-relaxed mb-6">
              Everything you need to know about RecruiterAI. Can&apos;t find the answer you&apos;re looking for?
            </p>
            <Button
              variant="outline"
              className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 group"
            >
              Chat with our team
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Quick stats */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                { value: "< 15min", label: "Time to first call" },
                { value: "500+", label: "Companies onboarded" },
                { value: "2M+", label: "Calls completed" },
                { value: "4.9/5", label: "Customer rating" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xl font-bold text-indigo-600">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: accordion */}
          <div className="lg:col-span-2">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="rounded-xl border border-slate-200 bg-white px-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-base font-semibold text-slate-900 hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-500 leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
