const signals = [
  {
    title: "Decision Flow",
    description:
      "Executive approval appears across several cross-functional decisions.",
    evidence: "7 conversations",
  },
  {
    title: "Product ↔ Sales",
    description:
      "Communication friction appears repeatedly between Product and Sales.",
    evidence: "6 conversations",
  },
  {
    title: "Customer Feedback",
    description:
      "Customer information may be losing context as it moves through the organization.",
    evidence: "4 conversations",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8f6] text-[#18201c]">
      {/* Navigation */}
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">InsightFlow</h1>
            <p className="text-xs text-black/45">Living Systems Lab</p>
          </div>

          <nav className="flex items-center gap-8 text-sm">
            <button className="font-medium text-black">Explore</button>
            <button className="text-black/45 transition hover:text-black">
              Inquiry
            </button>
            <button className="text-black/45 transition hover:text-black">
              Experiments
            </button>
          </nav>

          <div className="rounded-full border border-black/10 bg-[#f7f8f6] px-4 py-2 text-xs">
            Fictional Organization
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-8 py-10">
        {/* Introduction */}
        <section className="mb-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-black/40">
            System Overview
          </p>

          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-4xl font-medium tracking-tight">
                Meridian Labs
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">
                Explore relationships, patterns, and emerging signals across a
                fictional organization.
              </p>
            </div>

            <button className="rounded-full bg-[#18201c] px-6 py-3 text-sm font-medium text-white transition hover:opacity-85">
              Begin Inquiry
            </button>
          </div>
        </section>

        {/* Main workspace */}
        <section className="grid min-h-[580px] grid-cols-[1fr_360px] overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
          {/* Network */}
          <div className="relative border-r border-black/10 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Living Network</h3>
                <p className="mt-1 text-xs text-black/40">
                  Select a relationship to explore its evidence.
                </p>
              </div>

              <div className="rounded-full bg-[#f2f4f1] px-3 py-1.5 text-xs text-black/50">
                7 teams · 11 relationships
              </div>
            </div>

            {/* Network canvas */}
            <div className="relative mt-8 h-[440px] rounded-2xl bg-[#fafbf9]">
              {/* Relationship lines */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 700 440"
                preserveAspectRatio="none"
              >
                <line
                  x1="350"
                  y1="70"
                  x2="230"
                  y2="180"
                  stroke="#c7ccc8"
                  strokeWidth="2"
                />
                <line
                  x1="350"
                  y1="70"
                  x2="470"
                  y2="180"
                  stroke="#c7ccc8"
                  strokeWidth="2"
                />
                <line
                  x1="230"
                  y1="180"
                  x2="470"
                  y2="180"
                  stroke="#8c9b90"
                  strokeWidth="3"
                  strokeDasharray="7 6"
                />
                <line
                  x1="230"
                  y1="180"
                  x2="125"
                  y2="300"
                  stroke="#c7ccc8"
                  strokeWidth="2"
                />
                <line
                  x1="230"
                  y1="180"
                  x2="300"
                  y2="310"
                  stroke="#c7ccc8"
                  strokeWidth="2"
                />
                <line
                  x1="470"
                  y1="180"
                  x2="570"
                  y2="300"
                  stroke="#c7ccc8"
                  strokeWidth="2"
                />
                <line
                  x1="125"
                  y1="300"
                  x2="350"
                  y2="385"
                  stroke="#c7ccc8"
                  strokeWidth="2"
                />
                <line
                  x1="570"
                  y1="300"
                  x2="350"
                  y2="385"
                  stroke="#c7ccc8"
                  strokeWidth="2"
                />
              </svg>

              <Node label="Leadership" top="7%" left="50%" highlight />
              <Node label="Product" top="33%" left="33%" />
              <Node label="Sales" top="33%" left="67%" />
              <Node label="Engineering" top="61%" left="15%" />
              <Node label="Design" top="64%" left="43%" />
              <Node label="Marketing" top="61%" left="82%" />
              <Node label="Customer Success" top="83%" left="50%" />
            </div>

            <div className="mt-5 flex items-center gap-5 text-xs text-black/40">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#33463a]" />
                Team
              </span>

              <span className="flex items-center gap-2">
                <span className="h-[2px] w-5 bg-[#c7ccc8]" />
                Relationship
              </span>

              <span className="flex items-center gap-2">
                <span className="h-[2px] w-5 border-t-2 border-dashed border-[#8c9b90]" />
                Pattern detected
              </span>
            </div>
          </div>

          {/* Signals panel */}
          <aside className="bg-[#fcfcfb] p-7">
            <div className="mb-6">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35">
                System Signals
              </p>

              <h3 className="mt-2 text-xl font-medium">
                3 patterns may warrant exploration
              </h3>

              <p className="mt-2 text-sm leading-6 text-black/45">
                Signals are observations for investigation, not conclusions.
              </p>
            </div>

            <div className="space-y-3">
              {signals.map((signal, index) => (
                <button
                  key={signal.title}
                  className="group w-full rounded-2xl border border-black/8 bg-white p-4 text-left transition hover:border-black/20 hover:shadow-sm"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eef1ed] text-xs font-medium">
                      0{index + 1}
                    </span>

                    <span className="text-[11px] text-black/35">
                      {signal.evidence}
                    </span>
                  </div>

                  <h4 className="text-sm font-medium">{signal.title}</h4>

                  <p className="mt-1.5 text-xs leading-5 text-black/50">
                    {signal.description}
                  </p>

                  <p className="mt-3 text-xs font-medium text-[#536b5a] opacity-0 transition group-hover:opacity-100">
                    Explore evidence →
                  </p>
                </button>
              ))}
            </div>
          </aside>
        </section>

        {/* Inquiry bar */}
        <section className="mx-auto mt-6 flex max-w-3xl items-center gap-3 rounded-2xl border border-black/10 bg-white p-2 shadow-sm">
          <input
            type="text"
            placeholder="Ask InsightFlow about this system..."
            className="flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-black/30"
          />

          <button className="rounded-xl bg-[#18201c] px-5 py-3 text-sm font-medium text-white">
            Explore
          </button>
        </section>

        <p className="mt-3 text-center text-[11px] text-black/30">
          InsightFlow surfaces patterns for human inquiry. It does not make
          organizational decisions.
        </p>
      </div>
    </main>
  );
}

function Node({
  label,
  top,
  left,
  highlight = false,
}: {
  label: string;
  top: string;
  left: string;
  highlight?: boolean;
}) {
  return (
    <button
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-4 py-2.5 text-xs font-medium shadow-sm transition hover:-translate-y-[55%] hover:shadow-md ${
        highlight
          ? "border-[#33463a] bg-[#33463a] text-white"
          : "border-black/10 bg-white text-[#263129]"
      }`}
      style={{ top, left }}
    >
      {label}
    </button>
  );
}