import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingUsers() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-28" />
            </div>
            <div className="rounded-lg border bg-card p-6">
                <div className="mb-4">
                    <Skeleton className="h-5 w-36" />
                </div>
                <div className="space-y-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={`row-${i}`} className="grid grid-cols-6 gap-4 items-center">
                            {Array.from({ length: 6 }).map((__, j) => (
                                <Skeleton key={`cell-${i}-${j}`} className="h-5 w-full" />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


