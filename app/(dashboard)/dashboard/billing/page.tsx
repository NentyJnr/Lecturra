"use client";

import { useState } from "react";
import {
  CreditCardIcon,
  SparklesIcon,
  CheckCircle2Icon,
  ShieldCheckIcon,
  ArrowRightIcon,
  HistoryIcon,
  ZapIcon,
  Building2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PaymentPackage {
  id: string;
  name: string;
  credits: number;
  priceNGN: number;
  costPerQuestion: string;
  popular?: boolean;
  features: string[];
}

const packages: PaymentPackage[] = [
  {
    id: "pkg-1",
    name: "Starter Pack",
    credits: 5000,
    priceNGN: 5000,
    costPerQuestion: "200 questions (~₦25/Q)",
    features: ["5,000 AI Credits", "All Question Types (MCQ, T/F, Essay)", "Aiken & GIFT Exporters", "Standard Generation Speed"],
  },
  {
    id: "pkg-2",
    name: "Faculty Pro",
    credits: 15000,
    priceNGN: 13500,
    costPerQuestion: "600 questions (10% Discount)",
    popular: true,
    features: ["15,000 AI Credits", "Priority AI Processing Queue", "Full Result CSV Analytics", "Multi-Course Tagging", "24/7 Priority Support"],
  },
  {
    id: "pkg-3",
    name: "Institutional Bulk",
    credits: 50000,
    priceNGN: 40000,
    costPerQuestion: "2,000 questions (20% Discount)",
    features: ["50,000 AI Credits", "Department-Wide Sharing", "Dedicated Account Manager", "Custom Exam Template Export", "OPay & Direct Transfer Billing"],
  },
];

interface HistoryRow {
  id: string;
  orderRef: string;
  credits: number;
  amount: string;
  provider: string;
  status: "Completed" | "Pending";
  date: string;
}

const mockHistory: HistoryRow[] = [
  {
    id: "tx-1",
    orderRef: "ORD-20260908-8F21",
    credits: 1500,
    amount: "₦0 (Free Registration Allocation)",
    provider: "System Welcome Allocation",
    status: "Completed",
    date: "2026-09-08 14:00",
  },
];

import { useAuthStore } from "@/stores/auth-store";
import { isAdminUser } from "@/lib/api/types/auth";
import Link from "next/link";

export default function BillingPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = isAdminUser(user);

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 min-h-[50vh]">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
          <ShieldCheckIcon className="size-8" />
        </div>
        <div className="space-y-1 max-w-md">
          <h2 className="font-heading text-xl font-bold">Access Restricted</h2>
          <p className="text-sm text-muted-foreground">
            Quota topup and billing management is managed by your school institution administrator.
          </p>
        </div>
        <Button render={<Link href="/dashboard" />}>Return to Overview</Button>
      </div>
    );
  }


  function handleInitializePayment(pkg: PaymentPackage) {
    setSelectedPackage(pkg.id);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`OPay Payment Gateway Initialized for ${pkg.name} (₦${pkg.priceNGN.toLocaleString()}). Redirecting to checkout...`);
    }, 1200);
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 border-amber-500/30 text-amber-600 dark:text-amber-400">
              <CreditCardIcon className="size-3.5" /> Quota Billing & OPay Integration
            </Badge>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight mt-1">Quota Topup / Payments</h1>
          <p className="text-sm text-muted-foreground">
            Manage your AI generation credit balance and purchase topup credit bundles.
          </p>
        </div>
      </div>

      {/* Current Quota Status Banner */}
      <Card className="relative overflow-hidden border-sky-500/30 bg-gradient-to-r from-sky-50/50 via-background to-blue-50/50 dark:from-sky-950/20 dark:to-blue-950/20">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-md shrink-0">
              <SparklesIcon className="size-7 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Available Balance</p>
              <h2 className="font-heading text-3xl font-extrabold text-foreground">1,500 AI Credits</h2>
              <p className="text-xs text-sky-600 dark:text-sky-400 font-medium mt-0.5">
                Enough to generate ~60 exam questions or ~3 complete assessments.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-muted-foreground">Rate: 25 Credits / Question</p>
              <p className="text-[11px] text-muted-foreground">Secure Instant Checkout via OPay</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Packages Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold tracking-tight">Select Topup Credit Package</h2>
          <Badge variant="secondary" className="gap-1 text-xs">
            <ShieldCheckIcon className="size-3.5 text-emerald-500" /> Instant OPay Activation
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`relative flex flex-col justify-between transition-all ${
                pkg.popular ? "border-primary shadow-lg ring-2 ring-primary/20" : "hover:border-primary/40"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground text-[10px] px-3 font-semibold uppercase tracking-wider">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="pt-6">
                <CardTitle className="text-lg">{pkg.name}</CardTitle>
                <CardDescription className="text-xs">{pkg.costPerQuestion}</CardDescription>
                <div className="pt-3">
                  <span className="font-heading text-3xl font-bold">₦{pkg.priceNGN.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground font-normal"> / {pkg.credits.toLocaleString()} credits</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 flex-1">
                <ul className="space-y-2 text-xs">
                  {pkg.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <CheckCircle2Icon className="size-4 shrink-0 text-emerald-500" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-4">
                <Button
                  className="w-full gap-2"
                  variant={pkg.popular ? "default" : "outline"}
                  onClick={() => handleInitializePayment(pkg)}
                  disabled={isProcessing && selectedPackage === pkg.id}
                >
                  <ZapIcon className="size-4" />
                  {isProcessing && selectedPackage === pkg.id ? "Connecting to OPay..." : `Pay ₦${pkg.priceNGN.toLocaleString()}`}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment History Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <HistoryIcon className="size-4 text-muted-foreground" />
                Payment & Credit History
              </CardTitle>
              <CardDescription className="text-xs">
                History of credit allocations and topup order transactions.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="p-3">Order Reference</th>
                  <th className="p-3">Credit Amount</th>
                  <th className="p-3">Amount Charged</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {mockHistory.map((h) => (
                  <tr key={h.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono font-medium">{h.orderRef}</td>
                    <td className="p-3 font-bold text-sky-600 dark:text-sky-400">+{h.credits.toLocaleString()} Credits</td>
                    <td className="p-3 font-semibold">{h.amount}</td>
                    <td className="p-3 text-muted-foreground">{h.provider}</td>
                    <td className="p-3">
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1">
                        <CheckCircle2Icon className="size-3" /> {h.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">{h.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
