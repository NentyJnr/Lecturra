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
}

export interface InitializePaymentResponse {
  orderReference: string;
  checkoutUrl: string;
  amount: number;
}

export interface PaymentTransactionItem {
  transactionId: string;
  orderReference: string;
  oPayTransactionId: string;
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

export const billingService = {
  async getPricingPackages(): Promise<PricingPackage[]> {
    try {
      const res = await api.get<{ success: boolean; data: PricingPackage[] }>("/api/v1/billing/packages");
      return res.data?.data || [];
    } catch {
      return [];
    }
  },

  async initializePayment(packageId?: string, tier: number = 1): Promise<InitializePaymentResponse | null> {
    try {
      const res = await api.post<{ success: boolean; data: InitializePaymentResponse }>("/api/v1/billing/initialize", {
        tier,
      });
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
};
