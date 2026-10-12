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
  MessageSquareIcon,
  Building2Icon,
  MailIcon,
  PhoneIcon,
  ExternalLinkIcon,
  ClockIcon,
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
    id: "pkg-starter",
    packageCode: "pkg-starter",
    name: "Starter Pack",
    credits: 5000,
    priceNGN: 5000,
    costPerQuestion: "200 Questions (₦25/Question)",
    popular: false,
    features: [
      "200 AI-Generated Exam Questions",
      "MCQ, True/False & Short Answer Formats",
      "Bloom's Taxonomy Cognitive Targeting",
      "Aiken, GIFT & Print-Ready PDF Export",
      "Instant OPay & Bank Transfer Activation",
      "Lifetime Credit Validity (No Expiry)",
    ],
    displayOrder: 1,
    isActive: true,
    isCustomQuote: false,
  },
  {
    id: "pkg-department",
    packageCode: "pkg-department",
    name: "Department Pack",
    credits: 50000,
    priceNGN: 40000,
    costPerQuestion: "Ideal for academic departments running semester assessments across multiple courses.",
    popular: true,
    features: [
      "Up to 2,000 Exam Questions (25 credits/question)",
      "50,000 Generation Credits (Never expire)",
      "Multi-Course & Syllabus Tagging",
      "Instant LMS Export (Aiken, GIFT & Print-Ready PDF)",
      "Full Gradebook & CSV Result Analytics",
      "OPay & Bank Transfer Instant Activation",
    ],
    displayOrder: 2,
    isActive: true,
    isCustomQuote: false,
  },
  {
    id: "pkg-faculty-pro",
    packageCode: "pkg-faculty-pro",
    name: "Faculty / Institutional Pro",
    credits: 100000,
    priceNGN: 75000,
    costPerQuestion: "Built for entire faculties, polytechnics, and multi-lecturer exam moderation committees.",
    popular: false,
    features: [
      "Up to 4,000+ Exam Questions (Bulk volume discount)",
      "100,000 Generation Credits",
      "Department-Wide Seat & Credit Sharing",
      "Priority Generation Processing Queue",
      "Custom Institutional Exam Header Templates",
      "Dedicated Account Support & WhatsApp Onboarding",
    ],
    displayOrder: 3,
    isActive: true,
    isCustomQuote: false,
  },
  {
    id: "pkg-enterprise",
    packageCode: "pkg-enterprise",
    name: "Enterprise & Institution",
    credits: 0,
    priceNGN: 0,
    costPerQuestion: "Custom Volume · Multi-Faculty Assessment Licensing",
    popular: false,
    features: [
      "High-Volume / Unlimited Custom Credit Pool",
      "Multi-Department & Multi-Lecturer Collaboration",
      "Custom Exam Header Templates & School Branding",
      "Aiken, GIFT, Moodle & Print-Ready PDF Bundles",
      "Official Invoice, Bank Transfer & Purchase Order Support",
      "Dedicated Account Specialist & Priority SLAs",
      "Hands-on Lecturer & Departmental Onboarding",
    ],
    displayOrder: 4,
    isActive: true,
    isCustomQuote: true,
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

  // Paystack & Gateway Checkout Modal State
  const [checkoutModalPkg, setCheckoutModalPkg] = useState<PricingPackage | null>(null);
  const [checkoutOrderRef, setCheckoutOrderRef] = useState<string>("");
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<string>("card");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [verifyingOrderRef, setVerifyingOrderRef] = useState<string | null>(null);
  const [isSyncingHistory, setIsSyncingHistory] = useState(false);

  // Contact Sales / Institutional Inquiry Modal State
  const [contactSalesPkg, setContactSalesPkg] = useState<PricingPackage | null>(null);
  const [inquiryName, setInquiryName] = useState(user?.fullName || "");
  const [inquiryEmail, setInquiryEmail] = useState(user?.email || "");
  const [inquiryInstitution, setInquiryInstitution] = useState(user?.institutionName || "");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryVolume, setInquiryVolume] = useState("50,000+ Questions / Year");
  const [inquiryNotes, setInquiryNotes] = useState("");
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);

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

  // Listen for Paystack redirect callback (reference/trxref in URL)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get("reference") || urlParams.get("trxref");
    if (!reference) return;

    const safeRef: string = reference;
    let isMounted = true;
    async function verifyPaystackTx() {
      setIsVerifyingPayment(true);
      try {
        const verifyRes = await billingService.verifyPayment(safeRef);
        if (verifyRes?.isSuccess) {
          if (verifyRes.remainingQuota !== undefined && Number.isFinite(verifyRes.remainingQuota) && verifyRes.remainingQuota > 0) {
            useAuthStore.getState().setRemainingQuota(verifyRes.remainingQuota);
          } else {
            const profile = await getCurrentUserProfile();
            if (profile && profile.remainingQuota !== undefined && Number.isFinite(profile.remainingQuota)) {
              useAuthStore.getState().setRemainingQuota(profile.remainingQuota);
            }
          }
          await loadHistory();
          setToastMsg(verifyRes.message || `🎉 Payment Verified! +${verifyRes.creditsAdded.toLocaleString()} Credits added to your balance.`);
          setTimeout(() => setToastMsg(null), 6000);
        } else {
          setToastMsg(verifyRes?.message || "Payment verification could not be confirmed.");
          setTimeout(() => setToastMsg(null), 5000);
        }
      } catch {
        setToastMsg("Payment verification encountered a network error.");
        setTimeout(() => setToastMsg(null), 5000);
      } finally {
        if (isMounted) {
          setIsVerifyingPayment(false);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }

    verifyPaystackTx();
    return () => {
      isMounted = false;
    };
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
            provider: r.orderReference?.includes("PS")
              ? "Paystack (Card, Transfer, USSD)"
              : r.tenantName
              ? `Payment (${r.tenantName})`
              : "Paystack Unified Gateway",
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

  async function handleVerifyPendingTx(orderRef: string) {
    if (!orderRef) return;
    setVerifyingOrderRef(orderRef);
    try {
      const verifyRes = await billingService.verifyPayment(orderRef);
      if (verifyRes?.isSuccess) {
        if (verifyRes.remainingQuota !== undefined && Number.isFinite(verifyRes.remainingQuota)) {
          useAuthStore.getState().setRemainingQuota(verifyRes.remainingQuota);
        } else if (verifyRes.creditsAdded > 0) {
          const current = user?.remainingQuota ?? 1500;
          useAuthStore.getState().setRemainingQuota(current + verifyRes.creditsAdded);
        }
        await loadHistory();
        setToastMsg(`🎉 Payment Verified! +${(verifyRes.creditsAdded || 5000).toLocaleString()} Credits added to your balance.`);
        setTimeout(() => setToastMsg(null), 6000);
      } else {
        alert(verifyRes?.message || "Payment is still awaiting gateway confirmation on Paystack.");
      }
    } catch {
      alert("Network error while verifying transaction with Paystack.");
    } finally {
      setVerifyingOrderRef(null);
    }
  }

  async function handleSyncPendingHistory() {
    setIsSyncingHistory(true);
    try {
      const pendingRows = history.filter((h) => h.status === "Pending");
      if (pendingRows.length === 0) {
        await loadHistory();
        setToastMsg("Payment history refreshed. No pending transactions found.");
        setTimeout(() => setToastMsg(null), 3000);
        return;
      }

      let newlyCredited = 0;
      for (const row of pendingRows) {
        try {
          const res = await billingService.verifyPayment(row.orderRef);
          if (res?.isSuccess) {
            newlyCredited++;
            if (res.remainingQuota !== undefined && Number.isFinite(res.remainingQuota)) {
              useAuthStore.getState().setRemainingQuota(res.remainingQuota);
            }
          }
        } catch {
          // Continue with next
        }
      }

      await loadHistory();
      if (newlyCredited > 0) {
        setToastMsg(`🎉 Successfully verified and credited ${newlyCredited} transaction(s)!`);
        setTimeout(() => setToastMsg(null), 6000);
      } else {
        setToastMsg("Gateway sync complete. Pending transactions are still awaiting Paystack clearance.");
        setTimeout(() => setToastMsg(null), 5000);
      }
    } catch {
      setToastMsg("Failed to synchronize gateway history.");
      setTimeout(() => setToastMsg(null), 4000);
    } finally {
      setIsSyncingHistory(false);
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
        // 1. Sanitize: ensure any zero-price or enterprise package has isCustomQuote = true
        const sanitized = data.map((p) => ({
          ...p,
          isCustomQuote: Boolean(p.isCustomQuote || p.priceNGN <= 0 || p.name.toLowerCase().includes("enterprise")),
        }));

        // 2. Guarantee Enterprise tier is included even if legacy deployed API did not return it
        const hasEnterprise = sanitized.some((p) => p.isCustomQuote || p.name.toLowerCase().includes("enterprise"));
        const combined = hasEnterprise
          ? sanitized
          : [...sanitized, ...defaultFallbackPackages.filter((p) => p.isCustomQuote)];

        setPackages(deduplicatePackages(combined));
      } else {
        setPackages(deduplicatePackages(defaultFallbackPackages));
      }
    } catch {
      setPackages(deduplicatePackages(defaultFallbackPackages));
    } finally {
      setLoading(false);
    }
  }

  function handleOpenContactSales(pkg: PricingPackage) {
    setContactSalesPkg(pkg);
    setInquiryName(user?.fullName || "");
    setInquiryEmail(user?.email || "");
    setInquiryInstitution(user?.institutionName || "");
  }

  function handleSendWhatsApp(pkg: PricingPackage) {
    const institutionText = inquiryInstitution ? ` for ${inquiryInstitution}` : "";
    const msg = encodeURIComponent(
      `Hello Lecturra, our institution${institutionText} is interested in discussing a custom Enterprise credit package for our examinations (${pkg.name}).`
    );
    window.open(`https://wa.me/2348030000000?text=${msg}`, "_blank");
  }

  async function handleSubmitInquiry(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!contactSalesPkg) return;
    setIsSubmittingInquiry(true);
    try {
      await billingService.submitInquiry({
        name: inquiryName,
        email: inquiryEmail,
        institution: inquiryInstitution,
        phone: inquiryPhone,
        estimatedVolume: inquiryVolume,
        notes: inquiryNotes,
      });
      setToastMsg(`Inquiry received for ${contactSalesPkg.name}! Our enterprise team will contact you shortly.`);
      setTimeout(() => setToastMsg(null), 5000);
      setContactSalesPkg(null);
    } catch {
      alert("Failed to submit inquiry. You can also chat directly via WhatsApp.");
    } finally {
      setIsSubmittingInquiry(false);
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
      isCustomQuote: false,
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
        isCustomQuote: editingPkg.isCustomQuote || editingPkg.priceNGN <= 0,
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

  async function handleResetDefaultPackages() {
    if (
      !confirm(
        "Reset all pricing packages to the recommended standard configuration?\n\nThis will configure:\n1. Starter Pack (₦5,000 / 5,000 credits)\n2. Department Pack (₦40,000 / 50,000 credits)\n3. Faculty / Institutional Pro (₦75,000 / 100,000 credits)\n4. Enterprise & Institution (Custom / Tailored)"
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const resetPkgs = await billingService.resetPricingPackages();
      setPackages(deduplicatePackages(resetPkgs));
      setToastMsg("✅ Packages successfully reset to standard institutional tiers!");
      setTimeout(() => setToastMsg(null), 5000);
    } catch {
      setPackages(deduplicatePackages(defaultFallbackPackages));
      setToastMsg("Standard packages loaded.");
      setTimeout(() => setToastMsg(null), 4000);
    } finally {
      setLoading(false);
    }
  }

  async function handleInitializePayment(pkg: PricingPackage) {
    // Safety guard: Custom quote packages must NEVER initialize online payment
    if (pkg.isCustomQuote || pkg.priceNGN <= 0) {
      handleOpenContactSales(pkg);
      return;
    }

    setSelectedPackage(pkg.id);
    setIsProcessing(true);
    try {
      const callbackUrl = typeof window !== "undefined"
        ? `${window.location.origin}/dashboard/billing?status=verify`
        : "";

      const res = await billingService.initializePayment({
        packageId: pkg.id,
        amount: pkg.priceNGN,
        credits: pkg.credits,
        email: user?.email,
        callbackUrl,
        paymentProvider: "Paystack",
      });

      const cashierUrl = res?.checkoutUrl || "";

      // If live Paystack cashier URL returned, redirect user directly!
      // Paystack hosts Cards, Bank Transfers, and USSD directly on this URL.
      if (
        cashierUrl &&
        (cashierUrl.startsWith("http://") || cashierUrl.startsWith("https://")) &&
        !cashierUrl.includes("test-checkout")
      ) {
        window.location.href = cashierUrl;
        return;
      }

      // Simulation modal for offline/local sandbox testing
      const orderRef = res?.orderReference || `LECTURA-PS-${Date.now().toString(36).toUpperCase()}`;
      setCheckoutOrderRef(orderRef);
      setCheckoutModalPkg(pkg);
    } catch {
      const orderRef = `LECTURA-PS-${Date.now().toString(36).toUpperCase()}`;
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
      // 1. Try to verify transaction with backend
      const verifyRes = await billingService.verifyPayment(checkoutOrderRef);
      if (verifyRes?.isSuccess && verifyRes.remainingQuota !== undefined && verifyRes.remainingQuota > 0) {
        useAuthStore.getState().setRemainingQuota(verifyRes.remainingQuota);
      } else {
        const profile = await getCurrentUserProfile();
        if (profile && profile.remainingQuota !== undefined && Number.isFinite(profile.remainingQuota)) {
          useAuthStore.getState().setRemainingQuota(profile.remainingQuota);
        }
      }

      // 2. Reload payment history from database
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

      {/* Paystack Payment Verifying Overlay */}
      {isVerifyingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center space-y-4">
            <RefreshCwIcon className="size-10 text-[#00B578] animate-spin mx-auto" />
            <div>
              <h3 className="font-heading font-bold text-lg text-foreground">Confirming Payment...</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Verifying transaction with Paystack and synchronizing your workspace quota credits.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Action & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div className="flex items-center gap-2 flex-wrap">
          {isAdmin ? (
            <>
              <Badge variant="outline" className="gap-1 border-[#00B578]/30 text-[#00B578]">
                <SparklesIcon className="size-3.5" /> Credit Packages & Pricing Setup
              </Badge>
              <Badge className="bg-[#00B578]/10 text-[#00B578] border-[#00B578]/30 font-mono text-[10px]">
                Admin Price Controls Active
              </Badge>
            </>
          ) : (
            <Badge variant="outline" className="gap-1 border-[#00B578]/30 text-[#00B578]">
              <CreditCardIcon className="size-3.5" /> Paystack Unified Checkout (Cards, Bank Transfer & USSD)
            </Badge>
          )}
        </div>

        {isAdmin && (
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <Button onClick={handleOpenAddModal} size="sm" className="gap-2 bg-[#00B578] hover:bg-[#009B63] text-white shadow-sm">
              <PlusIcon className="size-4" /> Add New Package
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDefaultPackages}
              className="gap-2 border-[#00B578]/40 text-[#00B578] hover:bg-[#00B578]/10 shadow-xs"
              title="Reset packages to recommended standard tiers"
            >
              <SparklesIcon className="size-4" /> Reset Standard Packages
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
                <p className="text-[11px] text-muted-foreground">Secure Checkout via Paystack (Cards, Transfer & USSD)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Credit Packages Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold tracking-tight">
              {isAdmin ? "System Pricing Packages & Configuration" : "Select Topup Credit Package"}
            </h2>
            {isAdmin ? (
              <p className="text-xs text-[#00B578] font-medium">
                As System Admin, you can set up and adjust package pricing, credit allotments, and feature descriptions. Click &quot;Configure Price &amp; Features&quot; to edit packages.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Select a topup credit package to replenish your question generation quota.
              </p>
            )}
          </div>
          {!isAdmin && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <ShieldCheckIcon className="size-3.5 text-[#00B578]" /> Instant Credit Allocation
            </Badge>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                  {pkg.isCustomQuote || pkg.priceNGN <= 0 ? (
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-heading text-3xl font-extrabold text-foreground">Custom</span>
                      <span className="text-xs text-muted-foreground font-normal"> / tailored credits</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-heading text-3xl font-bold">₦{pkg.priceNGN.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground font-normal"> / {pkg.credits.toLocaleString()} credits</span>
                    </div>
                  )}
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
                {isAdmin ? (
                  <div className="w-full flex flex-col gap-2">
                    <Button
                      className="w-full gap-2 bg-[#00B578] hover:bg-[#009B63] text-white shadow-sm font-semibold"
                      onClick={() => handleOpenEditModal(pkg)}
                    >
                      <PencilIcon className="size-4" /> Configure Price & Features
                    </Button>
                    {pkg.isCustomQuote || pkg.priceNGN <= 0 ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full gap-1.5 border-[#38492A]/40 text-[#38492A] hover:bg-[#38492A]/10 text-xs font-semibold"
                        onClick={() => handleOpenContactSales(pkg)}
                      >
                        <MessageSquareIcon className="size-3.5" /> Test &quot;Contact Sales&quot; Modal
                      </Button>
                    ) : (
                      <p className="text-[10px] text-muted-foreground text-center">
                        Faculty view renders: <span className="font-semibold text-foreground">⚡ Pay ₦{pkg.priceNGN.toLocaleString()}</span>
                      </p>
                    )}
                  </div>
                ) : pkg.isCustomQuote || pkg.priceNGN <= 0 ? (
                  <Button
                    className="w-full gap-2 bg-[#38492A] hover:bg-[#2b3820] text-white shadow-sm font-semibold transition-all"
                    onClick={() => handleOpenContactSales(pkg)}
                  >
                    <MessageSquareIcon className="size-4" /> Contact Sales
                  </Button>
                ) : (
                  <Button
                    className="w-full gap-2"
                    variant={pkg.popular ? "default" : "outline"}
                    onClick={() => handleInitializePayment(pkg)}
                    disabled={isProcessing && selectedPackage === pkg.id}
                  >
                    <ZapIcon className="size-4" />
                    {isProcessing && selectedPackage === pkg.id ? "Connecting to Gateway..." : `Pay ₦${pkg.priceNGN.toLocaleString()}`}
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <HistoryIcon className="size-4 text-muted-foreground" />
                Payment & Credit History
              </CardTitle>
              <CardDescription className="text-xs">
                History of credit allocations and topup order transactions.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncPendingHistory}
              disabled={isSyncingHistory}
              className="gap-1.5 text-xs h-8 border-border hover:bg-muted font-medium shrink-0"
            >
              <RefreshCwIcon className={`size-3.5 ${isSyncingHistory ? "animate-spin text-[#00B578]" : ""}`} />
              {isSyncingHistory ? "Checking Gateway..." : "Sync Paystack Status"}
            </Button>
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
                      {h.status === "Completed" ? (
                        <Badge className="bg-[#00B578]/10 text-[#00B578] border-[#00B578]/30 gap-1 font-medium">
                          <CheckCircle2Icon className="size-3" /> Completed
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10 gap-1 font-medium">
                            <ClockIcon className="size-3" /> Pending
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerifyPendingTx(h.orderRef)}
                            disabled={verifyingOrderRef === h.orderRef}
                            className="h-6 px-2 text-[11px] gap-1 border-[#00B578]/60 text-[#00B578] hover:bg-[#00B578]/10 font-semibold shadow-xs"
                          >
                            <RefreshCwIcon className={`size-3 ${verifyingOrderRef === h.orderRef ? "animate-spin" : ""}`} />
                            {verifyingOrderRef === h.orderRef ? "Verifying..." : "Verify Payment"}
                          </Button>
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-muted-foreground">{h.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Paystack Express Checkout Gateway Modal */}
      {checkoutModalPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            {/* Paystack Header Banner */}
            <div className="bg-[#00B578] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                  PS
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg leading-none">Paystack Unified Checkout</h3>
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
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Channels Included (Cards, Bank Transfer & USSD)
                </Label>
                <div className="grid grid-cols-2 gap-2">
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
                <span>256-Bit SSL Encrypted Paystack Gateway. Supports Cards, Bank Transfer & USSD.</span>
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

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="customQuoteCheckbox"
                  checked={editingPkg.isCustomQuote || false}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setEditingPkg({
                      ...editingPkg,
                      isCustomQuote: checked,
                      priceNGN: checked ? 0 : (editingPkg.priceNGN || 10000),
                      credits: checked ? 0 : (editingPkg.credits || 10000),
                    });
                  }}
                  className="size-4 rounded border-gray-300 text-[#00B578] focus:ring-[#00B578]"
                />
                <Label htmlFor="customQuoteCheckbox" className="text-xs font-medium cursor-pointer">
                  Custom Quote / Enterprise Tier (Renders &quot;Contact Sales&quot; — bypasses online payment)
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

      {/* Contact Sales / Institutional Inquiry Modal */}
      {contactSalesPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-border bg-[#38492A]/10">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-[#38492A] text-white flex items-center justify-center shadow-xs">
                  <Building2Icon className="size-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    Institutional Consultation
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Enterprise tier arrangements for {contactSalesPkg.name}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={() => setContactSalesPkg(null)}>
                <XIcon className="size-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmitInquiry} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="p-3 rounded-lg bg-muted/60 border border-border/60 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Custom Institutional Arrangement</p>
                <p>
                  This tier is designed for faculties, polytechnics, and multi-campus universities. Our institutional solutions team will coordinate with your exam moderation committee to allocate customized quota pools, SLAs, and dedicated integrations.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="inquiryName" className="text-xs font-semibold">Contact Officer Name</Label>
                  <Input
                    id="inquiryName"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="e.g. Prof. Adebayo"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="inquiryEmail" className="text-xs font-semibold">Institutional Email</Label>
                  <Input
                    id="inquiryEmail"
                    type="email"
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    placeholder="e.g. adebayo@unilag.edu.ng"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="inquiryInstitution" className="text-xs font-semibold">University / Institution</Label>
                  <Input
                    id="inquiryInstitution"
                    value={inquiryInstitution}
                    onChange={(e) => setInquiryInstitution(e.target.value)}
                    placeholder="e.g. University of Lagos"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="inquiryPhone" className="text-xs font-semibold">Phone / WhatsApp</Label>
                  <Input
                    id="inquiryPhone"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    placeholder="e.g. +234 803 123 4567"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="inquiryVolume" className="text-xs font-semibold">Estimated Assessment Volume</Label>
                <Input
                  id="inquiryVolume"
                  value={inquiryVolume}
                  onChange={(e) => setInquiryVolume(e.target.value)}
                  placeholder="e.g. 50,000 Questions / Semester"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="inquiryNotes" className="text-xs font-semibold">Specific Requirements / Notes</Label>
                <textarea
                  id="inquiryNotes"
                  rows={3}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  value={inquiryNotes}
                  onChange={(e) => setInquiryNotes(e.target.value)}
                  placeholder="Specify LMS integration (Moodle/Canvas), custom exam format, or campus billing procedures..."
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendWhatsApp(contactSalesPkg)}
                  className="w-full sm:w-auto gap-2 border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 text-xs"
                >
                  <ExternalLinkIcon className="size-3.5" />
                  Chat via WhatsApp
                </Button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setContactSalesPkg(null)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="gap-2 bg-[#38492A] hover:bg-[#2b3820] text-white shadow-sm font-semibold"
                    disabled={isSubmittingInquiry}
                  >
                    <MailIcon className="size-4" />
                    {isSubmittingInquiry ? "Submitting..." : "Submit Inquiry"}
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
