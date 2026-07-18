import { ComparisonSection } from "@/components/landing/comparison-section";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { NavBar } from "@/components/landing/nav-bar";
import { ProblemSection } from "@/components/landing/problem-section";
import { StressTestSection } from "@/components/landing/stress-test-section";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col overflow-x-hidden">
      <NavBar />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <FeatureGrid />
      <StressTestSection />
      <ComparisonSection />
      <FinalCta />
      <Footer />
    </div>
  );
}
