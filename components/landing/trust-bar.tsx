import {
  BookCheckIcon,
  CheckCircle2Icon,
  CpuIcon,
  LayersIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";

const accreditations = [
  {
    icon: BookCheckIcon,
    label: "Smart Difficulty",
    sub: "Adjust cognitive depth easily",
  },
  {
    icon: LayersIcon,
    label: "LMS Ready",
    sub: "Native export formats",
  },
  {
    icon: ShieldCheckIcon,
    label: "Duplicate Prevention",
    sub: "Smart checks for repeated questions",
  },
  {
    icon: CpuIcon,
    label: "Heavy File Uploads",
    sub: "Safely process 100MB+ textbooks",
  },
  {
    icon: CheckCircle2Icon,
    label: "No Student Logins",
    sub: "Share via instant links & QR codes",
  },
];

export function TrustBar() {
  return (
    <section aria-label="Institutional Standards" className="border-y border-border/70 bg-card/40 py-8 backdrop-blur-xs">
      <div className="mx-auto max-w-7xl 2xl:max-w-[1536px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-md bg-[#38492A]/10 text-[#38492A] dark:bg-[#8FB373]/20 dark:text-[#8FB373]">
              <SparklesIcon className="size-4" />
            </span>
            <div>
              <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Faculty Governance
              </p>
              <p className="text-sm font-medium text-foreground">
                Engineered for Academic Integrity
              </p>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:flex md:w-auto md:flex-wrap md:items-center md:gap-8">
            {accreditations.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <item.icon className="size-4 shrink-0 text-[#80802B] dark:text-[#8FB373]" aria-hidden />
                <div className="text-left">
                  <p className="text-xs font-semibold text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
