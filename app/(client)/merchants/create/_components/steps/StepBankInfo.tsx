"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMerchantForm } from "../../../../../../contexts/merchant-context";

export function StepBankInfo() {
    const { data, update } = useMerchantForm();
    const b = data.bank;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Bank Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="text-sm font-medium">Account Type <span className="text-red-500">*</span></label>
                    <Select value={b.accountType} onValueChange={(v) => update((d) => (d.bank.accountType = v))}>
                        <SelectTrigger className="w-full py-6 mt-1.5">
                            <SelectValue placeholder="Select Account Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="savings">Savings</SelectItem>
                            <SelectItem value="current">Current</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="text-sm font-medium">Beneficiary Name <span className="text-red-500">*</span></label>
                    <Input className="py-6 mt-1.5" value={b.beneficiaryName || ""} onChange={(e) => update((d) => (d.bank.beneficiaryName = e.target.value))} placeholder="Enter Beneficiary Name" />
                </div>
                <div>
                    <label className="text-sm font-medium">Bank Account Number <span className="text-red-500">*</span></label>
                    <Input inputMode="numeric" pattern="^[0-9]{9,18}$" maxLength={18} className="py-6 mt-1.5" value={b.accountNumber || ""} onChange={(e) => update((d) => (d.bank.accountNumber = e.target.value.replace(/\D/g, "")))} placeholder="Enter Account Number" aria-invalid={!!b.accountNumber && !/^[0-9]{9,18}$/.test(b.accountNumber)} />
                </div>
                <div>
                    <label className="text-sm font-medium">IFSC Code <span className="text-red-500">*</span></label>
                    <Input pattern="^[A-Z]{4}0[0-9A-Z]{6}$" maxLength={11} className="py-6 mt-1.5 uppercase" value={b.ifsc || ""} onChange={(e) => update((d) => (d.bank.ifsc = e.target.value.toUpperCase()))} placeholder="e.g., HDFC0001234" aria-invalid={!!b.ifsc && !/^[A-Z]{4}0[0-9A-Z]{6}$/.test(b.ifsc)} />
                </div>
                <div>
                    <label className="text-sm font-medium">Bank Name <span className="text-red-500">*</span></label>
                    <Input className="py-6 mt-1.5" value={b.bankName || ""} onChange={(e) => update((d) => (d.bank.bankName = e.target.value))} placeholder="Enter Bank Name" />
                </div>
                <div>
                    <label className="text-sm font-medium">Branch Name <span className="text-red-500">*</span></label>
                    <Input className="py-6 mt-1.5" value={b.branchName || ""} onChange={(e) => update((d) => (d.bank.branchName = e.target.value))} placeholder="Enter Branch Name" />
                </div>
                <div>
                    <label className="text-sm font-medium">Bank Pin Code <span className="text-red-500">*</span></label>
                    <Input inputMode="numeric" pattern="^[0-9]{6}$" maxLength={6} className="py-6 mt-1.5" value={b.bankPinCode || ""} onChange={(e) => update((d) => (d.bank.bankPinCode = e.target.value.replace(/\D/g, "")))} placeholder="Enter 6-digit PIN Code" aria-invalid={!!b.bankPinCode && !/^[0-9]{6}$/.test(b.bankPinCode)} />
                </div>
                <div>
                    <label className="text-sm font-medium">State <span className="text-red-500">*</span></label>
                    <Input className="py-6 mt-1.5" value={b.state || ""} onChange={(e) => update((d) => (d.bank.state = e.target.value))} placeholder="Enter State" />
                </div>
                <div>
                    <label className="text-sm font-medium">District <span className="text-red-500">*</span></label>
                    <Input className="py-6 mt-1.5" value={b.district || ""} onChange={(e) => update((d) => (d.bank.district = e.target.value))} placeholder="Enter District" />
                </div>
                <div>
                    <label className="text-sm font-medium">City <span className="text-red-500">*</span></label>
                    <Input className="py-6 mt-1.5" value={b.city || ""} onChange={(e) => update((d) => (d.bank.city = e.target.value))} placeholder="Enter City" />
                </div>
            </div>
        </div>
    );
}


