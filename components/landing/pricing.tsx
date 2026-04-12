"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Minus, Zap } from "lucide-react";

const plans = [
  {
    name: "Free",
    tagline: "Try it out",
    monthlyPrice: 0,
    annualPrice: 0,
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
    highlight: false,
    badge: null,
    features: [
      { text: "50 AI calls / month", included: true },
      { text: "1 active job role", included: true },
      { text: "Basic screening questions", included: true },
      { text: "Call transcripts", included: true },
      { text: "Email support", included: true },
      { text: "AI scoring & ranking", included: false },
      { text: "Calendar sync", included: false },
      { text: "ATS integrations", included: false },
      { text: "Custom voice persona", included: false },
      { text: "Analytics dashboard", included: false },
    ],
  },
  {
    name: "Pro",
    tagline: "For growing teams",
    monthlyPrice: 79,
    annualPrice: 63,
    cta: "Start Free Trial",
    ctaVariant: "default" as const,
    highlight: true,
    badge: "Most Popular",
    features: [
      { text: "500 AI calls / month", included: true },
      { text: "Unlimited job roles", included: true },
      { text: "Custom screening questions", included: true },
      { text: "Full transcripts + highlights", included: true },
      { text: "Priority support", included: true },
      { text: "AI scoring & ranking", included: true },
      { text: "Calendar sync (Google + Outlook)", included: true },
      { text: "ATS integrations (Greenhouse, Lever)", included: true },
      { text: "Custom voice persona", included: false },
      { text: "Analytics dashboard", included: false },
    ],
  },
  {
    name: "Enterprise",
    tagline: "For hiring at scale",
    monthlyPrice: null,
    annualPrice: null,
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
    highlight: false,
    badge: null,
    features: [
      { text: "Unlimited AI calls", included: true },
      { text: "Unlimited job roles", included: true },
      { text: "Fully custom scripts & questions", included: true },
      { text: "Full transcripts + highlights", included: true },
      { text: "Dedicated success manager", included: true },
      { text: "AI scoring & ranking", included: true },
      { text: "All calendar integrations", included: true },
      { text: "All ATS integrations + custom", included: true },
      { text: "Custom voice persona", included: true },
      { text: "Analytics dashboard + exports", included: true },
    ],
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-600 mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            Start free. Scale as you grow. No hidden fees, no per-seat surprises.
          </p>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                !annual
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all ${
                annual
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Annual
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 transition-shadow ${
                plan.highlight
                  ? "border-indigo-500 bg-gradient-to-b from-indigo-600 to-violet-700 shadow-2xl shadow-indigo-500/30 scale-[1.03]"
                  : "border-slate-200 bg-white hover:shadow-lg"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-4 py-1 text-xs font-bold text-white shadow-md">
                    <Zap className="h-3 w-3 fill-current" />
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan name & price */}
              <div className="mb-6">
                <p className={`text-sm font-semibold mb-1 ${plan.highlight ? "text-indigo-200" : "text-indigo-600"}`}>
                  {plan.tagline}
                </p>
                <h3 className={`text-2xl font-bold mb-4 ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-end gap-1">
                  {plan.monthlyPrice === null ? (
                    <span className={`text-3xl font-bold ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                      Custom
                    </span>
                  ) : plan.monthlyPrice === 0 ? (
                    <span className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                      Free
                    </span>
                  ) : (
                    <>
                      <span className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                        ${annual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span className={`mb-1.5 text-sm ${plan.highlight ? "text-indigo-200" : "text-slate-500"}`}>
                        / month
                      </span>
                    </>
                  )}
                </div>
                {plan.monthlyPrice !== null && plan.monthlyPrice !== 0 && annual && (
                  <p className={`mt-1 text-xs ${plan.highlight ? "text-indigo-200" : "text-slate-400"}`}>
                    Billed annually (${(plan.annualPrice! * 12).toLocaleString()}/yr)
                  </p>
                )}
              </div>

              {/* CTA */}
              <Button
                variant={plan.highlight ? "default" : plan.ctaVariant}
                className={`w-full mb-8 font-semibold ${
                  plan.highlight
                    ? "bg-white text-indigo-700 hover:bg-indigo-50 shadow-md"
                    : plan.name === "Enterprise"
                    ? "border-slate-300 text-slate-700 hover:border-indigo-300"
                    : ""
                }`}
              >
                {plan.cta}
              </Button>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-3">
                    {f.included ? (
                      <div className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${
                        plan.highlight ? "bg-white/20" : "bg-indigo-100"
                      }`}>
                        <Check className={`h-2.5 w-2.5 ${plan.highlight ? "text-white" : "text-indigo-600"}`} />
                      </div>
                    ) : (
                      <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-slate-100">
                        <Minus className="h-2.5 w-2.5 text-slate-400" />
                      </div>
                    )}
                    <span className={`text-sm ${
                      f.included
                        ? plan.highlight ? "text-indigo-100" : "text-slate-700"
                        : plan.highlight ? "text-indigo-300/60" : "text-slate-400"
                    }`}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-10 text-center text-sm text-slate-400">
          All plans include SSL encryption, GDPR compliance, and 99.9% uptime SLA.{" "}
          <span className="text-indigo-500 cursor-pointer hover:underline">Compare all features →</span>
        </p>
      </div>
    </section>
  );
}
