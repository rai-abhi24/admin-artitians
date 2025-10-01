import mongoose, { Schema, model, models } from "mongoose";

const StringField = { type: String, required: false } as const;

const BusinessSchema = new Schema(
    {
        legalName: StringField,
        brandName: StringField,
        storeName: StringField,
        address: StringField,
        pinCode: StringField,
        state: StringField,
        district: StringField,
        city: StringField,
        establishmentYear: StringField,
        registeredMobile: StringField,
        registeredEmail: StringField,
        pan: StringField,
        registrationNumber: StringField,
        turnoverFinancialYear: StringField,
        turnoverAmount: StringField,
        natureOfBusiness: StringField,
        mcc: StringField,
        gstin: StringField,
        websiteUrl: StringField,
    },
    { _id: false }
);

const PersonalSchema = new Schema(
    {
        name: StringField,
        address: StringField,
        pinCode: StringField,
        state: StringField,
        district: StringField,
        city: StringField,
        mobile: StringField,
        email: StringField,
        pan: StringField,
        kycDocumentType: StringField,
        kycDocumentNumber: StringField,
        passportExpiryDate: StringField,
    },
    { _id: false }
);

const ProductSchema = new Schema(
    {
        productType: StringField,
        maxDaily: StringField,
        minPerTxn: StringField,
        maxPerTxn: StringField,
        creditLimit: StringField,
    },
    { _id: false }
);

const BankSchema = new Schema(
    {
        accountType: StringField,
        ifsc: StringField,
        bankName: StringField,
        branchName: StringField,
        bankPinCode: StringField,
        state: StringField,
        district: StringField,
        city: StringField,
        beneficiaryName: StringField,
        accountNumber: StringField,
    },
    { _id: false }
);

const VpaSchema = new Schema(
    {
        handle: StringField,
    },
    { _id: false }
);

const KycDocsSchema = new Schema(
    {
        businessPan: StringField,
        businessAddressProofType: StringField,
        businessAddressProof: StringField,
        signedMoa: StringField,
        signedAoa: StringField,
        registrationCertificate: StringField,
        gstRegistration: StringField,
        businessLicence: StringField,
        storeInsideImage: StringField,
        storeOutsideImage: StringField,
        boardResolution: StringField,
        nsdlDeclaration: StringField,
        nsdlMaDeclaration: StringField,
        itrFiled: StringField,
        itrFile: StringField,
        itrReason: StringField,
        individualPan: StringField,
        kycFront: StringField,
        kycBack: StringField,
        individualAddressProofType: StringField,
        individualAddressProof: StringField,
        individualPhoto: StringField,
        bankAccountProofType: StringField,
        bankAccountProof: StringField,
    },
    { _id: false }
);

const MerchantSchema = new Schema(
    {
        status: { type: String, enum: ["pending","processing","approved","rejected","onboarded"], default: "pending", index: true },
        businessEntityType: StringField,
        business: BusinessSchema,
        personal: PersonalSchema,
        product: ProductSchema,
        bank: BankSchema,
        vpa: VpaSchema,
        kycDocs: KycDocsSchema,
    },
    { timestamps: true }
);

export type MerchantDocument = mongoose.InferSchemaType<typeof MerchantSchema> & mongoose.Document;

export const Merchant = models.Merchant || model("Merchant", MerchantSchema);