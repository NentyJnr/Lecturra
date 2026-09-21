import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What files can I upload?",
    a: "PDF and DOCX textbooks or syllabi. Large documents use resumable chunked uploads, so a shaky connection won't force you to start over.",
  },
  {
    q: "How do credits work?",
    a: "Each generation run pre-deducts credits based on question count — for example, 50 questions cost 500 credits. You start with 5,000 free credits plus 200 for each referral, and top up at ₦5,000 for 5,000 credits via OPay.",
  },
  {
    q: "What formats can I export?",
    a: "Assessments export as Aiken, GIFT, or PDF for print, and score sheets download as CSV or Excel.",
  },
  {
    q: "Do students need a Lecturra account?",
    a: "No. You share a public link or QR code; students open it, answer, and see their score instantly — no signup on their side.",
  },
  {
    q: "How do I know the questions aren't repeated?",
    a: "Every generation pass runs a similarity check against your question bank. Flagged duplicates can be merged, replaced, or kept — you decide.",
  },
];

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="mx-auto max-w-3xl scroll-mt-16 px-6 py-12">
      <h2 id="faq-heading" className="font-heading text-3xl font-medium text-balance">
        Questions lecturers ask
      </h2>
      <Accordion className="mt-6">
        {faqs.map((f, i) => (
          <AccordionItem key={f.q} value={`item-${i}`}>
            <AccordionTrigger>{f.q}</AccordionTrigger>
            <AccordionContent>{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
