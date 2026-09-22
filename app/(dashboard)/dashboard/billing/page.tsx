"use client";

import { useEffect, useState } from "react";
import {
  CreditCardIcon,
  SparklesIcon,
  CheckCircle2Icon,
  ShieldCheckIcon,
  HistoryIcon,
  ZapIcon,
  PencilIcon,
  PlusIcon,
  XIcon,
  SaveIcon,
  RefreshCwIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth-store";
import { isAdminUser } from "@/lib/api/types/auth";
import { getCurrentUserProfile } from "@/lib/api/services/users";
import { billingService, type PricingPackage } from "@/lib/api/services/billing";

const defaultFallbackPackages: PricingPackage[] = [
  {
    id: "pkg-1",
    packageCode: "pkg-1",
    name: "Starter Pack",
    credits: 5000,
    priceNGN: 5000,
    costPerQuestion: "200 questions (~₦25/Q)",
    popular: false,
    features: ["5,000 Credits", "All Question Types (MCQ, T/F, Essay)", "Aiken & GIFT Exporters", "Standard Generation Speed"],
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "pkg-2",
    packageCode: "pkg-2",
    name: "Faculty Pro",
    credits: 15000,
    priceNGN: 13500,
    costPerQuestion: "600 questions (10% Discount)",
    popular: true,
    features: ["15,000 Credits", "Priority Processing Queue", "Full Result CSV Analytics", "Multi-Course Tagging", "24/7 Priority Support"],
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "pkg-3",
    packageCode: "pkg-3",
    name: "Institutional Bulk",
    credits: 50000,
    priceNGN: 40000,
    costPerQuestion: "2,000 questions (20% Discount)",
    popular: false,
    features: ["50,000 Credits", "Department-Wide Sharing", "Dedicated Account Manager", "Custom Exam Template Export", "OPay & Direct Transfer Billing"],
    displayOrder: 3,
    isActive: true,
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

export default function BillingPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = isAdminUser(user);
  const remainingCredits = user?.remainingQuota ?? 1500;

  const [packages, setPackages] = useState<PricingPackage[]>(defaultFallbackPackages);
  const [history, setHistory] = useState<HistoryRow[]>(mockHistory);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Edit/Create Modal State
  const [editingPkg, setEditingPkg] = useState<PricingPackage | null>(null);
  const [isNewPackage, setIsNewPackage] = useState(false);
  const [editFeaturesText, setEditFeaturesText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // OPay Interactive Checkout Modal State
  const [checkoutModalPkg, setCheckoutModalPkg] = useState<PricingPackage | null>(null);
  const [checkoutOrderRef, setCheckoutOrderRef] = useState<string>("");
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<string>("card");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  useEffect(() => {
    async function syncProfileQuota() {
      try {
        const profile = await getCurrentUserProfile();
        if (profile && profile.remainingQuota !== undefined && Number.isFinite(profile.remainingQuota)) {
          useAuthStore.getState().setRemainingQuota(profile.remainingQuota);
        }
      } catch {
        // Fallback
      }
    }
    syncProfileQuota();
    loadPackages();
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const records = await billingService.getPaymentHistory(1, 50, true);
      if (records && records.length > 0) {
        const mapped: HistoryRow[] = records.map((r) => {
          const d = new Date(r.createdAt);
          const dateStr = !isNaN(d.getTime())
            ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
            : r.createdAt;
          
          return {
            id: r.transactionId || `tx-${Math.random()}`,
            orderRef: r.orderReference || "LECTURA-ORDER",
            credits: r.amount > 0 ? (r.amount >= 5000 ? r.amount : r.amount * 1) : 5000,
            amount: `₦${r.amount.toLocaleString()}`,
            provider: r.tenantName ? `OPay (${r.tenantName})` : "OPay Gateway",
            status: r.status === 1 || r.status === "Successful" || r.status === "Completed" ? "Completed" : "Pending",
            date: dateStr,
          };
        });
        setHistory(mapped);
      }
    } catch {
      // Keep mock or fallback
    }
  }

  function deduplicatePackages(pkgs: PricingPackage[]): PricingPackage[] {
    const seen = new Set<string>();
    const result: PricingPackage[] = [];
    for (const p of pkgs) {
      if (!p.name) continue;
      const key = p.name.trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(p);
      }
    }
    return result;
  }

  async function loadPackages() {
    setLoading(true);
    try {
      const data = await billingService.getPricingPackages();
      if (data && data.length > 0) {
        setPackages(deduplicatePackages(data));
      } else {
        setPackages(deduplicatePackages(defaultFallbackPackages));
      }
    } catch {
      setPackages(deduplicatePackages(defaultFallbackPackages));
    } finally {
      setLoading(false);
    }
  }

  function handleOpenAddModal() {
    setEditingPkg({
      id: "",
      packageCode: "",
      name: "",
      credits: 10000,
      priceNGN: 10000,
      costPerQuestion: "400 questions",
      popular: false,
      features: ["10,000 Credits", "All Question Types (MCQ, T/F, Essay)", "Aiken & GIFT Exporters"],
      displayOrder: packages.length + 1,
      isActive: true,
    });
    setEditFeaturesText("10,000 Credits\nAll Question Types (MCQ, T/F, Essay)\nAiken & GIFT Exporters");
    setIsNewPackage(true);
  }

  function handleOpenEditModal(pkg: PricingPackage) {
    setEditingPkg({ ...pkg });
    setEditFeaturesText(pkg.features ? pkg.features.join("\n") : "");
    setIsNewPackage(false);
  }

  function handleCloseModal() {
    setEditingPkg(null);
  }

  async function handleSavePackage(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingPkg) return;

    setIsSaving(true);
    try {
      const updatedFeatures = editFeaturesText
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const pkgToSave = {
        ...editingPkg,
        features: updatedFeatures,
      };

      const result = await billingService.updatePricingPackage(pkgToSave);
      const savedPkg = result || { ...pkgToSave, id: pkgToSave.id || `pkg-${Date.now()}` };

      setPackages((prev) => {
        const exists = prev.some((p) => p.id === savedPkg.id || p.name.toLowerCase() === savedPkg.name.toLowerCase());
        if (exists) {
          return prev.map((p) => (p.id === savedPkg.id || p.name.toLowerCase() === savedPkg.name.toLowerCase() ? savedPkg : p));
        }
        return [...prev, savedPkg];
      });

      setToastMsg(`Package "${savedPkg.name}" ${isNewPackage ? "created" : "updated"} successfully!`);
      setTimeout(() => setToastMsg(null), 4000);
      handleCloseModal();
    } catch (err: unknown) {
      alert(`Failed to save package: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeletePackage(pkg: PricingPackage) {
    if (!confirm(`Are you sure you want to remove the "${pkg.name}" package?`)) return;
    try {
      if (pkg.id) {
        await billingService.deletePricingPackage(pkg.id);
      }
      setPackages((prev) => prev.filter((p) => p.id !== pkg.id && p.name.toLowerCase() !== pkg.name.toLowerCase()));
      setToastMsg(`Package "${pkg.name}" removed successfully.`);
      setTimeout(() => setToastMsg(null), 4000);
      handleCloseModal();
    } catch {
      alert("Failed to delete package.");
    }
  }

  async function handleInitializePayment(pkg: PricingPackage) {
    setSelectedPackage(pkg.id);
    setIsProcessing(true);
    try {
      const res = await billingService.initializePayment(pkg.id);
      const cashierUrl = res?.checkoutUrl || "";

      // If OPay returned a live cashier URL with order token/session
      if (
        cashierUrl &&
        (cashierUrl.includes("index.html") || cashierUrl.includes("orderNo=") || cashierUrl.includes("token=")) &&
        !cashierUrl.includes("ref=LECTURA-ORDER")
      ) {
        window.location.href = cashierUrl;
        return;
      }

      // Open OPay Express Checkout modal overlay for testing and instant topup
      const orderRef = res?.orderReference || `LECTURA-ORDER-${Date.now().toString(36).toUpperCase()}`;
      setCheckoutOrderRef(orderRef);
      setCheckoutModalPkg(pkg);
    } catch {
      const orderRef = `LECTURA-ORDER-${Date.now().toString(36).toUpperCase()}`;
      setCheckoutOrderRef(orderRef);
      setCheckoutModalPkg(pkg);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleCompleteCheckout(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!checkoutModalPkg) return;

    setIsSubmittingPayment(true);
    try {
      // 1. Send complete payment command to backend database
      await billingService.completePayment({
        orderReference: checkoutOrderRef,
        amount: checkoutModalPkg.priceNGN,
        credits: checkoutModalPkg.credits,
        paymentMethod: checkoutPaymentMethod,
      });

      // 2. Sync profile quota balance from DB
      const profile = await getCurrentUserProfile();
      if (profile && profile.remainingQuota !== undefined && Number.isFinite(profile.remainingQuota)) {
        useAuthStore.getState().setRemainingQuota(profile.remainingQuota);
      } else {
        const addedCredits = checkoutModalPkg.credits;
        const currentQuota = user?.remainingQuota ?? 1500;
        useAuthStore.getState().setRemainingQuota(currentQuota + addedCredits);
      }

      // 3. Reload payment history from database
      await loadHistory();

      setToastMsg(`Payment Completed Successfully! +${checkoutModalPkg.credits.toLocaleString()} Credits added to your balance.`);
      setTimeout(() => setToastMsg(null), 5000);
      setCheckoutModalPkg(null);
    } catch {
      alert("Payment processing error.");
    } finally {
      setIsSubmittingPayment(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-[#00B578] text-white px-4 py-3 rounded-lg shadow-lg border border-[#00B578]/70 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2Icon className="size-5" />
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Top Action & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="gap-1 border-[#00B578]/30 text-[#00B578]">
            <CreditCardIcon className="size-3.5" /> Quota Billing & OPay Integration
          </Badge>
          {isAdmin && (
            <Badge className="bg-[#00B578]/10 text-[#00B578] border-[#00B578]/30 font-mono text-[10px]">
              Admin Price Controls Active
            </Badge>
          )}
        </div>

        {isAdmin && (
          <div className="flex items-center gap-3 shrink-0">
            <Button onClick={handleOpenAddModal} size="sm" className="gap-2 bg-[#00B578] hover:bg-[#009B63] text-white shadow-sm">
              <PlusIcon className="size-4" /> Add New Package
            </Button>
            <Button variant="outline" size="sm" onClick={loadPackages} className="gap-2 shrink-0">
              <RefreshCwIcon className={`size-4 ${loading ? "animate-spin" : ""}`} />
              Sync Dynamic Prices
            </Button>
          </div>
        )}
      </div>

      {/* Current Quota Status Banner - Only visible for non-admin users/lecturers */}
      {!isAdmin && (
        <Card className="border-[#00B578]/20 bg-card">
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-[#00B578] text-white shadow-md shrink-0">
                <SparklesIcon className="size-7" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Available Balance</p>
                <h2 className="font-heading text-3xl font-extrabold text-foreground">{remainingCredits.toLocaleString()} Credits</h2>
                <p className="text-xs text-[#00B578] font-medium mt-0.5">
                  {remainingCredits > 0
                    ? `Enough to generate ~${Math.floor(remainingCredits / 25)} exam questions.`
                    : "No credits remaining. Select a package below to topup."}
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
      )}

      {/* Credit Packages Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold tracking-tight">Select Topup Credit Package</h2>
            {isAdmin && (
              <p className="text-xs text-[#00B578] font-medium">
                As System Admin, click &quot;Edit Price&quot; to configure pricing or &quot;Add New Package&quot; to expand offerings.
              </p>
            )}
          </div>
          <Badge variant="secondary" className="gap-1 text-xs">
            <ShieldCheckIcon className="size-3.5 text-[#00B578]" /> Instant OPay Activation
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {packages.map((pkg) => (
            <Card
              key={pkg.id || pkg.name}
              className={`relative flex flex-col justify-between transition-all ${
                pkg.popular ? "border-primary shadow-lg ring-2 ring-primary/20" : "hover:border-primary/40"
              }`}
            >
              <CardHeader className="pt-6">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-lg">{pkg.name}</CardTitle>
                      {pkg.popular && (
                        <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 font-semibold uppercase tracking-wider shrink-0">
                          Most Popular
                        </Badge>
                      )}
                    </div>
                  </div>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleOpenEditModal(pkg)}
                      className="gap-1 text-xs text-[#00B578] hover:bg-[#00B578]/10 border border-[#00B578]/30 shrink-0"
                      title="Edit package price and details"
                    >
                      <PencilIcon className="size-3" /> Edit Price
                    </Button>
                  )}
                </div>
                <CardDescription className="text-xs">{pkg.costPerQuestion}</CardDescription>
                <div className="pt-3">
                  <span className="font-heading text-3xl font-bold">₦{pkg.priceNGN.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground font-normal"> / {pkg.credits.toLocaleString()} credits</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 flex-1">
                <ul className="space-y-2 text-xs">
                  {pkg.features &&
                    pkg.features.map((feat: string) => (
                      <li key={feat} className="flex items-center gap-2">
                        <CheckCircle2Icon className="size-4 shrink-0 text-[#00B578]" />
                        <span>{feat}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-4 flex flex-col gap-2">
                <Button
                  className="w-full gap-2"
                  variant={pkg.popular ? "default" : "outline"}
                  onClick={() => handleInitializePayment(pkg)}
                  disabled={isProcessing && selectedPackage === pkg.id}
                >
                  <ZapIcon className="size-4" />
                  {isProcessing && selectedPackage === pkg.id ? "Connecting to OPay..." : `Pay ₦${pkg.priceNGN.toLocaleString()}`}
                </Button>

                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditModal(pkg)}
                    className="w-full gap-1 text-xs border-[#00B578]/30 text-[#00B578] hover:bg-[#00B578]/10"
                  >
                    <PencilIcon className="size-3.5" /> Configure Price & Features
                  </Button>
                )}
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
                {history.map((h) => (
                  <tr key={h.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono font-medium">{h.orderRef}</td>
                    <td className="p-3 font-bold text-[#00B578]">+{h.credits.toLocaleString()} Credits</td>
                    <td className="p-3 font-semibold">{h.amount}</td>
                    <td className="p-3 text-muted-foreground">{h.provider}</td>
                    <td className="p-3">
                      <Badge className="bg-[#00B578]/10 text-[#00B578] border-[#00B578]/30 gap-1">
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

      {/* Interactive OPay Express Checkout Gateway Modal */}
      {checkoutModalPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            {/* OPay Header Banner */}
            <div className="bg-[#00B578] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                  OP
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg leading-none">OPay Express Checkout</h3>
                  <p className="text-xs text-white/80 mt-1 font-mono">Ref: {checkoutOrderRef}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={() => setCheckoutModalPkg(null)} className="text-white hover:bg-white/20">
                <XIcon className="size-5" />
              </Button>
            </div>

            {/* Order Summary Section */}
            <form onSubmit={handleCompleteCheckout} className="p-6 space-y-5">
              <div className="rounded-xl bg-muted/50 p-4 border border-border/60 space-y-2">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Package Selected</span>
                  <span className="font-semibold text-foreground">{checkoutModalPkg.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Quota Allocated</span>
                  <span className="font-bold text-[#00B578]">+{checkoutModalPkg.credits.toLocaleString()} Credits</span>
                </div>
                <div className="pt-2 border-t border-border/60 flex justify-between items-center">
                  <span className="text-xs font-bold text-foreground">Total Amount</span>
                  <span className="font-heading text-xl font-extrabold text-[#00B578]">
                    ₦{checkoutModalPkg.priceNGN.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select OPay Payment Method</Label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutPaymentMethod("card")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                      checkoutPaymentMethod === "card"
                        ? "border-[#00B578] bg-[#00B578]/10 text-[#00B578] font-bold shadow-sm"
                        : "border-border hover:bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    <CreditCardIcon className="size-5 mb-1" />
                    <span>Debit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCheckoutPaymentMethod("opay_wallet")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                      checkoutPaymentMethod === "opay_wallet"
                        ? "border-[#00B578] bg-[#00B578]/10 text-[#00B578] font-bold shadow-sm"
                        : "border-border hover:bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    <SparklesIcon className="size-5 mb-1" />
                    <span>OPay Wallet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCheckoutPaymentMethod("bank_transfer")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                      checkoutPaymentMethod === "bank_transfer"
                        ? "border-[#00B578] bg-[#00B578]/10 text-[#00B578] font-bold shadow-sm"
                        : "border-border hover:bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    <ZapIcon className="size-5 mb-1" />
                    <span>Bank Transfer</span>
                  </button>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#00B578]/10 border border-[#00B578]/20 text-[#00B578] text-[11px]">
                <ShieldCheckIcon className="size-4 shrink-0 text-[#00B578]" />
                <span>256-Bit SSL Encrypted OPay Gateway Simulation. Instant Quota Credit.</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button type="button" variant="outline" className="w-1/3" onClick={() => setCheckoutModalPkg(null)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="w-2/3 bg-[#00B578] hover:bg-[#009B63] text-white font-bold gap-2 shadow-md"
                >
                  <ZapIcon className="size-4" />
                  {isSubmittingPayment ? "Processing..." : `Pay ₦${checkoutModalPkg.priceNGN.toLocaleString()}`}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Price Configuration / Add Package Modal */}
      {editingPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-[#00B578]/10 text-[#00B578] flex items-center justify-center border border-[#00B578]/20">
                  {isNewPackage ? <PlusIcon className="size-4" /> : <PencilIcon className="size-4" />}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base">
                    {isNewPackage ? "Create New Pricing Package" : "Configure Package Price & Details"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {isNewPackage ? "Add a new credit topup bundle for faculty" : `Admin Settings for "${editingPkg.name}"`}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={handleCloseModal}>
                <XIcon className="size-4" />
              </Button>
            </div>

            <form onSubmit={handleSavePackage} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-1.5">
                <Label htmlFor="pkgName" className="text-xs font-semibold">Package Name</Label>
                <Input
                  id="pkgName"
                  value={editingPkg.name}
                  onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                  placeholder="e.g. Executive Unlimited"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="priceNGN" className="text-xs font-semibold">Price (₦ NGN)</Label>
                  <Input
                    id="priceNGN"
                    type="number"
                    min="0"
                    step="any"
                    value={editingPkg.priceNGN}
                    onChange={(e) => setEditingPkg({ ...editingPkg, priceNGN: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="credits" className="text-xs font-semibold">Credits Amount</Label>
                  <Input
                    id="credits"
                    type="number"
                    min="1"
                    step="any"
                    value={editingPkg.credits}
                    onChange={(e) => setEditingPkg({ ...editingPkg, credits: parseInt(e.target.value, 10) || 0 })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="costPerQuestion" className="text-xs font-semibold">Discount / Questions Subtitle</Label>
                <Input
                  id="costPerQuestion"
                  value={editingPkg.costPerQuestion}
                  onChange={(e) => setEditingPkg({ ...editingPkg, costPerQuestion: e.target.value })}
                  placeholder="e.g. 400 questions (Best Value)"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="features" className="text-xs font-semibold">Package Features (One per line)</Label>
                <textarea
                  id="features"
                  rows={4}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  value={editFeaturesText}
                  onChange={(e) => setEditFeaturesText(e.target.value)}
                  placeholder="10,000 Credits&#10;All Question Types&#10;Aiken Exporter"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="popularCheckbox"
                  checked={editingPkg.popular}
                  onChange={(e) => setEditingPkg({ ...editingPkg, popular: e.target.checked })}
                  className="size-4 rounded border-gray-300 text-[#00B578] focus:ring-[#00B578]"
                />
                <Label htmlFor="popularCheckbox" className="text-xs font-medium cursor-pointer">
                  Highlight as &quot;Most Popular&quot; Package
                </Label>
              </div>

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
                {!isNewPackage ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePackage(editingPkg)}
                    className="text-xs text-destructive hover:bg-destructive/10"
                  >
                    Delete Package
                  </Button>
                ) : <div />}

                <div className="flex items-center gap-3">
                  <Button type="button" variant="outline" size="sm" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="gap-2 bg-[#00B578] hover:bg-[#009B63] text-white" disabled={isSaving}>
                    <SaveIcon className="size-4" />
                    {isSaving ? "Saving..." : isNewPackage ? "Create Package" : "Save Package Price"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
