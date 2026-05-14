import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Nav } from "@/components/nav";
import { Report } from "@/components/report";

export default function Page() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500/30">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_55%)]" />
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Report />
      </main>
      <Footer />
    </div>
  );
}
