import { connectToDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    await connectToDB();

    try {
        const response = {
            analytics: {
                totalMerchants: 0,
                statusCounts: [],
                recentActivity: {
                    newMerchants: 0,
                    statusChanges: 0,
                    period: "24h" as const
                },
                conversionRate: 0,
                trends: {}
            },
            recentMerchantsByStatus: {
                pending: [],
                processing: [],
                approved: [],
                onboarded: [],
                rejected: []
            },
            statusCounts: {
                pending: 0,
                processing: 0,
                onboarded: 0,
                rejected: 0,
                approved: 0,
            },
            recentMerchants: []
        };

        return NextResponse.json({
            success: true,
            data: response
        });
    } catch (error) {
        console.error("Dashboard API Error:", error);

        // Fallback response structure
        return NextResponse.json({
            success: false,
            error: "Failed to fetch dashboard data",
            data: {
                analytics: {
                    totalMerchants: 0,
                    statusCounts: [],
                    recentActivity: {
                        newMerchants: 0,
                        statusChanges: 0,
                        period: "24h" as const
                    },
                    conversionRate: 0,
                    trends: {}
                },
                recentMerchantsByStatus: {
                    pending: [],
                    processing: [],
                    approved: [],
                    onboarded: [],
                    rejected: []
                },
                statusCounts: {
                    pending: 0,
                    processing: 0,
                    onboarded: 0,
                    rejected: 0,
                    approved: 0,
                },
                recentMerchants: []
            }
        }, { status: 500 });
    }
}