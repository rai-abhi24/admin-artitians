"use client";

import { useEffect, useState } from "react";
import StatCard from "@/app/(client)/dashboard/_components/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    TrendingUp,
    DollarSign,
    Activity,
    XCircle,
    Building2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getDashboardData } from "@/lib/services/dashboard";
import MerchantDetailsDialog from "../../merchants/_components/MerchantDetailsDialog";
import { getMerchant } from "@/lib/services/merchant";
import { DashboardData, MerchantSummary } from "@/types/dashboard";
import { MerchantStatus } from "@/types/merchant";
import StatusColumn from "./StatusColumn";

const Dashboard = () => {
    const router = useRouter();
    const [data, setData] = useState<DashboardData>({
        analytics: {
            totalMerchants: 0,
            statusCounts: [],
            recentActivity: {
                newMerchants: 0,
                statusChanges: 0,
                period: "24h"
            },
            trends: {}
        },
        recentMerchantsByStatus: {
            pending: [],
            processing: [],
            approved: [],
            onboarded: [],
            rejected: []
        },
    });

    const [loading, setLoading] = useState(true);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [details, setDetails] = useState<any | null>(null);

    useEffect(() => {
        async function fetchDashboard() {
            try {
                const res = await getDashboardData();
                const responseData = res.data;

                const processedData: DashboardData = {
                    analytics: responseData.analytics || {
                        totalMerchants: 0,
                        statusCounts: Object.entries(responseData.statusCounts || {}).map(([status, count]) => ({
                            status: status as MerchantStatus,
                            count: count as number
                        })),
                        recentActivity: {
                            newMerchants: 0,
                            statusChanges: 0,
                            period: "24h" as const
                        },
                        trends: {}
                    },
                    recentMerchantsByStatus: responseData.recentMerchantsByStatus || {
                        pending: [],
                        processing: [],
                        approved: [],
                        onboarded: [],
                        rejected: []
                    },
                };

                if (!responseData.recentMerchantsByStatus && responseData.recentMerchants) {
                    const grouped = responseData.recentMerchants.reduce((acc: any, merchant: MerchantSummary) => {
                        if (!acc[merchant.status]) acc[merchant.status] = [];
                        if (acc[merchant.status].length < 5) {
                            acc[merchant.status].push(merchant);
                        }
                        return acc;
                    }, {
                        pending: [],
                        processing: [],
                        approved: [],
                        onboarded: [],
                        rejected: []
                    });
                    processedData.recentMerchantsByStatus = grouped;
                }

                setData(processedData);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboard();
    }, []);

    const getStatusColor = (status: MerchantStatus) => {
        switch (status) {
            case "pending": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
            case "processing": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
            case "onboarded": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
            case "approved": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400";
            case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
        }
    };

    const navigateToMerchants = (status?: MerchantStatus) => {
        const params = status ? `?status=${status}` : '';
        router.push(`/enquiries${params}`);
    };

    async function openDetailsDialog(merchantId: string) {
        setDetailsOpen(true);
        setDetailsLoading(true);
        setDetails(null);
        try {
            const res = await getMerchant(merchantId);
            setDetails((res as any).data || null);
        } catch (e) {
            console.error("Failed to fetch merchant details:", e);
        } finally {
            setDetailsLoading(false);
        }
    }

    // const getTrendIcon = (change: number) => {
    //     if (change > 0) return <TrendingUp className="h-3 w-3 text-green-600" />;
    //     if (change < 0) return <TrendingDown className="h-3 w-3 text-red-600" />;
    //     return null;
    // };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const statusOrder: MerchantStatus[] = ['approved', 'onboarded', 'pending', 'processing', 'rejected'];

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="flex items-center gap-4">
                {data.analytics.statusCounts.map((stat, i) => (
                    <div className="flex-1" key={`stat-${i}`}>
                        <StatCard
                            title={stat.status}
                            value={stat.count}
                        />
                    </div>
                ))}
            </div>

            {/* Recent Activity Summary */}
            {data.analytics.recentActivity.newMerchants > 0 && (
                <div className="flex gap-4">
                    <Card className="p-0 h-max flex-1">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-6">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                    <Building2 className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">New Merchants</p>
                                    <p className="mt-2 text-2xl font-bold text-blue-600">{data.analytics.recentActivity.newMerchants}</p>
                                    <p className="text-xs text-muted-foreground">Last 24 hours</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="p-0 h-max flex-1">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-6">
                                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                    <Activity className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Status Changes</p>
                                    <p className="mt-2 text-2xl font-bold text-green-600">{data.analytics.recentActivity.statusChanges}</p>
                                    <p className="text-xs text-muted-foreground">Last 24 hours</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* {data.analytics.conversionRate && (
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                        <TrendingUp className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Conversion Rate</p>
                                        <p className="text-2xl font-bold text-purple-600">{data.analytics.conversionRate}%</p>
                                        <p className="text-xs text-muted-foreground">Pending to approved</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )} */}
                </div>
            )}

            {/* Recent Merchants by Status */}
            <Card className="gap-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 py-0">
                    <div>
                        <CardTitle className="text-lg">Recent Enquiries</CardTitle>
                        {/* <p className="text-sm text-muted-foreground mt-1">
                            Latest merchants grouped by status
                        </p> */}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigateToMerchants()}>
                        View All Enquiries
                    </Button>
                </CardHeader>
                <CardContent>
                    <div>
                        {/* {statusOrder.map((status) => (
                            <StatusColumn
                                key={status}
                                status={status}
                                merchants={data.recentMerchantsByStatus[status] || []}
                                getStatusColor={getStatusColor}
                                openDetailsDialog={openDetailsDialog}
                            />
                        ))} */}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;