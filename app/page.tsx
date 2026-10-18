"use client";

import { useState } from "react";

const signals = [
  {
    id: "decision-flow",
    title: "Decision Flow",
    description: "Executive approval appears across several cross-functional decisions.",
    evidenceCount: "7 conversations",
    recurring: ["approval", "waiting", "decision", "leadership"],
    evidence: [
      { person: "Engineering Lead", quote: "Even relatively small decisions sometimes move upward before we can act." },
      { person: "Product Director", quote: "There are situations where everyone agrees, but we still wait for executive confirmation." },
    ],
  },
  {
    id: "product-sales",
    title: "Product ↔ Sales",
    description: "Communication friction appears repeatedly between Product and Sales.",
    evidenceCount: "6 conversations",
    recurring: ["handoff", "priorities", "customer", "late", "context", "planning"],
    evidence: [
      { person: "VP of Sales", quote: "We often hear something from customers that Product doesn't learn about until planning has already started." },
      { person: "Product Manager", quote: "Priorities sometimes arrive without the customer context behind them." },
      { person: "Sales Director", quote: "We aren't always sure what happened after feedback was passed along." },
    ],
  },
  {
    id: "customer-feedback",
    title: "Customer Feedback",
    description: "Customer information may be losing context as it moves through the organization.",
    evidenceCount: "4 conversations",
    recurring: ["feedback", "context", "customer", "handoff"],
    evidence: [
      { person: "Customer Success Lead", quote: "We collect a lot of useful feedback, but it isn't always clear where it goes next." },
      { person: "Marketing Lead", quote: "Different teams sometimes walk away with different interpretations of the same customer feedback." },
    ],
  },
];

const possibleShifts = [
  {
    title: "Bring customer context closer to planning",
    description: "Explore ways customer evidence could remain visible as priorities move between Sales and Product.",
  },
  {
    title: "Create a shared feedback loop",
    description: "Explore whether teams could see what happened after customer feedback was passed along.",
  },
  {
    title: "Test earlier cross-team sensemaking",
    description: "Explore whether Product and Sales could examine emerging customer signals together before planning begins.",
  },
];

export default function Home() {
  const [selectedSignal, setSelectedSignal] = useState<(typeof signals)[number] | null>(null);
  const [inquiryMode, setInquiryMode] = useState(false);
  const [possibilityMode, setPossibilityMode] = useState(false);
  const [experimentMode, setExperimentMode] = useState(false);
  const [learningMode, setLearningMode] = useState(false);

  const [reflection, setReflection] = useState("");
  const [possibility, setPossibility] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [experiment, setExperiment] = useState("");
  const [observation, setObservation] = useState("");
  const [learningQuestion, setLearningQuestion] = useState("");

  const clearWorkflow = () => {
    setReflection("");
    setPossibility("");
    setHypothesis("");
    setExperiment("");
    setObservation("");
    setLearningQuestion("");
  };

  const selectSignal = (signal: (typeof signals)[number]) => {
    setSelectedSignal(signal);
    setInquiryMode(false);
    setPossibilityMode(false);
    setExperimentMode(false);
    setLearningMode(false);
    clearWorkflow();
  };

  const returnToSystem = () => {
    setSelectedSignal(null);
    setInquiryMode(false);
    setPossibilityMode(false);
    setExperimentMode(false);
    setLearningMode(false);
    clearWorkflow();
  };

  return (
    <main className="min-h-screen bg-[#f7f8f6] text-[#18201c]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">InsightFlow</h1>
            <p className="text-xs text-black/45">Living Systems Lab</p>
          </div>
          <nav className="flex items-center gap-8 text-sm">
            <button className="font-medium text-black">Explore</button>
            <button className="text-black/45 transition hover:text-black">Inquiry</button>
            <button className="text-black/45 transition hover:text-black">Experiments</button>
          </nav>
          <div className="rounded-full border border-black/10 bg-[#f7f8f6] px-4 py-2 text-xs">Fictional Organization</div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-8 py-10">
        <section className="mb-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-black/40">System Overview</p>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-4xl font-medium tracking-tight">Meridian Labs</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">Explore relationships, patterns, and emerging signals across a fictional organization.</p>
            </div>
            <button className="rounded-full bg-[#18201c] px-6 py-3 text-sm font-medium text-white transition hover:opacity-85">Begin Inquiry</button>
          </div>
        </section>

        <section className="grid min-h-[580px] grid-cols-[1fr_360px] overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
          <div className="relative border-r border-black/10 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Living Network</h3>
                <p className="mt-1 text-xs text-black/40">Select a relationship to explore its evidence.</p>
              </div>
              <div className="rounded-full bg-[#f2f4f1] px-3 py-1.5 text-xs text-black/50">7 teams · 11 relationships</div>
            </div>

            <div className="relative mt-8 h-[440px] rounded-2xl bg-[#fafbf9]">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 700 440" preserveAspectRatio="none">
                <line x1="350" y1="70" x2="230" y2="180" stroke="#c7ccc8" strokeWidth="2" />
                <line x1="350" y1="70" x2="470" y2="180" stroke="#c7ccc8" strokeWidth="2" />
                <line x1="230" y1="180" x2="470" y2="180" stroke={selectedSignal?.id === "product-sales" ? "#33463a" : "#8c9b90"} strokeWidth={selectedSignal?.id === "product-sales" ? "5" : "3"} strokeDasharray={selectedSignal?.id === "product-sales" ? "0" : "7 6"} className="transition-all duration-300" />
                <line x1="230" y1="180" x2="470" y2="180" stroke="transparent" strokeWidth="20" className="cursor-pointer" onClick={() => { const signal = signals.find((item) => item.id === "product-sales"); if (signal) selectSignal(signal); }} />
                <line x1="230" y1="180" x2="125" y2="300" stroke="#c7ccc8" strokeWidth="2" />
                <line x1="230" y1="180" x2="300" y2="310" stroke="#c7ccc8" strokeWidth="2" />
                <line x1="470" y1="180" x2="570" y2="300" stroke="#c7ccc8" strokeWidth="2" />
                <line x1="125" y1="300" x2="350" y2="385" stroke="#c7ccc8" strokeWidth="2" />
                <line x1="570" y1="300" x2="350" y2="385" stroke="#c7ccc8" strokeWidth="2" />
              </svg>
              <Node label="Leadership" top="7%" left="50%" highlight />
              <Node label="Product" top="33%" left="33%" selected={selectedSignal?.id === "product-sales"} />
              <Node label="Sales" top="33%" left="67%" selected={selectedSignal?.id === "product-sales"} />
              <Node label="Engineering" top="61%" left="15%" />
              <Node label="Design" top="64%" left="43%" />
              <Node label="Marketing" top="61%" left="82%" />
              <Node label="Customer Success" top="83%" left="50%" />
            </div>

            <div className="mt-5 flex items-center gap-5 text-xs text-black/40">
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#33463a]" />Team</span>
              <span className="flex items-center gap-2"><span className="h-[2px] w-5 bg-[#c7ccc8]" />Relationship</span>
              <span className="flex items-center gap-2"><span className="h-[2px] w-5 border-t-2 border-dashed border-[#8c9b90]" />Pattern detected</span>
            </div>
          </div>

          <aside className="bg-[#fcfcfb] p-7">
            {selectedSignal && learningMode ? (
              <div>
                <button onClick={() => setLearningMode(false)} className="mb-6 text-xs font-medium text-black/40 transition hover:text-black">← Back to experiment</button>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35">Learning</p>
                <h3 className="mt-2 text-2xl font-medium">Your learning record</h3>
                <p className="mt-3 text-sm leading-6 text-black/55">Your reasoning now travels with the experiment, creating a record that can be revisited as new evidence emerges.</p>

                <div className="mt-6 rounded-2xl border border-black/8 bg-white p-5">
                  <Record label="Pattern" value={selectedSignal.title} />
                  <Record label="Reflection" value={reflection} empty="No reflection captured." />
                  <Record label="Possibility" value={possibility} empty="No possibility captured." />
                  <Record label="Hypothesis" value={hypothesis} empty="No hypothesis captured." />
                  <Record label="Small Experiment" value={experiment} empty="No experiment captured." />
                  <Record label="What We Would Observe" value={observation} empty="No observations defined." />
                  <Record label="Learning Question" value={learningQuestion} empty="No learning question captured." last />
                </div>

                <div className="mt-5 rounded-2xl bg-[#eef1ed] p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-black/35">Learning Loop</p>
                  <div className="mt-4 space-y-3 text-xs text-black/60">
                    <p>Observe what changes.</p><p>Notice what remains unchanged.</p><p>Look for unexpected effects elsewhere in the system.</p><p>Compare what happened with the original assumptions.</p>
                  </div>
                </div>

                <button onClick={returnToSystem} className="mt-6 w-full rounded-xl bg-[#18201c] px-5 py-3.5 text-sm font-medium text-white transition hover:opacity-85">Return to system →</button>
              </div>
            ) : selectedSignal && experimentMode ? (
              <div>
                <button onClick={() => setExperimentMode(false)} className="mb-6 text-xs font-medium text-black/40 transition hover:text-black">← Back to possibilities</button>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35">Experiment</p>
                <h3 className="mt-2 text-2xl font-medium">Test a small change</h3>
                <p className="mt-3 text-sm leading-6 text-black/55">Turn a possibility into a small, observable experiment designed to generate learning rather than prove an answer.</p>

                {possibility && <div className="mt-6 rounded-2xl bg-[#eef1ed] p-4"><p className="text-xs font-medium uppercase tracking-[0.12em] text-black/35">Possibility being tested</p><p className="mt-2 text-xs leading-5 text-black/60">{possibility}</p></div>}

                <div className="mt-7 space-y-5">
                  <Field label="Hypothesis" value={hypothesis} onChange={setHypothesis} placeholder="If we change something in this relationship, what do we think might happen?" />
                  <Field label="Small Experiment" value={experiment} onChange={setExperiment} placeholder="What is one small change the organization could test?" />
                  <Field label="What We Would Observe" value={observation} onChange={setObservation} placeholder="What signals, behaviors, or outcomes would we pay attention to?" />
                </div>

                <div className="mt-7 rounded-2xl bg-[#eef1ed] p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-black/35">Learning Question</p>
                  <p className="mt-2 text-xs leading-5 text-black/55">What would this experiment help us understand about the system, regardless of whether the change works as expected?</p>
                  <textarea value={learningQuestion} onChange={(event) => setLearningQuestion(event.target.value)} placeholder="What do we hope to learn?" className="mt-3 min-h-20 w-full resize-none rounded-xl border border-black/8 bg-white p-3 text-xs leading-5 outline-none placeholder:text-black/30 focus:border-black/20" />
                </div>
                <button onClick={() => setLearningMode(true)} className="mt-5 w-full rounded-xl bg-[#18201c] px-5 py-3.5 text-sm font-medium text-white transition hover:opacity-85">Complete experiment design →</button>
              </div>
            ) : selectedSignal && possibilityMode ? (
              <div>
                <button onClick={() => { setPossibilityMode(false); setExperimentMode(false); }} className="mb-6 text-xs font-medium text-black/40 transition hover:text-black">← Back to inquiry</button>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35">Possibilities</p>
                <h3 className="mt-2 text-2xl font-medium">What could change?</h3>
                <p className="mt-3 text-sm leading-6 text-black/55">Explore possible shifts in the system without treating any one path as the answer.</p>

                {reflection && <div className="mt-6 rounded-2xl border border-black/8 bg-white p-4"><p className="text-xs font-medium uppercase tracking-[0.12em] text-black/35">Reflection carried forward</p><p className="mt-2 text-xs leading-5 text-black/60">{reflection}</p></div>}

                <div className="mt-7">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-black/35">Possible Shifts</p>
                  <p className="mt-2 text-xs leading-5 text-black/45">Select one as a starting point, or write your own. These are directions for exploration, not recommendations.</p>
                  <div className="mt-4 space-y-3">
                    {possibleShifts.map((item, index) => (
                      <button key={item.title} onClick={() => setPossibility(item.title)} className={`group w-full rounded-xl border p-4 text-left transition hover:shadow-sm ${possibility === item.title ? "border-[#33463a] bg-[#f2f4f1]" : "border-black/8 bg-white hover:border-black/20"}`}>
                        <div className="flex items-start gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eef1ed] text-[10px] font-medium">{index + 1}</span><div><p className="text-xs font-medium">{item.title}</p><p className="mt-1.5 text-xs leading-5 text-black/50">{item.description}</p></div></div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-7 rounded-2xl bg-[#eef1ed] p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-black/35">Your Possibility</p>
                  <textarea value={possibility} onChange={(event) => setPossibility(event.target.value)} placeholder="What change in the system would you like to explore?" className="mt-3 min-h-24 w-full resize-none rounded-xl border border-black/8 bg-white p-3 text-xs leading-5 outline-none placeholder:text-black/30 focus:border-black/20" />
                </div>
                <button onClick={() => setExperimentMode(true)} className="mt-5 w-full rounded-xl bg-[#18201c] px-5 py-3.5 text-sm font-medium text-white transition hover:opacity-85">Design an experiment →</button>
              </div>
            ) : selectedSignal && inquiryMode ? (
              <div>
                <button onClick={() => { setInquiryMode(false); setPossibilityMode(false); }} className="mb-6 text-xs font-medium text-black/40 transition hover:text-black">← Back to evidence</button>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35">Inquiry Mode</p>
                <h3 className="mt-2 text-2xl font-medium">Explore the pattern</h3>
                <p className="mt-3 text-sm leading-6 text-black/55">Rather than treating this signal as a conclusion, explore what the evidence might reveal and what assumptions may be shaping the system.</p>
                <div className="mt-6 rounded-2xl border border-black/8 bg-white p-4"><p className="text-xs font-medium uppercase tracking-[0.12em] text-black/35">Selected Signal</p><p className="mt-2 text-sm font-medium">{selectedSignal.title}</p><p className="mt-1 text-xs leading-5 text-black/50">{selectedSignal.description}</p></div>

                <div className="mt-7">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-black/35">Questions for Inquiry</p>
                  <div className="mt-3 space-y-3">
                    {["What assumptions might be shaping this relationship?", "Where might information be losing context as it moves through the system?", "What evidence would challenge our current interpretation?", "Whose perspective might be missing from the evidence?", "What might become possible if this relationship changed?"].map((question, index) => (
                      <div key={question} className="flex w-full items-start gap-3 rounded-xl border border-black/8 bg-white p-4"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eef1ed] text-[10px] font-medium">{index + 1}</span><span className="text-xs leading-5 text-black/60">{question}</span></div>
                    ))}
                  </div>
                </div>

                <div className="mt-7 rounded-2xl bg-[#eef1ed] p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-black/35">Reflection</p>
                  <textarea value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="Capture an observation, assumption, or question..." className="mt-3 min-h-24 w-full resize-none rounded-xl border border-black/8 bg-white p-3 text-xs leading-5 outline-none placeholder:text-black/30 focus:border-black/20" />
                </div>
                <button onClick={() => setPossibilityMode(true)} className="mt-5 w-full rounded-xl bg-[#18201c] px-5 py-3.5 text-sm font-medium text-white transition hover:opacity-85">Explore possibilities →</button>
              </div>
            ) : selectedSignal ? (
              <div>
                <button onClick={returnToSystem} className="mb-6 text-xs font-medium text-black/40 transition hover:text-black">← All system signals</button>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35">Relationship Signal</p>
                <h3 className="mt-2 text-2xl font-medium">{selectedSignal.title}</h3>
                <p className="mt-3 text-sm leading-6 text-black/55">{selectedSignal.description}</p>
                <div className="mt-5 rounded-xl bg-[#eef1ed] px-4 py-3"><p className="text-xs text-black/45">Evidence found across</p><p className="mt-1 text-sm font-medium">{selectedSignal.evidenceCount}</p></div>
                <div className="mt-7"><p className="text-xs font-medium uppercase tracking-[0.14em] text-black/35">Evidence</p><div className="mt-3 space-y-3">{selectedSignal.evidence.map((item) => <div key={item.person} className="rounded-xl border border-black/8 bg-white p-4"><p className="text-xs font-medium">{item.person}</p><p className="mt-2 text-xs leading-5 text-black/50">“{item.quote}”</p></div>)}</div></div>
                <div className="mt-7"><p className="text-xs font-medium uppercase tracking-[0.14em] text-black/35">Recurring Language</p><div className="mt-3 flex flex-wrap gap-2">{selectedSignal.recurring.map((word) => <span key={word} className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-black/50">{word}</span>)}</div></div>
                <button onClick={() => setInquiryMode(true)} className="mt-8 w-full rounded-xl bg-[#18201c] px-5 py-3.5 text-sm font-medium text-white transition hover:opacity-85">Explore this pattern →</button>
              </div>
            ) : (
              <>
                <div className="mb-6"><p className="text-xs font-medium uppercase tracking-[0.16em] text-black/35">System Signals</p><h3 className="mt-2 text-xl font-medium">3 patterns may warrant exploration</h3><p className="mt-2 text-sm leading-6 text-black/45">Signals are observations for investigation, not conclusions.</p></div>
                <div className="space-y-3">{signals.map((signal, index) => <button key={signal.id} onClick={() => selectSignal(signal)} className="group w-full rounded-2xl border border-black/8 bg-white p-4 text-left transition hover:border-black/20 hover:shadow-sm"><div className="mb-3 flex items-center justify-between"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eef1ed] text-xs font-medium">0{index + 1}</span><span className="text-[11px] text-black/35">{signal.evidenceCount}</span></div><h4 className="text-sm font-medium">{signal.title}</h4><p className="mt-1.5 text-xs leading-5 text-black/50">{signal.description}</p><p className="mt-3 text-xs font-medium text-[#536b5a] opacity-0 transition group-hover:opacity-100">Explore evidence →</p></button>)}</div>
              </>
            )}
          </aside>
        </section>

        <section className="mx-auto mt-6 flex max-w-3xl items-center gap-3 rounded-2xl border border-black/10 bg-white p-2 shadow-sm">
          <input type="text" placeholder="Ask InsightFlow about this system..." className="flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-black/30" />
          <button className="rounded-xl bg-[#18201c] px-5 py-3 text-sm font-medium text-white">Explore</button>
        </section>
        <p className="mt-3 text-center text-[11px] text-black/30">InsightFlow surfaces patterns for human inquiry. It does not make organizational decisions.</p>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <div><label className="text-xs font-medium uppercase tracking-[0.12em] text-black/35">{label}</label><textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 min-h-20 w-full resize-none rounded-xl border border-black/8 bg-white p-3 text-xs leading-5 outline-none placeholder:text-black/30 focus:border-black/20" /></div>;
}

function Record({ label, value, empty, last = false }: { label: string; value: string; empty?: string; last?: boolean }) {
  return <div className={last ? "" : "mb-5 border-b border-black/8 pb-5"}><p className="text-xs font-medium uppercase tracking-[0.12em] text-black/35">{label}</p><p className={`mt-2 text-xs leading-5 ${value ? "text-black/65" : "italic text-black/35"}`}>{value || empty}</p></div>;
}

function Node({ label, top, left, highlight = false, selected = false }: { label: string; top: string; left: string; highlight?: boolean; selected?: boolean }) {
  return <button className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-4 py-2.5 text-xs font-medium shadow-sm transition hover:-translate-y-[55%] hover:shadow-md ${highlight || selected ? "border-[#33463a] bg-[#33463a] text-white" : "border-black/10 bg-white text-[#263129]"}`} style={{ top, left }}>{label}</button>;
}
