import Link from "next/link";
import { CircleCheckIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const freeIncludes = ["1,500 credits on signup", "+200 credits per referral", "Full workflow: upload → grade"];
const topupIncludes = ["₦5,000 = 5,000 credits", "Secure OPay checkout", "Track payment status per order"];

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="mx-auto max-w-5xl scroll-mt-16 px-6 py-16">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#A0795C]/30 bg-[#A0795C]/10 px-3 py-1 text-xs font-semibold text-[#A0795C]">
          <span className="size-1.5 rounded-full bg-[#A0795C]" />
          Transparent Academic Economics
        </div>
        <h2 id="pricing-heading" className="title-immersive mt-4 text-3xl font-normal text-balance text-[#1A2416] sm:text-4xl dark:text-[#F4F5F0]">
          Start free, top up when you need more
        </h2>
        <p className="mt-2.5 text-base text-muted-foreground">
          A typical 50-question run costs 500 credits — the free balance covers your first exams.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="card-organic relative flex flex-col justify-between rounded-2xl p-7">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                Free Academic Plan
              </h3>
              <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                Starter
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">For trying Lecturra on a live course.</p>
            <div className="mt-6 flex items-baseline gap-1.5">
              <span className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                ₦0
              </span>
              <span className="text-xs text-muted-foreground">/ 1,500 credits included</span>
            </div>
            <ul className="mt-6 space-y-3 text-xs sm:text-sm">
              {freeIncludes.map((i) => (
                <li key={i} className="flex items-center gap-2.5 text-muted-foreground">
                  <CircleCheckIcon className="size-4 shrink-0 text-[#38492A] dark:text-[#8FB373]" aria-hidden />
                  <span className="text-foreground">{i}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 pt-4 border-t border-border/80">
            <Button
              variant="outline"
              className="w-full border-[#38492A]/20 hover:bg-[#38492A]/5 hover:text-[#38492A] dark:hover:bg-muted"
              render={<Link href="/register" />}
            >
              Create free account
            </Button>
          </div>
        </div>

        {/* Featured Tier in São Tomé Deep Forest Highlight */}
        <div className="card-organic relative flex flex-col justify-between rounded-2xl border-2 border-[#38492A] p-7 shadow-md dark:border-[#8FB373]">
          <div className="absolute -top-3 right-6 rounded-full bg-[#38492A] px-3.5 py-1 text-[11px] font-semibold text-white shadow-xs dark:bg-[#8FB373] dark:text-[#11160E]">
            Recommended for Exams
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                Pay As You Go Top-up
              </h3>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">For heavy exam seasons, faculties, and large student cohorts.</p>
            <div className="mt-6 flex items-baseline gap-1.5">
              <span className="font-heading text-4xl font-semibold tracking-tight text-[#38492A] sm:text-5xl dark:text-[#8FB373]">
                ₦5,000
              </span>
              <span className="text-xs text-muted-foreground">/ 5,000 credits</span>
            </div>
            <ul className="mt-6 space-y-3 text-xs sm:text-sm">
              {topupIncludes.map((i) => (
                <li key={i} className="flex items-center gap-2.5 text-muted-foreground">
                  <CircleCheckIcon className="size-4 shrink-0 text-[#38492A] dark:text-[#8FB373]" aria-hidden />
                  <span className="text-foreground">{i}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 pt-4 border-t border-border/80">
            <Button
              className="w-full bg-[#38492A] text-white shadow-sm hover:bg-[#2C3B20] dark:bg-[#8FB373] dark:text-[#11160E] dark:hover:bg-[#A3C687]"
              render={<Link href="/register" />}
            >
              Start free, top up anytime
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
