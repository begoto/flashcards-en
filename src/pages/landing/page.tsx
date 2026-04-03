import { useEffect } from "react";
import { LandingNav } from "./components/LandingNav";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { AppScreenshots } from "./components/AppScreenshots";
import { HowItWorks } from "./components/HowItWorks";
import { BadgesShowcase } from "./components/BadgesShowcase";
import { Testimonials } from "./components/Testimonials";
import { CtaSection } from "./components/CtaSection";
import { LandingFooter } from "./components/LandingFooter";

export default function LandingPage() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => { document.documentElement.style.scrollBehavior = ""; };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
      <LandingNav />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AppScreenshots />
        <HowItWorks />
        <BadgesShowcase />
        <Testimonials />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
