import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Architecture } from "@/components/sections/Architecture";
import { Datasets } from "@/components/sections/Datasets";
import { Simulation } from "@/components/sections/Simulation";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <About />
        <HowItWorks />
        <Architecture />
        <Datasets />
        <Simulation />
      </main>
      
      <footer className="py-8 border-t border-white/5 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} FedHealth. Demo application for Federated Learning.
        </p>
      </footer>
    </div>
  );
}
