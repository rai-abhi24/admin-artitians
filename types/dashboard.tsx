export type MerchantStatus = "pending" | "processing" | "approved" | "rejected" | "onboarded";

export interface MerchantSummary {
    _id: string;
    businessName: string;
    status: MerchantStatus;
    createdAt: string;
    updatedAt?: string;
    entityType?: string | null;
    mcc?: string;
    email?: string;
    phone?: string;
    city?: string;
    state?: string;
    country?: string;
    tags?: string[];
    priority?: "low" | "medium" | "high";
    assignedTo?: string;
}

export interface StatusCount {
    status: MerchantStatus;
    count: number;
    trend?: {
        change: number;
        period: "day" | "week" | "month";
    };
}

export interface DashboardAnalytics {
    totalMerchants: number;
    statusCounts: StatusCount[];
    recentActivity: {
        newMerchants: number;
        statusChanges: number;
        period: "24h" | "7d" | "30d";
    };
    conversionRate?: number;
    averageProcessingTime?: number;
    trends: {
        [key in MerchantStatus]?: {
            current: number;
            previous: number;
            changePercent: number;
        };
    };
}

export interface DashboardData {
    analytics: DashboardAnalytics;
    recentMerchantsByStatus: {
        [key in MerchantStatus]: MerchantSummary[];
    };
}