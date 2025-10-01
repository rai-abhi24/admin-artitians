"use client";

import { Input } from "@/components/ui/input";
import { useMerchantForm } from "../../../../../../contexts/merchant-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

export function StepPersonalInfo() {
    const { data, update } = useMerchantForm();
    const p = data.personal;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="text-sm font-medium">Name(As per Aadhaar) <span className="text-red-500">*</span></label>
                    <Input name="name" className="py-6 mt-1.5" value={p.name || ""} onChange={(e) => update((d) => (d.personal.name = e.target.value))} placeholder="Enter Name" />
                </div>
                <div>
                    <label className="text-sm font-medium">Address <span className="text-red-500">*</span></label>
                    <Input name="address" className="py-6 mt-1.5" value={p.address || ""} onChange={(e) => update((d) => (d.personal.address = e.target.value))} placeholder="Enter Address" />
                </div>
                <div>
                    <label className="text-sm font-medium">PIN Code <span className="text-red-500">*</span></label>
                    <Input name="pinCode" inputMode="numeric" pattern="^[0-9]{6}$" maxLength={6} className="py-6 mt-1.5" value={p.pinCode || ""} onChange={(e) => update((d) => (d.personal.pinCode = e.target.value.replace(/\D/g, "")))} placeholder="Enter 6-digit PIN Code" aria-invalid={!!p.pinCode && !/^[0-9]{6}$/.test(p.pinCode)} />
                </div>
                <div>
                    <label className="text-sm font-medium">State <span className="text-red-500">*</span></label>
                    <Input name="state" className="py-6 mt-1.5" value={p.state || ""} onChange={(e) => update((d) => (d.personal.state = e.target.value))} placeholder="Enter State" />
                </div>
                <div>
                    <label className="text-sm font-medium">District <span className="text-red-500">*</span></label>
                    <Input name="district" className="py-6 mt-1.5" value={p.district || ""} onChange={(e) => update((d) => (d.personal.district = e.target.value))} placeholder="Enter District" />
                </div>
                <div>
                    <label className="text-sm font-medium">City <span className="text-red-500">*</span></label>
                    <Input name="city" className="py-6 mt-1.5" value={p.city || ""} onChange={(e) => update((d) => (d.personal.city = e.target.value))} placeholder="Enter City" />
                </div>
                <div>
                    <label className="text-sm font-medium">Mobile Number <span className="text-red-500">*</span></label>
                    <Input name="mobile" inputMode="numeric" pattern="^[6-9][0-9]{9}$" maxLength={10} className="py-6 mt-1.5" value={p.mobile || ""} onChange={(e) => update((d) => (d.personal.mobile = e.target.value.replace(/\D/g, "")))} placeholder="Enter 10-digit Mobile Number" aria-invalid={!!p.mobile && !/^[6-9][0-9]{9}$/.test(p.mobile)} />
                </div>
                <div>
                    <label className="text-sm font-medium">Email Id <span className="text-red-500">*</span></label>
                    <Input name="email" type="email" className="py-6 mt-1.5" value={p.email || ""} onChange={(e) => update((d) => (d.personal.email = e.target.value))} placeholder="name@example.com" />
                </div>
                <div>
                    <label className="text-sm font-medium">PAN <span className="text-red-500">*</span></label>
                    <Input name="pan" pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$" maxLength={10} className="py-6 mt-1.5 uppercase" value={p.pan || ""} onChange={(e) => update((d) => (d.personal.pan = e.target.value.toUpperCase()))} placeholder="ABCDE1234F" aria-invalid={!!p.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(p.pan)} />
                </div>
                <div>
                    <label className="text-sm font-medium">KYC document Type <span className="text-red-500">*</span></label>
                    <Select value={p.kycDocumentType || ""} onValueChange={(value) => update((d) => (d.personal.kycDocumentType = value))}>
                        <SelectTrigger className="mt-1.5 py-6 w-full">
                            <SelectValue placeholder="KYC document Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="passport">Passport</SelectItem>
                            <SelectItem value="driving_license">Driving License</SelectItem>
                            <SelectItem value="aadhar">Aadhar Card</SelectItem>
                            <SelectItem value="voter_id">Voter ID</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="text-sm font-medium">KYC document Number <span className="text-red-500">*</span></label>
                    <Input name="kycDocumentNumber" className="py-6 mt-1.5" value={p.kycDocumentNumber || ""} onChange={(e) => update((d) => (d.personal.kycDocumentNumber = e.target.value))} placeholder="Enter Document Number" />
                </div>
                <div>
                    <label className="text-sm font-medium">Passport Expiry Date {data.personal.kycDocumentType === 'passport' ? <span className="text-red-500">*</span> : ''}</label>
                    <div className="mt-1.5">
                        <DatePicker onValueChange={(value: string) => update((d) => (d.personal.passportExpiryDate = value))} />
                    </div>
                </div>
            </div>
        </div>
    );
}


