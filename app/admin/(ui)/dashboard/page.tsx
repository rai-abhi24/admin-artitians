"use client";

import { StatsCards } from "@/components/stats-cards";
import { RecentEnquiries } from "@/components/recent-enquiries";
import { Header } from "@/components/header";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [data, setData] = useState<{
    stats: any;
    recentEnquiries: any[];
  }>({
    stats: null,
    recentEnquiries: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getDashboardData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to load dashboard");

        const json = await res.json();
        setData(json);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    getDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col animate-pulse">
        <Header title="Dashboard" description="Overview of your admin panel" />
        <div className="flex-1 space-y-6 p-6">
          <StatsSkeleton />
          <EnquiriesSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header title="Dashboard" description="Overview of your admin panel" />
      <div className="flex-1 space-y-6 p-6">
        <StatsCards stats={data.stats} />
        <RecentEnquiries enquiries={data.recentEnquiries} />
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white border rounded-lg p-4 shadow-sm flex flex-col justify-between h-36"
        >
          <div className="w-32 h-4 bg-gray-200 rounded mb-4"></div>
          <div className="w-24 h-8 bg-gray-200 rounded mb-2"></div>
          <div className="w-20 h-3 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}

function EnquiriesSkeleton() {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 w-40 bg-gray-200 rounded"></div>
        <div className="h-8 w-20 bg-gray-200 rounded"></div>
      </div>

      <div className="space-y-4">
        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-gray-400 pb-2 border-b">
          <div className="h-4 bg-gray-100 rounded"></div>
          <div className="h-4 bg-gray-100 rounded"></div>
          <div className="h-4 bg-gray-100 rounded"></div>
          <div className="h-4 bg-gray-100 rounded"></div>
          <div className="h-4 bg-gray-100 rounded"></div>
        </div>

        {/* 5 Fake Rows */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 py-3 border-b">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}