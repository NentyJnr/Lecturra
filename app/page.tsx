import { Faq } from "@/components/landing/faq";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Navbar } from "@/components/landing/navbar";
import { Pricing } from "@/components/landing/pricing";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: "Lecturra — Turn lecture notes into exam-ready questions",
  description:
    "Upload course material, generate exam questions with AI, share assessments with a link, and auto-grade student submissions.",
};

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
