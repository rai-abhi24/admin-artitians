"use client";

import { BusinessEntityType, MerchantFormData } from "@/types/merchant";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type MerchantFormContextType = {
    data: MerchantFormData;
    update: (path: (data: MerchantFormData) => void) => void;
    currentStep: number;
    setCurrentStep: (idx: number) => void;
    totalSteps: number;
    merchantId?: string | null;
    setMerchantId?: (id: string | null) => void;
    resetForm: () => void;
    loadMerchantData: (merchantData: Record<string, unknown>) => void;
};

const MerchantFormContext = createContext<MerchantFormContextType | null>(null);

export function MerchantFormProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<MerchantFormData>({
        business: {},
        personal: {},
        product: {
            productType: "UPI",
            maxDaily: "500000",
            minPerTxn: "1",
            maxPerTxn: "100000",
            creditLimit: "15000000",
        },
        bank: {},
        vpa: {},
        kycDocs: {},
        businessEntityType: null,
    });
    const [currentStep, setCurrentStep] = useState(0);
    const [merchantId, setMerchantId] = useState<string | null>(null);

    const resetForm = () => {
        setData({
            business: {},
            personal: {},
            product: {
                productType: "UPI",
                maxDaily: "500000",
                minPerTxn: "1",
                maxPerTxn: "100000",
                creditLimit: "15000000",
            },
            bank: {},
            vpa: {},
            kycDocs: {},
            businessEntityType: null,
        });
        setCurrentStep(0);
        setMerchantId(null);
    };

    const loadMerchantData = (merchantData: Record<string, unknown>) => {
        setData({
            business: merchantData.business || {},
            personal: merchantData.personal || {},
            product: merchantData.product || {
                productType: "UPI",
                maxDaily: "500000",
                minPerTxn: "1",
                maxPerTxn: "100000",
                creditLimit: "15000000",
            },
            bank: merchantData.bank || {},
            vpa: merchantData.vpa || {},
            kycDocs: merchantData.kycDocs || {},
            businessEntityType: (merchantData.businessEntityType as BusinessEntityType) || null,
        });
        setMerchantId(merchantData._id as string);
        let step = 0;
        if (merchantData.businessEntityType) step = 1;
        if (merchantData.business && Object.keys(merchantData.business as Record<string, unknown>).length > 0) step = 2;
        if (merchantData.personal && Object.keys(merchantData.personal as Record<string, unknown>).length > 0) step = 3;
        if (merchantData.product && Object.keys(merchantData.product as Record<string, unknown>).length > 0) step = 4;
        if (merchantData.bank && Object.keys(merchantData.bank as Record<string, unknown>).length > 0) step = 5;
        if (merchantData.vpa && Object.keys(merchantData.vpa as Record<string, unknown>).length > 0) step = 6;
        if (merchantData.kycDocs && Object.keys(merchantData.kycDocs as Record<string, unknown>).length > 0) step = 0;
        setCurrentStep(step);
    };

    const value = useMemo<MerchantFormContextType>(
        () => ({
            data,
            update: (fn) => setData((prev) => {
                const next = { ...prev } as MerchantFormData;
                fn(next);
                return next;
            }),
            currentStep,
            setCurrentStep,
            totalSteps: 7,
            merchantId,
            setMerchantId,
            resetForm,
            loadMerchantData,
        }),
        [data, currentStep, merchantId]
    );

    return (
        <MerchantFormContext.Provider value={value}>
            {children}
        </MerchantFormContext.Provider>
    );
}

export function useMerchantForm() {
    const ctx = useContext(MerchantFormContext);
    if (!ctx) throw new Error("useMerchantForm must be used within MerchantFormProvider");
    return ctx;
}