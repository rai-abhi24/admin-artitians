"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMerchantForm } from "../../../../../../contexts/merchant-context";

export function StepProductInfo() {
    const { data, update } = useMerchantForm();
    const p = data.product;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Product Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="text-sm font-medium">Product Type</label>
                    <Select
                        value={"UPI"}
                        onValueChange={(v) =>
                            update((d) => ({
                                ...d,
                                product: {
                                    ...d.product,
                                    productType: v as any,
                                },
                            }))
                        }
                    >
                        <SelectTrigger className="w-full p-[20px]">
                            <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="UPI">UPI</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-base font-medium">Product Limit</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="text-sm font-medium">Daily</label>
                        <Input className="py-6 mt-1.5" value={p.maxDaily || ""} onChange={(e) => update((d) => (d.product.maxDaily = e.target.value))} placeholder="500000" disabled />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Minimum</label>
                        <Input className="py-6 mt-1.5" value={p.minPerTxn || ""} onChange={(e) => update((d) => (d.product.minPerTxn = e.target.value))} placeholder="1" disabled />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Maximum</label>
                        <Input className="py-6 mt-1.5" value={p.maxPerTxn || ""} onChange={(e) => update((d) => (d.product.maxPerTxn = e.target.value))} placeholder="100000" disabled />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Credit Limit Amount</label>
                        <Input className="py-6 mt-1.5" value={p.creditLimit || ""} onChange={(e) => update((d) => (d.product.creditLimit = e.target.value))} placeholder="1500000" disabled />
                    </div>
                </div>
            </div>
        </div>
    );
}