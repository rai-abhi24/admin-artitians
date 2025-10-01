"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMerchantForm } from "../../../../../../contexts/merchant-context";
import UploadFile from "@/components/UploadFile";

function SectionTitle({ title }: { title: string }) {
    return (
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{title}</h3>
            <Separator className="ml-4 flex-1" />
        </div>
    );
}

function Field({ label, children, required = true }: { label: string; children: React.ReactNode; required?: boolean }) {
    return (
        <div>
            <label className="text-sm font-medium">{label}  {required && <span className="text-red-500">*</span>}</label>
            {children}
        </div>
    );
}

export function StepKycDocuments() {
    const { data, update } = useMerchantForm();
    const k = data.kycDocs;

    // Client upload is handled inside UploadFile; state stores S3 URL strings

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold">KYC Documents</h2>

            <Card>
                <CardContent className="space-y-5">
                    <SectionTitle title="Upload Business Documents" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Field label="Business PAN">
                            <UploadFile file={k.businessPan || null} onFileChange={(f) => update((d) => (d.kycDocs.businessPan = f))} />
                        </Field>
                        <Field label="Business Address Proof Type">
                            <Select value={k.businessAddressProofType || ""} onValueChange={(v) => update((d) => (d.kycDocs.businessAddressProofType = v))}>
                                <SelectTrigger className="w-full py-[22px] mt-1.5">
                                    <SelectValue placeholder="Select Address Proof Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="rental_agreement">Rental Agreement</SelectItem>
                                    <SelectItem value="electricity_bill">Electricity Bill</SelectItem>
                                    <SelectItem value="telephone_bill">Telephone Bill</SelectItem>
                                    <SelectItem value="gas_bill">Gas Bill</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Business Address Proof">
                            <UploadFile file={k.businessAddressProof || null} onFileChange={(f) => update((d) => (d.kycDocs.businessAddressProof = f))} />
                        </Field>
                        <Field label="Signed Attached Copy of MOA">
                            <UploadFile file={k.signedMoa || null} onFileChange={(f) => update((d) => (d.kycDocs.signedMoa = f))} />
                        </Field>
                        <Field label="Signed Attached Copy of AOA">
                            <UploadFile file={k.signedAoa || null} onFileChange={(f) => update((d) => (d.kycDocs.signedAoa = f))} />
                        </Field>
                        <Field label="Registration Certificate">
                            <UploadFile file={k.registrationCertificate || null} onFileChange={(f) => update((d) => (d.kycDocs.registrationCertificate = f))} />
                        </Field>
                        <Field label="GST Registration Document">
                            <UploadFile file={k.gstRegistration || null} onFileChange={(f) => update((d) => (d.kycDocs.gstRegistration = f))} />
                        </Field>
                        <Field label="Business Licence Document">
                            <UploadFile file={k.businessLicence || null} onFileChange={(f) => update((d) => (d.kycDocs.businessLicence = f))} />
                        </Field>
                        <Field label="Store Inside Image">
                            <UploadFile file={k.storeInsideImage || null} onFileChange={(f) => update((d) => (d.kycDocs.storeInsideImage = f))} />
                        </Field>
                        <Field label="Store Outside Image">
                            <UploadFile file={k.storeOutsideImage || null} onFileChange={(f) => update((d) => (d.kycDocs.storeOutsideImage = f))} />
                        </Field>
                        <Field label="Board Resolution">
                            <UploadFile file={k.boardResolution || null} onFileChange={(f) => update((d) => (d.kycDocs.boardResolution = f))} />
                        </Field>
                        <Field label="NSDL Declaration">
                            <UploadFile file={k.nsdlDeclaration || null} onFileChange={(f) => update((d) => (d.kycDocs.nsdlDeclaration = f))} />
                        </Field>
                        <Field label="NSDL MA Declaration">
                            <UploadFile file={k.nsdlMaDeclaration || null} onFileChange={(f) => update((d) => (d.kycDocs.nsdlMaDeclaration = f))} />
                        </Field>
                        <Field label="Have you filed your Income Tax Return (ITR)?">
                            <Select value={k.itrFiled || ""} onValueChange={(v) => update((d) => (d.kycDocs.itrFiled = v as "YES" | "NO"))}>
                                <SelectTrigger className="w-full py-[22px] mt-1.5">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="YES">YES</SelectItem>
                                    <SelectItem value="NO">NO</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        {k.itrFiled === "YES" && (
                            <Field label="Upload ITR">
                                <UploadFile file={k.itrFile || null} onFileChange={(f) => update((d) => (d.kycDocs.itrFile = f))} />
                            </Field>
                        )}
                        {k.itrFiled === "NO" && (
                            <div>
                                <Field label="Reason for Not Filing ITR">
                                    <Input
                                        className="py-6 mt-1.5"
                                        value={k.itrReason || ""}
                                        onChange={(e) => update((d) => {
                                            d.kycDocs.itrReason = e.target.value
                                        })}
                                        placeholder="Enter reason"
                                    />
                                </Field>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="space-y-5">
                    <SectionTitle title="Personal Documents" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Field label="Individual PAN Card">
                            <UploadFile file={k.individualPan || null} onFileChange={(f) => update((d) => (d.kycDocs.individualPan = f))} />
                        </Field>
                        <Field label="KYC Document Front Page">
                            <UploadFile file={k.kycFront || null} onFileChange={(f) => update((d) => (d.kycDocs.kycFront = f))} />
                        </Field>
                        <Field label="KYC Document Back Page">
                            <UploadFile file={k.kycBack || null} onFileChange={(f) => update((d) => (d.kycDocs.kycBack = f))} />
                        </Field>
                        <Field label="Individual Address Proof Type">
                            <Select value={k.individualAddressProofType || ""} onValueChange={(v) => update((d) => (d.kycDocs.individualAddressProofType = v))}>
                                <SelectTrigger className="w-full py-[22px] mt-1.5">
                                    <SelectValue placeholder="Select Address Proof Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="aadhaar">Aadhaar</SelectItem>
                                    <SelectItem value="passport">Passport</SelectItem>
                                    <SelectItem value="electricity_bill">Electricity Bill</SelectItem>
                                    <SelectItem value="telephone_bill">Telephone Bill</SelectItem>
                                    <SelectItem value="gas_bill">Gas Bill</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Individual Address Proof">
                            <UploadFile file={k.individualAddressProof || null} onFileChange={(f) => update((d) => (d.kycDocs.individualAddressProof = f))} />
                        </Field>
                        <Field label="Individual Photo">
                            <UploadFile file={k.individualPhoto || null} onFileChange={(f) => update((d) => (d.kycDocs.individualPhoto = f))} />
                        </Field>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="space-y-5">
                    <SectionTitle title="Bank Documents" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Field label="Bank Account Proof Type">
                            <Select value={k.bankAccountProofType || ""} onValueChange={(v) => update((d) => (d.kycDocs.bankAccountProofType = v))}>
                                <SelectTrigger className="w-full py-[22px] mt-1.5">
                                    <SelectValue placeholder="Select Bank Account Proof Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cancelled_cheque">Cancelled Cheque</SelectItem>
                                    <SelectItem value="bank_statement">Bank Statement</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <div className="md:col-span-2">
                            <Field label="Bank Account Proof">
                                <UploadFile file={k.bankAccountProof || null} onFileChange={(f) => update((d) => (d.kycDocs.bankAccountProof = f))} />
                            </Field>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


