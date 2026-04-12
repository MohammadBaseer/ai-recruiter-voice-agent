import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mic2, ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Glowing orb */}
        <div className="relative inline-flex mb-8">
          <div className="absolute inset-0 rounded-full bg-indigo-500/30 blur-2xl scale-150" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/30">
            <Mic2 className="h-8 w-8 text-white" />
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
          Ready to hire{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            10x faster?
          </span>
        </h2>
        <p className="mt-5 text-lg text-slate-500 max-w-2xl mx-auto">
          Start your free trial today. Import your first candidate list in minutes — no credit card,
          no engineering setup required.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="h-13 px-10 bg-indigo-600 hover:bg-indigo-500 text-white text-base font-semibold shadow-xl shadow-indigo-500/25 group"
          >
            Get Started — It&apos;s Free
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-13 px-8 text-slate-600 border-slate-200 hover:border-indigo-300 text-base"
          >
            Book a Demo
          </Button>
        </div>

        <p className="mt-5 text-sm text-slate-400">
          50 free calls/month · No setup fees · Cancel anytime
        </p>
      </div>
    </section>
  );
}

export function Footer() {
  const links = {
    Product: ["Features", "Pricing", "Changelog", "Roadmap"],
    Company: ["About", "Blog", "Careers", "Press"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
    Support: ["Documentation", "Help Center", "API Reference", "Status"],
  };

  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <Mic2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-900">
                Recruiter<span className="text-indigo-600">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              The AI voice agent that screens candidates so your team doesn&apos;t have to.
            </p>
            <div className="mt-5 flex gap-3">
              {/* X (Twitter) */}
              <button className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </button>
              {/* LinkedIn */}
              <button className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </button>
              {/* GitHub */}
              <button className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
              </button>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                {group}
              </p>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} RecruiterAI. All rights reserved.
          </p>
          <p className="text-sm text-slate-400">
            Built with{" "}
            <span className="text-indigo-500">♥</span>{" "}
            for modern recruiting teams
          </p>
        </div>
      </div>
    </footer>
  );
}
