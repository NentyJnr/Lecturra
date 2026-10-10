import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircleIcon } from "lucide-react";

const faqs = [
  {
    q: "What document file formats can I upload?",
    a: "You can upload PDF textbooks, Word (.docx) lecture documents, syllabi, and lecture slide transcripts. Large files up to 100MB+ use resumable multi-part chunked uploads, ensuring zero lost progress even if campus Wi-Fi fluctuates.",
  },
  {
    q: "How does the credit system and top-up work?",
    a: "Question generation is metered at 10 credits per question (e.g. 500 credits for a standard 50-item exam). Every new user starts with 1,500 complimentary credits — enough for 3 full exam creation runs. When needed, top up 5,000 credits for ₦5,000 via secure OPay checkout. Credits never expire and roll over indefinitely.",
  },
  {
    q: "How does duplicate vector detection protect exam integrity?",
    a: "Every generated batch is mathematically cross-referenced using cosine vector similarity against your historic departmental question bank. Near-duplicate questions are highlighted with a percentage similarity score, giving you 1-click options to replace, edit, or approve each item.",
  },
  {
    q: "Do students need to create an account or install an application?",
    a: "No. Students simply open the unique timed assessment URL or scan the provided QR code on their smartphone, tablet, or laptop. The exam interface launches immediately with anti-tamper timer controls, and students view their score upon completion.",
  },
  {
    q: "Can I export questions to our university LMS (Moodle, Canvas, Blackboard)?",
    a: "Yes. In addition to digital online exam links, you can export your verified assessment in 1-click standard Aiken and GIFT formats for instant Moodle, Canvas, and Blackboard import, or download clean, print-ready PDF exam papers complete with separate marking keys.",
  },
  {
    q: "How are student results compiled for Senate and departmental approval?",
    a: "Submissions are auto-graded on the spot. Lecturers can monitor real-time class averages, inspect individual student item responses, and download clean Excel and CSV spreadsheets formatted specifically for departmental board review and Senate grade submission.",
  },
];

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="mx-auto max-w-5xl 2xl:max-w-6xl scroll-mt-20 px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#6D8382]/30 bg-[#6D8382]/10 px-3 py-1 text-xs font-semibold text-[#6D8382] dark:text-[#8FB373]">
          <HelpCircleIcon className="size-3.5" />
          Academic FAQ
        </div>
        <h2 id="faq-heading" className="title-immersive mt-4 text-3xl font-normal text-balance text-[#1A2416] sm:text-4xl lg:text-[2.75rem] dark:text-[#F4F5F0]">
          Frequently Asked Questions by Faculty
        </h2>
        <p className="mt-3.5 text-base text-muted-foreground">
          Clear answers regarding file security, LMS compatibility, student privacy, and Senate records.
        </p>
      </div>

      {/* Accordion */}
      <div className="mt-10">
        <Accordion className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`item-${i}`}
              className="card-organic overflow-hidden rounded-xl border border-border/80 px-5 py-1"
            >
              <AccordionTrigger className="text-left font-heading text-base font-semibold text-foreground hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-4">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
