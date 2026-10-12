import { api } from "@/lib/api/client";

export interface PricingPackage {
  id: string;
  packageCode: string;
  name: string;
  credits: number;
  priceNGN: number;
  costPerQuestion: string;
  popular: boolean;
  features: string[];
  displayOrder: number;
  isActive: boolean;
  isCustomQuote?: boolean;
}

export interface UpdatePricingPackageRequest {
  id?: string;
  packageCode?: string;
  name: string;
  credits: number;
  priceNGN: number;
  costPerQuestion: string;
  popular: boolean;
  features: string[];
  displayOrder: number;
  isActive: boolean;
  isCustomQuote?: boolean;
}

export interface InstitutionalInquiryPayload {
  name: string;
  email: string;
  institution: string;
  phone: string;
  estimatedVolume?: string;
  notes?: string;
}

export interface InitializePaymentResponse {
  orderReference: string;
  checkoutUrl: string;
  amount: number;
}

export interface InitializePaymentPayload {
  packageId?: string;
  tier?: number;
  amount?: number;
  credits?: number;
  email?: string;
  callbackUrl?: string;
  paymentProvider?: string;
}

export interface VerifyPaymentResponse {
  isSuccess: boolean;
  orderReference: string;
  amount: number;
  creditsAdded: number;
  remainingQuota: number;
  status: string;
  message: string;
}

export interface PaymentTransactionItem {
  transactionId: string;
  orderReference: string;
  gatewayTransactionId?: string;
  oPayTransactionId?: string;
  amount: number;
  currency: string;
  status: number | string;
  createdAt: string;
  tenantName?: string;
}

export interface PaginatedList<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export const DEFAULT_PRICING_PACKAGES: PricingPackage[] = [
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
    id: "pkg-course-pack",
    packageCode: "pkg-course-pack",
    name: "Course Pack",
    credits: 20000,
    priceNGN: 18000,
    costPerQuestion: "800 Questions (₦22.5/Question · Course Coordinators)",
    popular: false,
    features: [
      "Up to 800 AI-Generated Exam Questions",
      "20,000 Generation Credits (Never expire)",
      "Multi-Course & Syllabus Tagging",
      "Bloom's Taxonomy Cognitive Targeting",
      "Instant LMS Export (Aiken, GIFT & Print-Ready PDF)",
      "OPay & Bank Transfer Instant Activation",
      "Lifetime Credit Validity (No Expiry)",
    ],
    displayOrder: 2,
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
    displayOrder: 3,
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
    displayOrder: 4,
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
    displayOrder: 5,
    isActive: true,
    isCustomQuote: true,
  },
];

export function getStandardPackageOrder(pkg: Partial<PricingPackage>): number {
  const code = (pkg.packageCode || pkg.id || "").toLowerCase();
  const name = (pkg.name || "").toLowerCase();

  if (code.includes("starter") || name.includes("starter")) return 1;
  if (code.includes("course") || name.includes("course")) return 2;
  if (code.includes("department") || name.includes("department")) return 3;
  if (code.includes("faculty") || name.includes("faculty")) return 4;
  if (code.includes("enterprise") || name.includes("enterprise") || pkg.isCustomQuote || (pkg.priceNGN !== undefined && pkg.priceNGN <= 0)) return 5;

  return pkg.displayOrder ?? 99;
}

export const billingService = {
  async getPricingPackages(): Promise<PricingPackage[]> {
    try {
      const res = await api.get<{ success: boolean; data: PricingPackage[] }>("/api/v1/billing/packages");
      if (res.data?.data && res.data.data.length > 0) {
        const serverPackages = res.data.data;
        const missingDefaults = DEFAULT_PRICING_PACKAGES.filter(
          (def) =>
            !serverPackages.some(
              (p) =>
                (p.id && p.id.toLowerCase() === def.id.toLowerCase()) ||
                (p.packageCode && p.packageCode.toLowerCase() === def.packageCode.toLowerCase()) ||
                p.name.toLowerCase() === def.name.toLowerCase()
            )
        );

        return [...serverPackages, ...missingDefaults]
          .map((p) => ({
            ...p,
            displayOrder: getStandardPackageOrder(p),
          }))
          .sort((a, b) => getStandardPackageOrder(a) - getStandardPackageOrder(b));
      }
      return DEFAULT_PRICING_PACKAGES;
    } catch {
      return DEFAULT_PRICING_PACKAGES;
    }
  },

  async initializePayment(
    payloadOrPackageId?: InitializePaymentPayload | string,
    tier: number = 1
  ): Promise<InitializePaymentResponse | null> {
    try {
      let body: InitializePaymentPayload = { tier, paymentProvider: "Paystack" };
      if (typeof payloadOrPackageId === "string") {
        body = { packageId: payloadOrPackageId, tier, paymentProvider: "Paystack" };
      } else if (payloadOrPackageId && typeof payloadOrPackageId === "object") {
        body = { paymentProvider: "Paystack", ...payloadOrPackageId };
      }

      const res = await api.post<{ success: boolean; data: InitializePaymentResponse }>(
        "/api/v1/billing/initialize",
        body
      );
      return res.data?.data || null;
    } catch {
      return null;
    }
  },

  async verifyPayment(orderReference: string): Promise<VerifyPaymentResponse | null> {
    try {
      const res = await api.get<{ success: boolean; data: VerifyPaymentResponse }>(
        `/api/v1/billing/verify/${encodeURIComponent(orderReference)}`
      );
      return res.data?.data || null;
    } catch {
      return null;
    }
  },

  async completePayment(payload: {
    orderReference: string;
    amount: number;
    credits: number;
    paymentMethod?: string;
  }): Promise<boolean> {
    try {
      const res = await api.post<{ success: boolean }>("/api/v1/billing/complete", payload);
      return res.data?.success || false;
    } catch {
      return false;
    }
  },

  async getPaymentHistory(pageNumber: number = 1, pageSize: number = 50, all: boolean = true): Promise<PaymentTransactionItem[]> {
    try {
      const res = await api.get<{ success: boolean; data: PaginatedList<PaymentTransactionItem> }>(
        `/api/v1/billing/history?pageNumber=${pageNumber}&pageSize=${pageSize}&all=${all}`
      );
      return res.data?.data?.items || [];
    } catch {
      return [];
    }
  },

  async updatePricingPackage(pkg: UpdatePricingPackageRequest): Promise<PricingPackage | null> {
    const targetId = pkg.id || pkg.packageCode || `pkg-${Date.now()}`;
    const res = await api.put<{ success: boolean; data: PricingPackage }>(`/api/v1/billing/packages/${targetId}`, {
      name: pkg.name,
      credits: pkg.credits,
      priceNGN: pkg.priceNGN,
      costPerQuestion: pkg.costPerQuestion,
      popular: pkg.popular,
      features: pkg.features,
      displayOrder: pkg.displayOrder,
      isActive: pkg.isActive,
      isCustomQuote: pkg.isCustomQuote ?? (pkg.priceNGN === 0),
    });
    return res.data?.data || null;
  },

  async createPricingPackage(pkg: Omit<PricingPackage, "id" | "packageCode">): Promise<PricingPackage | null> {
    const newId = `pkg-${Date.now()}`;
    return this.updatePricingPackage({
      id: newId,
      packageCode: newId,
      ...pkg,
    });
  },

  async deletePricingPackage(id: string): Promise<boolean> {
    try {
      await api.put(`/api/v1/billing/packages/${id}`, {
        isActive: false,
      });
      return true;
    } catch {
      return false;
    }
  },

  async resetPricingPackages(): Promise<PricingPackage[]> {
    try {
      const res = await api.post<{ success: boolean; data: PricingPackage[] }>("/api/v1/billing/packages/reset");
      if (res.data?.data && res.data.data.length > 0) {
        return res.data.data;
      }
      return DEFAULT_PRICING_PACKAGES;
    } catch {
      return DEFAULT_PRICING_PACKAGES;
    }
  },

  async submitInquiry(payload: InstitutionalInquiryPayload): Promise<boolean> {
    try {
      const res = await api.post<{ success: boolean }>("/api/v1/billing/inquiry", payload);
      return res.data?.success ?? true;
    } catch {
      return false;
    }
  },
};
