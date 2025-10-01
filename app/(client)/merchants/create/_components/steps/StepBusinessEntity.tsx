"use client";

import { useEffect } from "react";
import { useMerchantForm } from "../../../../../../contexts/merchant-context";

export function StepBusinessEntity() {
    const { data, update } = useMerchantForm();

    useEffect(() => {
        console.log("Rendering StepBusinessEntity");
    }, [data]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Business Entity Type</h2>
                <p className="text-muted-foreground text-sm mt-1.5">Choose the registered business entity to proceed.</p>
            </div>
            <fieldset className="grid grid-cols-1 gap-3">
                {[
                    { key: "sole_proprietary", label: "Sole Proprietary" },
                    { key: "partnership", label: "Partnership" },
                    { key: "public_limited", label: "Public Limited Company" },
                    { key: "private_limited", label: "Private Limited Company" },
                ].map((opt) => (
                    <label key={opt.key} className="flex items-center gap-2 rounded-md border p-3 cursor-pointer hover:bg-accent max-w-md">
                        <input
                            type="radio"
                            name="businessEntityType"
                            className="size-4"
                            checked={data.businessEntityType === (opt.key as any)}
                            onChange={() => update((d) => (d.businessEntityType = opt.key as any))}
                        />
                        <span className="text-sm">{opt.label}</span>
                    </label>
                ))}
            </fieldset>
        </div>
    );
}


