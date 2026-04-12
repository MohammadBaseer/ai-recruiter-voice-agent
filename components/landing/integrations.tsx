import { Zap } from "lucide-react";

const integrations = [
  // ATS
  { name: "Greenhouse", category: "ATS", color: "bg-green-500", letter: "G" },
  { name: "Lever", category: "ATS", color: "bg-blue-500", letter: "L" },
  { name: "Ashby", category: "ATS", color: "bg-violet-500", letter: "A" },
  { name: "Workday", category: "ATS", color: "bg-orange-500", letter: "W" },
  { name: "BambooHR", category: "ATS", color: "bg-green-600", letter: "B" },
  { name: "Rippling", category: "ATS", color: "bg-yellow-500", letter: "R" },
  // Calendar
  { name: "Google Calendar", category: "Calendar", color: "bg-red-500", letter: "G" },
  { name: "Outlook", category: "Calendar", color: "bg-blue-600", letter: "O" },
  { name: "Calendly", category: "Calendar", color: "bg-teal-500", letter: "C" },
  // Comms
  { name: "Slack", category: "Notifications", color: "bg-purple-500", letter: "S" },
  { name: "Zoom", category: "Meetings", color: "bg-blue-500", letter: "Z" },
  { name: "Teams", category: "Meetings", color: "bg-indigo-600", letter: "T" },
];

const categoryColors: Record<string, string> = {
  ATS: "border-green-200 bg-green-50 text-green-700",
  Calendar: "border-red-200 bg-red-50 text-red-700",
  Notifications: "border-purple-200 bg-purple-50 text-purple-700",
  Meetings: "border-blue-200 bg-blue-50 text-blue-700",
};

export function Integrations() {
  return (
    <section id="integrations" className="py-24 sm:py-32 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: copy */}
          <div>
            <span className="inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-600 mb-4">
              Integrations
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Plugs into your
              <br />
              existing stack
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed mb-8">
              RecruiterAI connects with your ATS, calendar, and communication tools
              out of the box. No custom engineering required — just authenticate and go.
            </p>
            <ul className="space-y-3">
              {[
                { icon: "🔌", text: "One-click OAuth connections for all major ATS platforms" },
                { icon: "📅", text: "Two-way calendar sync — reads availability, creates events" },
                { icon: "🔔", text: "Slack / Teams notifications for every screening milestone" },
                { icon: "🔗", text: "Zapier & Make webhooks for custom automations" },
                { icon: "🛠️", text: "REST API + SDKs for deeper custom integrations" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="mt-0.5 text-base leading-none">{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: integration grid */}
          <div className="mt-12 lg:mt-0">
            {/* Center orb */}
            <div className="relative flex items-center justify-center">
              <div className="absolute h-64 w-64 rounded-full border border-dashed border-indigo-200 animate-[spin_30s_linear_infinite]" />
              <div className="absolute h-44 w-44 rounded-full border border-dashed border-violet-200 animate-[spin_20s_linear_infinite_reverse]" />

              {/* Center logo */}
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/30">
                <Zap className="h-7 w-7 text-white" />
              </div>

              {/* Orbiting integration icons */}
              {integrations.slice(0, 8).map((int, i) => {
                const angle = (i / 8) * 360;
                const rad = (angle - 90) * (Math.PI / 180);
                const radius = 120;
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius;
                return (
                  <div
                    key={int.name}
                    className="absolute z-10"
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                    title={int.name}
                  >
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${int.color} shadow-md text-white text-sm font-bold hover:scale-110 transition-transform cursor-default`}>
                      {int.letter}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Integration tiles list below the orb */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {integrations.map((int) => (
                <div
                  key={int.name}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${int.color} text-white text-xs font-bold`}>
                    {int.letter}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 leading-tight">{int.name}</p>
                    <span className={`mt-0.5 inline-block rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${categoryColors[int.category]}`}>
                      {int.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
