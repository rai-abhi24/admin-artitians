"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
    Users,
    TrendingUp,
    DollarSign,
    Activity,
    XCircle,
} from "lucide-react";

type StatCardProps = {
    title: string;
    value: number;
    "data-testid"?: string;
    numberTestId?: string;
};

function useCountUp(target: number, duration = 1000) {
    const [value, setValue] = useState(0);
    const startRef = useRef<number | null>(null);
    const fromRef = useRef(0);
    const targetRef = useRef(target);

    useEffect(() => {
        fromRef.current = value;
        targetRef.current = target;
        startRef.current = null;

        let frame: number;
        const tick = (ts: number) => {
            if (startRef.current === null) startRef.current = ts;
            const elapsed = ts - startRef.current;
            const t = Math.min(1, elapsed / duration);

            const eased = 1 - Math.pow(1 - t, 3);
            const next = Math.round(fromRef.current + (targetRef.current - fromRef.current) * eased);
            setValue(next);
            if (t < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [target, duration]);

    return value;
}

const subTitleMap: Record<string, string> = {
    "pending": "New prospects",
    "processing": "Under review",
    "approved": "Active Merchants",
    "rejected": "Not approved",
    "onboarded": "Ready to Approve"
}

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    "pending": Activity,
    "processing": TrendingUp,
    "approved": DollarSign,
    "rejected": XCircle,
    "onboarded": Users
}

const accentMap: Record<string, string> = {
    "pending": "bg-primary/90",
    "processing": "bg-orange-500",
    "approved": "bg-emerald-600",
    "rejected": "bg-red-600",
    "onboarded": "bg-green-600",
}

const StatCard = React.memo(
    ({ title, value, trend, "data-testid": testId, numberTestId }: StatCardProps & { trend?: { change: number; period: string } }) => {
        const animated = useCountUp(value, 900);
        const router = useRouter();
        const Icon = iconMap[title.toLowerCase()];

        const handleClick = () => {
            router.push(`/merchants?status=${title.toLowerCase()}`);
        };

        const isPositive = trend?.change && trend.change > 0;

        return (
            <Card
                className="hover-elevate p-0 m-0 cursor-pointer hover:scale-105 transition-all ease-linear"
                data-testid={testId}
            >
                <div className="flex items-stretch justify-between p-4" onClick={handleClick}>
                    <div className="flex-1 pr-4">
                        <CardHeader className="p-0 pb-3">
                            <CardTitle className="text-sm font-medium capitalize">{title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="text-3xl lg:text-4xl font-bold mb-1" data-testid={numberTestId}>
                                {animated}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {subTitleMap[title.toLowerCase()]}
                            </p>

                            {/* 👇 Trend section */}
                            {trend && (
                                <div className={`flex items-center gap-1 text-xs mt-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
                                    {isPositive ? "↑" : "↓"} {Math.abs(trend.change)}% this {trend.period}
                                </div>
                            )}
                        </CardContent>
                    </div>

                    <div className="relative flex items-center font-montserrat">
                        <div
                            className={`w-12 h-12 rounded-2xl ${accentMap[title.toLowerCase()]} flex items-center justify-center shadow-sm`}
                        >
                            <Icon className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>
            </Card>
        );
    }
);

StatCard.displayName = "StatCard";
export default StatCard;