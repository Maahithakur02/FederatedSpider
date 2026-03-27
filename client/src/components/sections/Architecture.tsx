import { useState, useEffect } from "react";

const HOSPITALS = [
  { id: "A", label: "HOSPITAL A", x: 180, y: 430 },
  { id: "B", label: "HOSPITAL B", x: 450, y: 450 },
  { id: "C", label: "HOSPITAL C", x: 720, y: 430 },
];
const CX = 450, CY = 195;

function getPath(hx: number, hy: number) {
  return `M ${hx} ${hy - 30} Q ${(hx + CX) / 2} ${(hy + CY) / 2 - 20} ${CX} ${CY + 55}`;
}
function getRevPath(hx: number, hy: number) {
  return `M ${CX} ${CY + 55} Q ${(hx + CX) / 2} ${(hy + CY) / 2 - 20} ${hx} ${hy - 30}`;
}

export function Architecture() {
  const [phase, setPhase] = useState<"idle" | "sending" | "aggregating" | "distributing">("idle");
  const [activeIdx, setActiveIdx] = useState(-1);
  const [pulseGlobal, setPulseGlobal] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timeouts.push(t);
      return t;
    };

    const cycle = () => {
      setPhase("sending"); setActiveIdx(0);
      schedule(() => setActiveIdx(1), 900);
      schedule(() => setActiveIdx(2), 1800);
      schedule(() => { setPhase("aggregating"); setActiveIdx(-1); setPulseGlobal(true); setTick(t => t + 1); }, 2700);
      schedule(() => { setPulseGlobal(false); setPhase("distributing"); }, 4000);
      schedule(() => { setPhase("idle"); }, 5500);
      schedule(() => cycle(), 7000);
    };
    const t = schedule(cycle, 800);
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const phaseLabel = {
    idle: "SYSTEM STATUS: ONLINE",
    sending: "UPLOADING ENCRYPTED WEIGHT UPDATES",
    aggregating: "FEDAVG AGGREGATION IN PROGRESS",
    distributing: "BROADCASTING GLOBAL MODEL",
  }[phase];

  return (
    <section id="architecture" className="py-24 bg-card/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-primary/20 mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-xs font-mono text-primary tracking-widest uppercase">Live Visualization</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">System Architecture</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Digital Twin Visualization of the Global Model Aggregation</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-primary/15" style={{ background: "#020c1a" }}>
            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: "linear-gradient(to right, rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,212,255,0.04) 1px, transparent 1px)",
              backgroundSize: "50px 50px"
            }}></div>

            <svg viewBox="0 0 900 560" className="w-full relative z-10">
              <defs>
                <filter id="glow-strong"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="glow-soft"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <radialGradient id="rg-center" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#00d4ff" stopOpacity="0"/>
                </radialGradient>
              </defs>

              {/* Status label */}
              <text x="878" y="26" textAnchor="end" fill={phase === "idle" ? "#4ade80" : "#00d4ff"}
                fontSize="10" fontFamily="monospace" fontWeight="bold" letterSpacing="2">{phaseLabel}</text>

              {/* Paths */}
              {HOSPITALS.map((h, idx) => {
                const isSend = phase === "sending" && activeIdx >= idx;
                const isDist = phase === "distributing";
                return (
                  <g key={h.id}>
                    <path d={getPath(h.x, h.y)} fill="none" stroke="#00d4ff"
                      strokeOpacity={isSend || isDist ? 0.65 : 0.12}
                      strokeWidth={isSend ? 2 : isDist ? 2 : 1}
                      strokeDasharray="9 7"
                      filter={isSend || isDist ? "url(#glow-soft)" : undefined}
                    />
                    {isSend && (
                      <circle r="5" fill="#00d4ff" filter="url(#glow-strong)" opacity="0.9">
                        <animateMotion dur="0.85s" repeatCount="indefinite" path={getPath(h.x, h.y)} />
                      </circle>
                    )}
                    {isDist && (
                      <circle r="5" fill="#a855f7" filter="url(#glow-strong)" opacity="0.9">
                        <animateMotion dur="0.9s" repeatCount="indefinite" path={getRevPath(h.x, h.y)} />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* Global Model */}
              <circle cx={CX} cy={CY} r={80} fill="url(#rg-center)" filter="url(#glow-strong)" opacity={pulseGlobal ? 1 : 0.7} />
              {pulseGlobal && (
                <circle cx={CX} cy={CY} r={82} fill="none" stroke="#00d4ff" strokeWidth="2" strokeOpacity="0.6">
                  <animate attributeName="r" from="72" to="110" dur="1s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.8" to="0" dur="1s" repeatCount="indefinite"/>
                </circle>
              )}
              <circle cx={CX} cy={CY} r={68} fill="none" stroke="#00d4ff" strokeWidth="2"
                strokeDasharray="14 8" strokeOpacity="0.75" filter="url(#glow-soft)">
                <animateTransform attributeName="transform" type="rotate" from={`0 ${CX} ${CY}`} to={`360 ${CX} ${CY}`} dur="20s" repeatCount="indefinite"/>
              </circle>
              <circle cx={CX} cy={CY} r={54} fill="#030e1c" stroke="#00d4ff" strokeWidth="1" strokeOpacity="0.25"/>
              <text x={CX} y={CY - 6} textAnchor="middle" fill="#00d4ff" fontSize="12" fontFamily="monospace" fontWeight="bold" letterSpacing="1">GLOBAL</text>
              <text x={CX} y={CY + 12} textAnchor="middle" fill="#00d4ff" fontSize="12" fontFamily="monospace" fontWeight="bold" letterSpacing="1">MODEL</text>
              {phase === "aggregating" && (
                <>
                  <text x={CX} y={CY + 28} textAnchor="middle" fill="#4ade80" fontSize="9" fontFamily="monospace">FedAvg running...</text>
                </>
              )}

              {/* Hospital Nodes */}
              {HOSPITALS.map((h, idx) => {
                const active = (phase === "sending" && activeIdx >= idx) || phase === "distributing";
                return (
                  <g key={h.id}>
                    <rect x={h.x - 55} y={h.y - 30} width="110" height="60" rx="8"
                      fill="#040f1e" stroke={active ? "#00d4ff" : "#0d2a45"}
                      strokeWidth={active ? 2 : 1}
                      filter={active ? "url(#glow-soft)" : undefined}/>
                    {active && <rect x={h.x - 55} y={h.y - 30} width="110" height="60" rx="8" fill="#00d4ff" fillOpacity="0.04"/>}
                    <circle cx={h.x - 43} cy={h.y - 17} r="3.5" fill={active ? "#4ade80" : "#0d2a45"}>
                      {active && <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite"/>}
                    </circle>
                    <text x={h.x} y={h.y - 9} textAnchor="middle" fill={active ? "#00d4ff" : "#2d6a9f"}
                      fontSize="10" fontFamily="monospace" fontWeight="bold" letterSpacing="2">{h.label}</text>
                    <text x={h.x} y={h.y + 9} textAnchor="middle" fill={active ? "#4ade80" : "#1e3a5f"} fontSize="9" fontFamily="monospace">
                      {phase === "sending" && activeIdx >= idx ? "TRAINING →" : phase === "distributing" ? "← RECEIVING" : "STANDBY"}
                    </text>
                  </g>
                );
              })}

              {/* Legend */}
              <g transform="translate(18,516)">
                <circle cx="6" cy="6" r="5" fill="#00d4ff" filter="url(#glow-soft)"/>
                <text x="18" y="10" fill="#2d6a9f" fontSize="10" fontFamily="monospace">Central Aggregator (FedAvg)</text>
                <rect x="200" y="0" width="16" height="12" rx="2" fill="#040f1e" stroke="#0d2a45" strokeWidth="1"/>
                <text x="222" y="10" fill="#2d6a9f" fontSize="10" fontFamily="monospace">Federated Hospital Node</text>
                <line x1="400" y1="6" x2="432" y2="6" stroke="#00d4ff" strokeWidth="1.5" strokeDasharray="7,5"/>
                <text x="440" y="10" fill="#2d6a9f" fontSize="10" fontFamily="monospace">Encrypted Weight Transfer</text>
              </g>
            </svg>
          </div>

          {/* Phase pills */}
          <div className="mt-5 flex gap-2 justify-center flex-wrap">
            {[
              { p: "idle", label: "System Online" },
              { p: "sending", label: "Training & Upload" },
              { p: "aggregating", label: "FedAvg Running" },
              { p: "distributing", label: "Global Distribution" },
            ].map(({ p, label }) => (
              <div key={p} className={`px-4 py-1.5 rounded-full text-xs font-mono border transition-all duration-300 ${
                phase === p ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-muted-foreground/50"
              }`}>
                {phase === p && <span className="mr-1.5 animate-pulse">●</span>}{label}
              </div>
            ))}
          </div>
        </div>

        {/* Concept cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {[
            { title: "FedAvg", color: "border-primary/30 bg-primary/5", desc: "Federated Averaging aggregates hospital model weights proportionally by local data size. It's mathematically equivalent to gradient descent on the full distributed dataset." },
            { title: "Differential Privacy", color: "border-purple-500/30 bg-purple-500/5", desc: "Calibrated Gaussian noise (σ) is added to weight gradients before transmission: ΔW̃ = ΔW + N(0, σ²). This prevents model inversion attacks and membership inference." },
            { title: "Convergence", color: "border-green-500/30 bg-green-500/5", desc: "Global model accuracy improves each communication round. Federated models typically converge within 5–10 rounds, matching centralized training within ±2% accuracy." },
          ].map((c, i) => (
            <div key={i} className={`glass-panel rounded-xl p-5 border ${c.color}`}>
              <h4 className="font-display font-bold text-foreground mb-2">{c.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
