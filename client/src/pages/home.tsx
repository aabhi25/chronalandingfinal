import { useEffect } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import ChroneySection from "@/components/chroney-section";
import BlogPreviewSection from "@/components/blog-preview-section";
import CtaSection from "@/components/cta-section";
import Footer from "@/components/footer";

export default function Home() {
  useEffect(() => {
    // Handle hash-based navigation when landing on home page
    const hash = window.location.hash.substring(1);
    if (hash) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <ChroneySection />
        <FeaturesSection />
        <BlogPreviewSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
