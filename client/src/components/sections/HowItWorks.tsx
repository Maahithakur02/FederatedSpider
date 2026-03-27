import { Database, Cpu, UploadCloud, ServerCog, Sparkles } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Database,
      title: "Local Data Prep",
      desc: "Each hospital curates its own patient records. EHR data, lab results, and imaging metadata are preprocessed locally. Raw data never moves.",
      detail: "StandardScaler normalization applied per-hospital"
    },
    {
      icon: Cpu,
      title: "Local Training",
      desc: "The current global model is sent to each hospital. A local Logistic Regression model is trained on the hospital's private subset for N epochs.",
      detail: "scikit-learn LogisticRegression with warm_start"
    },
    {
      icon: UploadCloud,
      title: "Send Weight Updates",
      desc: "Only the updated model coefficients (weights) are transmitted — not patient data. Differential privacy noise is optionally added first.",
      detail: "Weights: w_i ∈ ℝ^d per hospital i"
    },
    {
      icon: ServerCog,
      title: "FedAvg Aggregation",
      desc: "The central server computes the weighted average of all hospital updates. This is the FedAvg algorithm: w_global = Σ(n_i/n) · w_i.",
      detail: "w_global = (1/K) Σᵢ wᵢ for equal-sized sets"
    },
    {
      icon: Sparkles,
      title: "Global Improvement",
      desc: "The improved global model is distributed back to all hospitals for the next round. Each round improves accuracy without compromising privacy.",
      detail: "Convergence typically in 3–10 rounds"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-accent/20 mb-6">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
            <span className="text-xs font-mono text-accent tracking-widest uppercase">FedAvg Protocol</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A seamless cycle of distributed intelligence — no data ever leaves its origin
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-14 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0 mx-24"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {steps.map((step, i) => (
              <div key={i} className="relative group">
                <div className="glass-panel rounded-2xl p-5 h-full flex flex-col items-center text-center relative z-10 hover:-translate-y-2 hover:border-primary/30 transition-all duration-300">
                  {/* Step number */}
                  <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-background border border-white/10 flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {i + 1}
                  </div>

                  {/* Connector dot */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-14 -right-[10px] w-4 h-4 rounded-full bg-primary/30 border border-primary/50 z-10"></div>
                  )}

                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4 border border-white/5 group-hover:border-primary/40 group-hover:bg-primary/10 transition-all">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{step.desc}</p>
                  <div className="mt-auto pt-3 border-t border-white/5 w-full">
                    <span className="text-xs font-mono text-primary/70">{step.detail}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Math callout */}
        <div className="mt-12 glass-panel rounded-2xl p-6 max-w-3xl mx-auto border border-primary/10">
          <h3 className="font-display font-bold text-center mb-4 text-foreground">FedAvg Algorithm</h3>
          <div className="font-mono text-sm text-center space-y-2 text-muted-foreground">
            <div><span className="text-primary">Server:</span>  w<sub>t+1</sub> = Σ<sub>k</sub> (n<sub>k</sub>/n) · w<sub>t+1</sub><sup>k</sup></div>
            <div><span className="text-accent">Client k:</span>  w<sub>t+1</sub><sup>k</sup> = w<sub>t</sub> − η · ∇L<sub>k</sub>(w<sub>t</sub>)</div>
            <div className="text-xs text-muted-foreground/60 pt-2">where η = learning rate, L<sub>k</sub> = local loss, n<sub>k</sub> = local data size</div>
          </div>
        </div>
      </div>
    </section>
  );
}
