"use client";

import { Button } from "@/components/ui/button";
import { useMerchantForm } from "../../../../../contexts/merchant-context";
import { StepsHeader } from "./StepsHeader";
import { StepBusinessEntity } from "./steps/StepBusinessEntity";
import { StepBusinessInfo } from "./steps/StepBusinessInfo";
import { StepPersonalInfo } from "./steps/StepPersonalInfo";
import { StepProductInfo } from "./steps/StepProductInfo";
import { StepBankInfo } from "./steps/StepBankInfo";
import { StepCreateVpa } from "./steps/StepCreateVpa";
import { StepKycDocuments } from "./steps/StepKycDocuments";
import { createMerchant, updateMerchant } from "@/lib/services/merchant";
import { useToast } from "@/hooks/use-toast";

const steps = [
    { title: "Business Entity Type", component: StepBusinessEntity },
    { title: "Business Information", component: StepBusinessInfo },
    { title: "Personal Information", component: StepPersonalInfo },
    { title: "Product Information", component: StepProductInfo },
    { title: "Bank Information", component: StepBankInfo },
    { title: "Create VPA", component: StepCreateVpa },
    { title: "KYC Documents", component: StepKycDocuments },
];

export function Stepper() {
    const { data, currentStep, setCurrentStep, totalSteps, merchantId, setMerchantId, resetForm } = useMerchantForm();
    const { toast } = useToast();
    const StepComp = steps[currentStep].component;

    const isFirst = currentStep === 0;
    const isLast = currentStep === totalSteps - 1;

    function isNonEmpty(value: any) {
        return value !== undefined && value !== null && String(value).trim() !== "";
    }

    function validateStep(stepIndex: number): { valid: boolean; message?: string } {
        const d = data as any;
        switch (stepIndex) {
            case 0: {
                if (!isNonEmpty(d.businessEntityType)) return { valid: false, message: "Select business entity type" };
                return { valid: true };
            }
            case 1: {
                const b = d.business || {};
                const required = [
                    "legalName", "brandName", "storeName", "address", "pinCode", "state", "district", "city", "establishmentYear",
                    "registeredMobile", "registeredEmail", "pan", "registrationNumber", "turnoverFinancialYear", "turnoverAmount",
                    "natureOfBusiness", "mcc", "gstin", "websiteUrl",
                ];
                const missing = required.find((k) => !isNonEmpty(b[k]));
                return missing ? { valid: false, message: `Fill all Business Information fields` } : { valid: true };
            }
            case 2: {
                const p = d.personal || {};
                const required = [
                    "name", "address", "pinCode", "state", "district", "city", "mobile", "email", "pan", "kycDocumentType", "kycDocumentNumber",
                ];

                if (p.kycDocumentType === "passport") required.push("passportExpiryDate");

                const missing = required.find((k) => !isNonEmpty(p[k]));
                return missing ? { valid: false, message: `Fill all Personal Information fields` } : { valid: true };
            }
            case 3: {
                const p = d.product || {};
                const required = ["productType", "maxDaily", "minPerTxn", "maxPerTxn", "creditLimit"];
                const missing = required.find((k) => !isNonEmpty(p[k]));
                return missing ? { valid: false, message: `Fill all Product Information fields` } : { valid: true };
            }
            case 4: {
                const b = d.bank || {};
                const required = ["accountType", "beneficiaryName", "accountNumber", "ifsc", "bankName", "branchName", "bankPinCode", "state", "district", "city"];
                const missing = required.find((k) => !isNonEmpty(b[k]));
                return missing ? { valid: false, message: `Fill all Bank Information fields` } : { valid: true };
            }
            case 5: {
                const v = d.vpa || {};
                if (!isNonEmpty(v.handle)) return { valid: false, message: "Enter VPA handle" };
                return { valid: true };
            }
            case 6: {
                const k = d.kycDocs || {};
                const requiredUrls = [
                    "businessPan", "businessAddressProofType", "businessAddressProof", "signedMoa", "signedAoa", "registrationCertificate", "gstRegistration", "businessLicence",
                    "storeInsideImage", "storeOutsideImage", "boardResolution", "nsdlDeclaration", "nsdlMaDeclaration",
                    "individualPan", "kycFront", "kycBack", "individualAddressProofType", "individualAddressProof", "individualPhoto",
                    "bankAccountProofType", "bankAccountProof",
                ];
                for (const key of requiredUrls) {
                    if (!isNonEmpty(k[key])) return { valid: false, message: "Upload all required KYC documents" };
                }
                if (!isNonEmpty(k.itrFiled)) return { valid: false, message: "Select ITR filed status" };
                if (k.itrFiled === "YES" && !isNonEmpty(k.itrFile)) return { valid: false, message: "Upload ITR file" };
                if (k.itrFiled === "NO" && !isNonEmpty(k.itrReason)) return { valid: false, message: "Provide ITR reason" };
                return { valid: true };
            }
            default:
                return { valid: true };
        }
    }

    function validateAll(): { valid: boolean; message?: string } {
        for (let i = 0; i < totalSteps; i++) {
            const res = validateStep(i);
            if (!res.valid) return res;
        }
        return { valid: true };
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <StepsHeader steps={steps.map((s) => s.title)} current={currentStep} />
            <div className="rounded-lg border p-6 bg-card">
                <StepComp />
                <div className="mt-8 flex items-center justify-between">
                    <Button className="py-6 cursor-pointer" variant="outline" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={isFirst}>
                        Back
                    </Button>
                    <Button
                        className="py-6 cursor-pointer"
                        onClick={async () => {
                            if (!isLast) {
                                const res = validateStep(currentStep);
                                console.log("res", res);

                                if (!res.valid) {
                                    toast({ title: "Incomplete step", description: res.message, variant: "destructive" as any });
                                    return;
                                }
                                // Create merchant immediately after first step (Business Entity Type) - only for new merchants
                                if (currentStep === 0 && !merchantId) {
                                    try {
                                        const res = await createMerchant({
                                            status: "pending",
                                            businessEntityType: data.businessEntityType
                                        });
                                        setMerchantId?.((res as any).id);
                                        toast({ title: "Merchant created", description: "Merchant has been created and will appear in the list" });
                                    } catch (e) {
                                        toast({ title: "Failed to create merchant", description: (e as any)?.message || "", variant: "destructive" as any });
                                        return;
                                    }
                                } else if (merchantId) {
                                    // Update merchant with current step data
                                    try {
                                        const updateData: any = {};
                                        if (currentStep === 1) updateData.business = data.business;
                                        else if (currentStep === 2) updateData.personal = data.personal;
                                        else if (currentStep === 3) updateData.product = data.product;
                                        else if (currentStep === 4) updateData.bank = data.bank;
                                        else if (currentStep === 5) updateData.vpa = data.vpa;
                                        else if (currentStep === 6) updateData.kycDocs = data.kycDocs;

                                        await updateMerchant(merchantId, updateData);
                                    } catch (e) {
                                        toast({ title: "Failed to update merchant", description: (e as any)?.message || "", variant: "destructive" as any });
                                        return;
                                    }
                                }
                                setCurrentStep(Math.min(totalSteps - 1, currentStep + 1));
                                return;
                            }
                            const res = validateStep(currentStep);
                            if (!res.valid) {
                                toast({ title: "Incomplete form", description: res.message, variant: "destructive" as any });
                                return;
                            }

                            if (merchantId) {
                                await updateMerchant(merchantId, data as any);
                                toast({ title: "Merchant completed", description: "All merchant details have been saved successfully" });
                                window.location.href = "/merchants";
                            }
                        }}
                    >
                        {isLast ? "Submit" : "Save & Proceed"}
                    </Button>
                </div>
            </div>
        </div>
    );
}


