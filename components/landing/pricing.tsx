import Link from "next/link";
import { CircleCheckIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const freeIncludes = ["1,500 credits on signup", "+200 credits per referral", "Full workflow: upload → grade"];
const topupIncludes = ["₦5,000 = 5,000 credits", "Secure OPay checkout", "Track payment status per order"];

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="mx-auto max-w-5xl scroll-mt-16 px-6 py-12">
      <div className="max-w-2xl">
        <h2 id="pricing-heading" className="font-heading text-3xl font-medium text-balance">
          Start free, top up when you need more
        </h2>
        <p className="mt-2 text-muted-foreground">
          A typical 50-question run costs 500 credits — the free balance covers your first exams.
        </p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>For trying Lecturra on a real course.</CardDescription>
            <p className="font-heading text-4xl font-medium">
              ₦0 <span className="font-sans text-sm font-normal text-muted-foreground">/ 1,500 credits</span>
            </p>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2 text-sm">
              {freeIncludes.map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <CircleCheckIcon className="size-4 shrink-0 text-primary" aria-hidden /> {i}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" render={<Link href="/register" />}>
              Create free account
            </Button>
          </CardFooter>
        </Card>
        <Card className="border-primary/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Top-up</CardTitle>
              <Badge>Pay as you go</Badge>
            </div>
            <CardDescription>For exam season and large classes.</CardDescription>
            <p className="font-heading text-4xl font-medium">
              ₦5,000 <span className="font-sans text-sm font-normal text-muted-foreground">/ 5,000 credits</span>
            </p>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2 text-sm">
              {topupIncludes.map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <CircleCheckIcon className="size-4 shrink-0 text-primary" aria-hidden /> {i}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" render={<Link href="/register" />}>
              Start free, top up later
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
