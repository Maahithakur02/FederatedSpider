import { useState, useEffect } from "react";
import { Activity, Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { name: "ABOUT", href: "#about" },
    { name: "HOW IT WORKS", href: "#how-it-works" },
    { name: "ARCHITECTURE", href: "#architecture" },
    { name: "DATASETS", href: "#datasets" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent py-5"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-lg tracking-widest text-foreground uppercase">
              Federated<span className="text-primary">Health</span>
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.name}
                href={l.href}
                className="text-xs font-semibold tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                {l.name}
              </a>
            ))}
            <a
              href="#simulation"
              className="px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase text-primary-foreground bg-primary hover:shadow-[0_0_20px_rgba(0,212,255,0.5)] transition-all duration-300"
              data-testid="button-get-access"
            >
              Get Access
            </a>
          </nav>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-muted-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-xl border-b border-white/5 px-4 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <a key={l.name} href={l.href} className="text-sm font-semibold tracking-widest text-muted-foreground hover:text-primary p-2" onClick={() => setMobileOpen(false)}>
              {l.name}
            </a>
          ))}
          <a href="#simulation" className="text-center px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase text-primary-foreground bg-primary" onClick={() => setMobileOpen(false)}>
            Get Access
          </a>
        </div>
      )}
    </header>
  );
}
