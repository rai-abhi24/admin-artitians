"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MerchantFormProvider, useMerchantForm } from "../../../../../contexts/merchant-context";
import { Stepper } from "../../create/_components/Stepper";
import { getMerchant } from "@/lib/services/merchant";
import { useToast } from "@/hooks/use-toast";

export default function EditMerchantPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [merchantData, setMerchantData] = useState<Record<string, unknown> | null>(null);

    useEffect(() => {
        async function loadMerchant() {
            try {
                const merchantId = params.id as string;
                const response = await getMerchant(merchantId);
                if (response && (response as Record<string, unknown>).data) {
                    setMerchantData((response as Record<string, unknown>).data as Record<string, unknown>);
                } else {
                    toast({
                        title: "Merchant not found",
                        description: "The merchant you're trying to edit doesn't exist",
                        variant: "destructive" as any
                    });
                    router.push("/merchants");
                }
            } catch (error: unknown) {
                toast({
                    title: "Error loading merchant",
                    description: (error as Error)?.message || "Failed to load merchant data",
                    variant: "destructive" as any
                });
                router.push("/merchants");
            } finally {
                setLoading(false);
            }
        }

        if (params.id) {
            loadMerchant();
        }
    }, [params.id, router, toast]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading merchant data...</p>
                </div>
            </div>
        );
    }

    if (!merchantData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-muted-foreground">Merchant not found</p>
                </div>
            </div>
        );
    }

    return (
        <MerchantFormProvider>
            <EditMerchantStepper merchantData={merchantData} />
        </MerchantFormProvider>
    );
}

function EditMerchantStepper({ merchantData }: { merchantData: Record<string, unknown> }) {
    const { loadMerchantData } = useMerchantForm();

    useEffect(() => {
        loadMerchantData(merchantData);
    }, [merchantData]);

    return <Stepper />;
}

