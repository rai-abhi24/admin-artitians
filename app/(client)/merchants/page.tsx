import { Suspense } from "react";
import { Metadata } from "next";
import MerchantList from "./_components/MerchantList";

export const metadata: Metadata = {
    title: "Merchants",
    description: "Manage and track your merchant efficiently.",
};

function MerchantSkeleton() {
    return (
        <div className="min-h-full flex flex-col items-center justify-center bg-background px-4">

        </div>
    );
}

export default function MerchantsPage() {
    return (
        <Suspense fallback={<MerchantSkeleton />}>
            <MerchantList />
        </Suspense>
    );
}