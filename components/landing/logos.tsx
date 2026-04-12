const companies = [
  { name: "Stripe", style: "font-bold tracking-tight" },
  { name: "Notion", style: "font-semibold" },
  { name: "Linear", style: "font-bold tracking-wider" },
  { name: "Vercel", style: "font-bold" },
  { name: "Figma", style: "font-semibold tracking-tight" },
  { name: "Loom", style: "font-bold tracking-wide" },
  { name: "Rippling", style: "font-semibold" },
  { name: "Lattice", style: "font-bold tracking-tight" },
  { name: "Ashby", style: "font-semibold tracking-wider" },
  { name: "Greenhouse", style: "font-bold" },
  { name: "Workday", style: "font-semibold tracking-tight" },
  { name: "Lever", style: "font-bold tracking-wide" },
];

export function Logos() {
  return (
    <section className="border-y border-slate-100 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-8">
          Trusted by talent teams at leading companies
        </p>

        {/* Scrolling marquee */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="flex gap-14 animate-marquee w-max">
            {[...companies, ...companies].map((company, i) => (
              <div
                key={i}
                className={`flex-shrink-0 text-slate-300 hover:text-slate-500 transition-colors text-xl ${company.style} select-none`}
              >
                {company.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
