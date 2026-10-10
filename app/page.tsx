import { Metadata } from "next";

import { Comparison } from "@/components/landing/comparison";
import { Faq } from "@/components/landing/faq";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Navbar } from "@/components/landing/navbar";
import { Pricing } from "@/components/landing/pricing";
import { Testimonials } from "@/components/landing/testimonials";
import { TrustBar } from "@/components/landing/trust-bar";

export const metadata: Metadata = {
  title: "Lecturra — Academic Operating System for Exam Synthesis & Instant Auto-Grading",
  description:
    "Upload course textbooks, slides, and syllabi. Synthesize Bloom's-aligned exam questions with AI, audit duplicate vectors, share timed assessment links, and auto-grade student submissions instantly.",
};

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col selection:bg-[#38492A]/20 selection:text-[#38492A] dark:selection:bg-[#8FB373]/30 dark:selection:text-[#8FB373]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <Features />
        <HowItWorks />
        <Comparison />
        <Pricing />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
