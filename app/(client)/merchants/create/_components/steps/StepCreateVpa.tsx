"use client";

import { Input } from "@/components/ui/input";
import { useMerchantForm } from "../../../../../../contexts/merchant-context";

export function StepCreateVpa() {
    const { data, update } = useMerchantForm();

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Create VPA</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="text-sm font-medium">VPA Handle <span className="text-red-500">*</span></label>
                    <Input
                        value={data.vpa.handle || ""}
                        onChange={(e) => update((d) => (d.vpa.handle = e.target.value))}
                        placeholder="username@nsdlpbma"
                        className="py-6 mt-1.5 max-w-md"
                    />
                </div>
            </div>
        </div>
    );
}


