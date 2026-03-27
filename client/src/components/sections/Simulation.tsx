import { useState, useEffect, useRef } from "react";
import { useTrainingStatus, useStartTraining, useResetTraining } from "@/hooks/use-training";
import { useDatasets } from "@/hooks/use-datasets";
import { Play, RotateCcw, Download, Activity, ShieldCheck, TrendingUp, BarChart3, Brain } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Legend, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, ReferenceLine,
} from "recharts";

const HOSPITALS = ["Hospital A", "Hospital B", "Hospital C"];
const H_COLORS = ["#00d4ff", "#ff00d4", "#d4ff00"];

export function Simulation() {
  const { data: status } = useTrainingStatus();
  const { data: datasets } = useDatasets();
  const startMutation = useStartTraining();
  const resetMutation = useResetTraining();
  const [selectedDataset, setSelectedDataset] = useState("");

  const isTraining = !!(status && status.status !== "Idle" && status.status !== "Completed");
  const isDone = status?.status === "Completed";
  const history = status?.history || [];

  // Build weight chart data from latest round
  const weightData = (() => {
    if (!status?.weights?.length) return [];
    const maxLen = Math.min(...status.weights.map(w => w.values.length));
    return Array.from({ length: maxLen }, (_, i) => ({
      name: `F${i + 1}`,
      hA: parseFloat(status.weights[0].values[i]?.toFixed(4) ?? "0"),
      hB: parseFloat(status.weights[1].values[i]?.toFixed(4) ?? "0"),
      hC: parseFloat(status.weights[2].values[i]?.toFixed(4) ?? "0"),
    }));
  })();

  // Per-hospital accuracy
  const hospitalAccData = HOSPITALS.map((h, i) => ({
    hospital: h.replace("Hospital ", "H"),
    accuracy: status?.hospitalAccuracies?.[i] ?? 0,
    loss: status?.weights?.[i]?.loss ?? 0,
  }));

  // Global improvement delta
  const deltaData = history.map((h, i) => ({
    round: `R${h.round}`,
    accuracy: h.accuracy,
    loss: h.loss ?? 0,
    delta: i === 0 ? 0 : parseFloat((h.accuracy - history[i - 1].accuracy).toFixed(2)),
  }));

  // Radar: per-hospital contribution metrics
  const radarData = HOSPITALS.map((h, i) => ({
    hospital: h.replace("Hospital ", ""),
    accuracy: status?.hospitalAccuracies?.[i] ?? 0,
    contribution: [40, 33, 27][i],
    loss: status?.weights?.[i]?.loss ? parseFloat((100 - status.weights[i].loss * 20).toFixed(1)) : 0,
  }));

  const handleStart = () => {
    if (!selectedDataset) return;
    startMutation.mutate({ dataset: selectedDataset });
  };

  const chartTooltipStyle = { background: "#080f1c", border: "1px solid rgba(0,212,255,0.15)", borderRadius: "8px", color: "#e2e8f0", fontSize: "12px" };

  return (
    <section id="simulation" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[30rem] bg-primary/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-primary/20 mb-6">
            <span className={`w-2 h-2 rounded-full ${isTraining ? "bg-primary animate-pulse" : isDone ? "bg-green-400" : "bg-muted-foreground"}`}></span>
            <span className="text-xs font-mono text-primary tracking-widest uppercase">Live Training Dashboard</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-2 flex items-center justify-center gap-3">
            <Activity className="w-9 h-9 text-primary" />
            Federated Simulation
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">Watch real federated learning unfold in real-time — all powered by Python + scikit-learn</p>
        </div>

        {/* Control Panel */}
        <div className="glass-panel rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center gap-4 justify-between border border-primary/10">
          <div className="flex items-center gap-3 flex-wrap">
            <select
              className="bg-secondary border border-white/10 text-foreground px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              value={selectedDataset}
              onChange={(e) => setSelectedDataset(e.target.value)}
              disabled={isTraining}
              data-testid="select-dataset"
            >
              <option value="">Select Disease Model</option>
              {datasets?.map(d => (
                <option key={d.id} value={d.file.replace(".csv", "")}>{d.name}</option>
              ))}
            </select>

            <div className={`px-4 py-2 rounded-full border text-xs font-mono uppercase tracking-widest flex items-center gap-2 ${
              isTraining ? "border-primary/30 bg-primary/10 text-primary animate-pulse"
              : isDone ? "border-green-500/30 bg-green-500/10 text-green-400"
              : "border-white/10 bg-secondary text-muted-foreground"
            }`} data-testid="status-training">
              <span className={`w-2 h-2 rounded-full ${isTraining ? "bg-primary" : isDone ? "bg-green-400" : "bg-muted-foreground"}`}></span>
              {status?.status || "Idle"}
            </div>

            {status?.round > 0 && (
              <div className="text-xs font-mono text-muted-foreground bg-secondary px-3 py-2 rounded-lg border border-white/5">
                Round <span className="text-primary font-bold">{status.round}</span> / 5
              </div>
            )}
          </div>

          <div className="flex gap-3 flex-wrap">
            {isDone && (
              <button
                onClick={() => window.location.href = "/api/download-model"}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/40 transition-all flex items-center gap-2"
                data-testid="button-download-model"
              >
                <Download className="w-4 h-4" /> Download Model
              </button>
            )}
            <button
              onClick={handleStart}
              disabled={isTraining || !selectedDataset}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] disabled:opacity-40 transition-all flex items-center gap-2"
              data-testid="button-start"
            >
              <Play className="w-4 h-4 fill-current" /> Start Training
            </button>
            <button
              onClick={() => resetMutation.mutate()}
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-secondary text-foreground border border-white/5 hover:bg-secondary/80 transition-all flex items-center gap-2"
              data-testid="button-reset"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: TrendingUp, label: "Global Accuracy", value: status?.accuracy ? `${status.accuracy.toFixed(1)}%` : "—", color: "text-primary", bg: "bg-primary/10 border-primary/20" },
            { icon: Activity, label: "Cross-Entropy Loss", value: status?.loss ? status.loss.toFixed(4) : "—", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
            { icon: Brain, label: "Current Round", value: status?.round ? `${status.round} / 5` : "—", color: "text-accent", bg: "bg-accent/10 border-accent/20" },
            { icon: ShieldCheck, label: "Privacy Preserved", value: "100%", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
          ].map((s, i) => (
            <div key={i} className={`glass-panel rounded-xl p-4 border ${s.bg}`} data-testid={`stat-${s.label.toLowerCase().replace(/ /g, "-")}`}>
              <div className="flex items-center gap-2 mb-1">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <div className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

          {/* 1. Learning Curve */}
          <div className="glass-panel rounded-2xl p-5 border border-white/5">
            <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Global Accuracy — Learning Curve
            </h3>
            <div className="h-[220px]">
              {history.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={deltaData}>
                    <defs>
                      <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="round" stroke="#666" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} stroke="#666" tick={{ fontSize: 11 }} unit="%" />
                    <Tooltip contentStyle={chartTooltipStyle} formatter={(v: any) => [`${v}%`, "Accuracy"]} />
                    <Area type="monotone" dataKey="accuracy" stroke="#00d4ff" strokeWidth={2.5} fill="url(#accGrad)" dot={{ fill: "#00d4ff", r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart icon={<TrendingUp className="w-6 h-6" />} text="Learning curve appears after training starts" />
              )}
            </div>
          </div>

          {/* 2. Loss curve */}
          <div className="glass-panel rounded-2xl p-5 border border-white/5">
            <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-400" /> Cross-Entropy Loss per Round
            </h3>
            <div className="h-[220px]">
              {history.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={deltaData}>
                    <defs>
                      <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="round" stroke="#666" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#666" tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
                    <Tooltip contentStyle={chartTooltipStyle} formatter={(v: any) => [v.toFixed(4), "Loss"]} />
                    <Area type="monotone" dataKey="loss" stroke="#f97316" strokeWidth={2.5} fill="url(#lossGrad)" dot={{ fill: "#f97316", r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart icon={<Activity className="w-6 h-6" />} text="Loss curve appears after training starts" />
              )}
            </div>
          </div>

          {/* 3. Weight Distribution per Hospital */}
          <div className="glass-panel rounded-2xl p-5 border border-white/5">
            <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent" /> Learned Weight Distribution (Latest Round)
            </h3>
            <div className="h-[220px]">
              {weightData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weightData.slice(0, 12)} barSize={12}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#666" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Bar dataKey="hA" fill="#00d4ff" name="Hospital A" radius={[2,2,0,0]} />
                    <Bar dataKey="hB" fill="#d946ef" name="Hospital B" radius={[2,2,0,0]} />
                    <Bar dataKey="hC" fill="#84cc16" name="Hospital C" radius={[2,2,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart icon={<BarChart3 className="w-6 h-6" />} text="Weight distribution appears after first round" />
              )}
            </div>
          </div>

          {/* 4. Round-over-Round Improvement Delta */}
          <div className="glass-panel rounded-2xl p-5 border border-white/5">
            <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" /> Round-over-Round Accuracy Gain (Δ)
            </h3>
            <div className="h-[220px]">
              {deltaData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deltaData.slice(1)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="round" stroke="#666" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#666" tick={{ fontSize: 11 }} unit="%" />
                    <Tooltip contentStyle={chartTooltipStyle} formatter={(v: any) => [`+${v}%`, "Accuracy Gain"]} />
                    <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
                    <Bar dataKey="delta" fill="#4ade80" name="Δ Accuracy" radius={[3,3,0,0]}
                      label={{ position: "top", fontSize: 10, fill: "#4ade80", formatter: (v: any) => v > 0 ? `+${v}%` : `${v}%` }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart icon={<TrendingUp className="w-6 h-6" />} text="Improvement delta appears after ≥2 rounds" />
              )}
            </div>
          </div>
        </div>

        {/* Hospital Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {HOSPITALS.map((h, i) => {
            const acc = status?.hospitalAccuracies?.[i];
            const loss = status?.weights?.[i]?.loss;
            const active = isTraining || isDone;
            return (
              <div key={h} className={`glass-panel rounded-xl p-5 border transition-all duration-500 ${active ? "border-primary/20 bg-primary/5" : "border-white/5"}`}
                data-testid={`card-hospital-${h.replace(" ", "-").toLowerCase()}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold tracking-widest" style={{ color: H_COLORS[i] }}>{h.toUpperCase()}</span>
                  <div className={`w-2 h-2 rounded-full ${active ? "animate-pulse" : ""}`} style={{ background: active ? H_COLORS[i] : "#444" }}></div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Local Accuracy</span>
                    <span className="font-mono font-bold text-foreground">{acc !== undefined ? `${acc.toFixed(1)}%` : "—"}</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: acc ? `${acc}%` : "0%", background: H_COLORS[i] }}></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Local Loss</span>
                    <span className="font-mono text-orange-400">{loss !== undefined ? loss.toFixed(4) : "—"}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Data Contribution</span>
                    <span className="font-mono text-muted-foreground">{["~33.3%", "~33.3%", "~33.3%"][i]}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Privacy</span>
                    <span className="font-mono text-green-400">✓ Local only</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Privacy & Technical Info */}
        <div className="glass-panel rounded-2xl p-6 border border-green-500/10 bg-green-500/5">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display font-bold text-foreground mb-2">Privacy Guarantees</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
                <div><span className="text-foreground font-semibold block mb-1">Data Locality</span>Each hospital's CSV partition stays on-device. Only gradient updates (model weights) are shared with the aggregator.</div>
                <div><span className="text-foreground font-semibold block mb-1">Weight-Only Transfer</span>Weight vectors carry no patient-identifiable information. A feature weight of 0.42 reveals nothing about any individual.</div>
                <div><span className="text-foreground font-semibold block mb-1">Formal Guarantee</span>FedAvg with differential privacy satisfies (ε, δ)-DP. A model inversion attack on averaged weights achieves near-zero reconstruction accuracy.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EmptyChart({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground/40">
      {icon}
      <span className="text-xs text-center max-w-[200px]">{text}</span>
    </div>
  );
}
