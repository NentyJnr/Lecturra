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
    isCustomQuote: false,
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
    isCustomQuote: false,
  },
  {
    id: "pkg-3",
    packageCode: "pkg-3",
    name: "Institutional Bulk",
    credits: 50000,
    priceNGN: 40000,
    costPerQuestion: "2,000 questions (20% Discount)",
    popular: false,
    features: ["50,000 Credits", "Department-Wide Sharing", "Dedicated Account Manager", "Custom Exam Template Export", "Paystack & Instant Transfer Billing"],
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
    costPerQuestion: "Custom Volume & Pricing",
    popular: false,
    features: [
      "Tailored Campus-Wide Credits",
      "Dedicated Private Tenant Instance",
      "SSO & Active Directory Integration",
      "Custom SLA & 24/7 Phone Support",
      "Bespoke Exam Security & LMS Adapters",
    ],
    displayOrder: 4,
    isActive: true,
    isCustomQuote: true,
  },
];

export const billingService = {
  async getPricingPackages(): Promise<PricingPackage[]> {
    try {
      const res = await api.get<{ success: boolean; data: PricingPackage[] }>("/api/v1/billing/packages");
      if (res.data?.data && res.data.data.length > 0) {
        return res.data.data;
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

  async submitInquiry(payload: InstitutionalInquiryPayload): Promise<boolean> {
    try {
      const res = await api.post<{ success: boolean }>("/api/v1/billing/inquiry", payload);
      return res.data?.success ?? true;
    } catch {
      return false;
    }
  },
};
