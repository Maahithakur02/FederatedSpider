import { Lock, Database, Network, ShieldCheck, Globe } from "lucide-react";

export function About() {
  const features = [
    { icon: Lock, text: "Compliant with HIPAA, GDPR, and global data laws", color: "text-primary" },
    { icon: Database, text: "Breaks down institutional data silos without risk", color: "text-primary" },
    { icon: Network, text: "Collaborative research across competitive boundaries", color: "text-primary" },
    { icon: Globe, text: "Scales to any number of federated hospital nodes", color: "text-primary" },
  ];

  const comparison = [
    { label: "Data Location", traditional: "Centralized server", federated: "Stays at each hospital", bad: true },
    { label: "Privacy Risk", traditional: "High exposure", federated: "Zero — models only", bad: true },
    { label: "Regulatory", traditional: "HIPAA violations likely", federated: "Fully compliant", bad: true },
    { label: "Accuracy", traditional: "High (data pooled)", federated: "Comparable via FedAvg", bad: false },
  ];

  return (
    <section id="about" className="py-24 bg-card/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-primary/20 mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-xs font-mono text-primary tracking-widest uppercase">Privacy-First AI</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            The <span className="text-primary">Data Privacy</span> Problem in Healthcare
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hospitals hold life-saving data but can never share it. Federated Learning breaks this impasse.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-muted-foreground text-base mb-6 leading-relaxed">
              Healthcare institutions possess vast amounts of valuable patient data that could train life-saving AI models. However, strict regulations like <strong className="text-foreground">HIPAA</strong> and <strong className="text-foreground">GDPR</strong> make centralizing this sensitive data nearly impossible.
            </p>
            <p className="text-muted-foreground text-base mb-8 leading-relaxed">
              <strong className="text-foreground">Federated Learning</strong> solves this. Instead of bringing data to the model, we bring the model to the data. Hospitals train models locally and only share encrypted <em>model weight updates</em> — never raw patient records. The central server applies <strong className="text-foreground">FedAvg</strong> (Federated Averaging) to combine all updates into a stronger global model.
            </p>

            <div className="space-y-3">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-card/50 border border-white/5 hover:border-primary/20 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <f.icon className={`w-4 h-4 ${f.color}`} />
                  </div>
                  <span className="text-sm text-foreground">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg mb-4 text-foreground">Traditional AI vs. Federated Learning</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Metric</th>
                    <th className="text-center py-2 px-3 text-destructive font-medium">Traditional AI</th>
                    <th className="text-center py-2 pl-3 text-primary font-medium">Federated AI</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-3 pr-4 text-muted-foreground">{row.label}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-destructive/80 text-xs">{row.traditional}</span>
                      </td>
                      <td className="py-3 pl-3 text-center">
                        <span className="text-primary/90 text-xs">{row.federated}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-foreground mb-1">Differential Privacy</div>
                  <div className="text-xs text-muted-foreground">Gaussian noise added to weight updates before transmission prevents model inversion attacks, further protecting individual patient identities.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
