import { Activity, ShieldCheck, Cpu, Lock } from "lucide-react";

export function Hero() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full bleed background image — heavily masked so background text is invisible */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.35),transparent_45%),radial-gradient(circle_at_80%_35%,hsl(var(--accent)/0.28),transparent_50%),linear-gradient(160deg,hsl(220_30%_8%),hsl(222_28%_5%))]"></div>
        {/* Strong solid base mask */}
        <div className="absolute inset-0 bg-background/70"></div>
        {/* Top/bottom gradient fades */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background"></div>
        {/* Side gradient fades */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/70"></div>
      </div>

      {/* Floating card — Node Status (left) */}
      <div className="absolute top-1/3 left-6 md:left-16 z-20 hidden sm:block hero-float-slow">
        <div className="glass-panel px-4 py-3 rounded-xl min-w-[180px] border border-primary/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-xs font-mono text-green-400 uppercase tracking-widest">Node Status: Active</span>
          </div>
          <div className="text-xs text-muted-foreground font-mono">Hospital A</div>
          <div className="w-full h-1 bg-white/5 rounded-full mt-1 mb-1">
            <div className="h-full w-[98%] bg-primary rounded-full"></div>
          </div>
          <div className="text-xs text-primary font-mono">98% Accuracy</div>
        </div>
      </div>

      {/* Floating card — Bio-Identity Lock (right top) */}
      <div className="absolute top-1/3 right-6 md:right-16 z-20 hidden sm:block hero-float-mid">
        <div className="glass-panel px-4 py-3 rounded-xl border border-accent/30">
          <div className="text-xs font-mono text-accent uppercase tracking-widest mb-2">Bio-Identity Lock</div>
          <div className="flex gap-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`w-4 h-6 rounded-sm ${i < 4 ? "bg-accent/80" : "bg-accent/20"}`}></div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating card — Privacy Protocol (right bottom) */}
      <div className="absolute bottom-1/3 right-6 md:right-20 z-20 hidden md:block hero-float-slow">
        <div className="glass-panel px-4 py-3 rounded-xl border border-primary/20">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-3 h-3 text-primary" />
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Privacy Protocol</span>
          </div>
          <div className="text-xs text-muted-foreground font-mono">Homomorphic Encryption enabled.</div>
          <div className="text-xs text-muted-foreground font-mono">Patient data remains local.</div>
        </div>
      </div>

      {/* Center badge */}
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-primary/30">
          <Cpu className="w-3 h-3 text-primary" />
          <span className="text-xs font-mono font-semibold text-primary tracking-[0.2em] uppercase">Zero-Knowledge Intelligence</span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24">
        <h1 className="font-display font-bold leading-none tracking-tight">
          <div className="text-5xl md:text-8xl text-white drop-shadow-2xl mb-1">FEDERATED</div>
          <div className="text-5xl md:text-8xl text-white drop-shadow-2xl mb-1">LEARNING</div>
          <div className="text-5xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-accent text-glow mb-1">FOR SMART</div>
          <div className="text-5xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-accent via-purple-400 to-accent text-glow">HEALTHCARE</div>
        </h1>

        <p className="mt-8 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Train powerful diagnostic models using institutional patient data without ever exposing sensitive records. The future of decentralized, privacy-first medical AI.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={() => scrollTo("simulation")}
            className="px-8 py-3.5 rounded-xl font-bold text-base bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
            data-testid="button-get-started"
          >
            <Activity className="w-4 h-4" />
            Start Simulation
          </button>
          <a
            href="#architecture"
            className="px-8 py-3.5 rounded-xl font-bold text-base glass-panel border border-white/10 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 text-foreground"
            data-testid="link-learn-more"
          >
            Explore Architecture
          </a>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl mx-auto border-t border-white/5 pt-8">
          {[
            { value: "3", label: "Virtual Hospitals", icon: Lock },
            { value: "5", label: "FL Rounds", icon: Cpu },
            { value: "100%", label: "Data Privacy", icon: ShieldCheck },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-2xl md:text-3xl font-display font-bold text-primary mb-1">{s.value}</div>
              <div className="text-xs text-muted-foreground font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
