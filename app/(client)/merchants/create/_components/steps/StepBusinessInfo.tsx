"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMerchantForm } from "../../../../../../contexts/merchant-context";

export function StepBusinessInfo() {
    const { data, update } = useMerchantForm();
    const b = data.business;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="text-sm font-medium">Business Legal Name <span className="text-red-500">*</span></label>
                    <Input className="py-6 mt-1.5" value={b.legalName || ""} onChange={(e) => update((d) => (d.business.legalName = e.target.value))} placeholder="Enter Business Legal Name" />
                </div>
                <div>
                    <label className="text-sm font-medium">Brand Name <span className="text-red-500">*</span></label>
                    <Input className="py-6 mt-1.5" value={b.brandName || ""} onChange={(e) => update((d) => (d.business.brandName = e.target.value))} placeholder="Enter Brand Name" />
                </div>
                <div>
                    <label className="text-sm font-medium">Store Name <span className="text-red-500">*</span></label>
                    <Input className="py-6 mt-1.5" value={b.storeName || ""} onChange={(e) => update((d) => (d.business.storeName = e.target.value))} placeholder="Enter Store Name" />
                </div>
                <div>
                    <label className="text-sm font-medium">Registered Address <span className="text-red-500">*</span></label>
                    <Input className="py-6 mt-1.5" value={b.address || ""} onChange={(e) => update((d) => (d.business.address = e.target.value))} placeholder="Enter Registered Address" />
                </div>
                <div>
                    <label className="text-sm font-medium">PIN Code <span className="text-red-500">*</span></label>
                    <Input inputMode="numeric" pattern="^[0-9]{6}$" maxLength={6} className="py-6 mt-1.5" value={b.pinCode || ""} onChange={(e) => update((d) => (d.business.pinCode = e.target.value.replace(/\D/g, "")))} placeholder="Enter 6-digit PIN Code" aria-invalid={!!b.pinCode && !/^[0-9]{6}$/.test(b.pinCode)} />
                </div>
                <div>
                    <label className="text-sm font-medium">State <span className="text-red-500">*</span></label>
                    <Input className="py-6 mt-1.5" value={b.state || ""} onChange={(e) => update((d) => (d.business.state = e.target.value))} placeholder="Enter State" />
                </div>
                <div>
                    <label className="text-sm font-medium">District <span className="text-red-500">*</span></label>
                    <Input className="py-6 mt-1.5" value={b.district || ""} onChange={(e) => update((d) => (d.business.district = e.target.value))} placeholder="Enter District" />
                </div>
                <div>
                    <label className="text-sm font-medium">City <span className="text-red-500">*</span></label>
                    <Input className="py-6 mt-1.5" value={b.city || ""} onChange={(e) => update((d) => (d.business.city = e.target.value))} placeholder="Enter City" />
                </div>
                <div>
                    <label className="text-sm font-medium">Establishment Year <span className="text-red-500">*</span></label>
                    <Input inputMode="numeric" pattern="^(19|20)[0-9]{2}$" maxLength={4} className="py-6 mt-1.5" value={b.establishmentYear || ""} onChange={(e) => update((d) => (d.business.establishmentYear = e.target.value.replace(/\D/g, "")))} placeholder="YYYY" aria-invalid={!!b.establishmentYear && !/^(19|20)[0-9]{2}$/.test(b.establishmentYear)} />
                </div>
                <div>
                    <label className="text-sm font-medium">Business Registered Mobile Number <span className="text-red-500">*</span></label>
                    <Input inputMode="numeric" pattern="^[6-9][0-9]{9}$" maxLength={10} className="py-6 mt-1.5" value={b.registeredMobile || ""} onChange={(e) => update((d) => (d.business.registeredMobile = e.target.value.replace(/\D/g, "")))} placeholder="Enter 10-digit Mobile Number" aria-invalid={!!b.registeredMobile && !/^[6-9][0-9]{9}$/.test(b.registeredMobile)} />
                </div>
                <div>
                    <label className="text-sm font-medium">Business Registered Email <span className="text-red-500">*</span></label>
                    <Input type="email" className="py-6 mt-1.5" value={b.registeredEmail || ""} onChange={(e) => update((d) => (d.business.registeredEmail = e.target.value))} placeholder="name@example.com" />
                </div>
                <div>
                    <label className="text-sm font-medium">Business PAN <span className="text-red-500">*</span></label>
                    <Input pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$" maxLength={10} className="py-6 mt-1.5 uppercase" value={b.pan || ""} onChange={(e) => update((d) => (d.business.pan = e.target.value.toUpperCase()))} placeholder="DQOPR1234F" aria-invalid={!!b.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(b.pan)} />
                </div>
                <div>
                    <label className="text-sm font-medium">Business Registration Number(CIN) <span className="text-red-500">*</span></label>
                    <Input maxLength={21} className="py-6 mt-1.5 uppercase" value={b.registrationNumber || ""} onChange={(e) => update((d) => (d.business.registrationNumber = e.target.value.toUpperCase()))} placeholder="Enter CIN" />
                </div>
                <div>
                    <label className="text-sm font-medium">Turnover Financial Year <span className="text-red-500">*</span></label>
                    <Select value={b.turnoverFinancialYear || ""} onValueChange={(value) => update((d) => (d.business.turnoverFinancialYear = value))}>
                        <SelectTrigger className="mt-1.5 py-6 w-full">
                            <SelectValue placeholder="Select Turnover Financial Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 5 }, (_, i) => {
                                const start = new Date().getFullYear() - i;
                                const end = start + 1;
                                const label = `${start}-${end}`;
                                return (
                                    <SelectItem key={label} value={label}>{label}</SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="text-sm font-medium">Turnover Amount <span className="text-red-500">*</span></label>
                    <Input inputMode="numeric" pattern="^[0-9]+(\.[0-9]{1,2})?$" className="py-6 mt-1.5" value={b.turnoverAmount || ""} onChange={(e) => update((d) => (d.business.turnoverAmount = e.target.value.replace(/[^0-9.]/g, "")))} placeholder="Enter Turnover Amount" aria-invalid={!!b.turnoverAmount && !/^[0-9]+(\.[0-9]{1,2})?$/.test(b.turnoverAmount)} />
                </div>
                <div>
                    <label className="text-sm font-medium">Nature of Business <span className="text-red-500">*</span></label>
                    <Select value={b.natureOfBusiness || ""} onValueChange={(value) => update((d) => (d.business.natureOfBusiness = value))}>
                        <SelectTrigger className="mt-1.5 py-6 w-full">
                            <SelectValue placeholder="Select Nature of Business" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Lodging">Lodging</SelectItem>
                            <SelectItem value="Business Services">Business Services</SelectItem>
                            <SelectItem value="Agriculture Services">Agriculture Services</SelectItem>
                            <SelectItem value="Contracted Services">Contracted Services</SelectItem>
                            <SelectItem value="Airlines">Airlines</SelectItem>
                            <SelectItem value="Car Rental">Car Rental</SelectItem>
                            <SelectItem value="Transportation Services">Transportation Services</SelectItem>
                            <SelectItem value="Utility Services">Utility Services</SelectItem>
                            <SelectItem value="Retail Outlet Services">Retail Outlet Services</SelectItem>
                            <SelectItem value="Clothing Stores">Clothing Stores</SelectItem>
                            <SelectItem value="Miscellaneous Stores">Miscellaneous Stores</SelectItem>
                            <SelectItem value="Government Services">Government Services</SelectItem>
                            <SelectItem value="Professional Services and Membership Organizations">Professional Services and Membership Organizations</SelectItem>
                            <SelectItem value="all_category">All Category</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="text-sm font-medium">MCC <span className="text-red-500">*</span></label>
                    <Input inputMode="numeric" pattern="^[0-9]{4}$" maxLength={4} className="py-6 mt-1.5" value={b.mcc || ""} onChange={(e) => update((d) => (d.business.mcc = e.target.value.replace(/\D/g, "")))} placeholder="4-digit MCC" aria-invalid={!!b.mcc && !/^[0-9]{4}$/.test(b.mcc)} />
                </div>
                <div>
                    <label className="text-sm font-medium">GSTIN <span className="text-red-500">*</span></label>
                    <Input pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$" maxLength={15} className="py-6 mt-1.5 uppercase" value={b.gstin || ""} onChange={(e) => update((d) => (d.business.gstin = e.target.value.toUpperCase()))} placeholder="Enter GSTIN" aria-invalid={!!b.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(b.gstin)} />
                </div>
                <div className="md:col-span-2">
                    <label className="text-sm font-medium">Merchant Website URL <span className="text-red-500">*</span></label>
                    <Input type="url" className="py-6 mt-1.5" value={b.websiteUrl || ""} onChange={(e) => update((d) => (d.business.websiteUrl = e.target.value))} placeholder="https://example.com" />
                </div>
            </div>
        </div>
    );
}


