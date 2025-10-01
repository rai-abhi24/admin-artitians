import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingDashboard() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={`stat-${i}`} className="p-4 rounded-lg border bg-card">
                        <Skeleton className="h-4 w-24 mb-3" />
                        <Skeleton className="h-8 w-20" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-8 w-24" />
                    </div>
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={`row-${i}`} className="p-3 rounded-md bg-muted/30">
                                <Skeleton className="h-4 w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


