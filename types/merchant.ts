export type MerchantStatus = "pending" | "processing" | "approved" | "rejected" | "onboarded";

export type BusinessEntityType =
    | "sole_proprietary"
    | "partnership"
    | "public_limited"
    | "private_limited";

export type ProductType = "UPI";

export type MerchantFormData = {
    // Step 1: Business Entity Type
    businessEntityType?: BusinessEntityType | null;
    // Step 2: Business Information
    business: {
        legalName?: string;
        brandName?: string;
        storeName?: string;
        address?: string;
        pinCode?: string;
        state?: string;
        district?: string;
        city?: string;
        establishmentYear?: string;
        registeredMobile?: string;
        registeredEmail?: string;
        pan?: string;
        registrationNumber?: string;
        turnoverFinancialYear?: string;
        turnoverAmount?: string;
        natureOfBusiness?: string;
        mcc?: string;
        gstin?: string;
        websiteUrl?: string;
    };
    // Step 3: Personal Information
    personal: {
        name?: string;
        address?: string;
        pinCode?: string;
        state?: string;
        district?: string;
        city?: string;
        mobile?: string;
        email?: string;
        pan?: string;
        kycDocumentType?: string;
        kycDocumentNumber?: string;
        passportExpiryDate?: string;
    };
    // Step 4: Product Information
    product: {
        productType?: ProductType;
        maxDaily?: string;
        minPerTxn?: string;
        maxPerTxn?: string;
        creditLimit?: string;
    };
    // Step 5: Bank Information
    bank: {
        accountType?: string;
        ifsc?: string;
        bankName?: string;
        branchName?: string;
        bankPinCode?: string;
        state?: string;
        district?: string;
        city?: string;
        beneficiaryName?: string;
        accountNumber?: string;
    };
    // Step 6: Create VPA
    vpa: {
        handle?: string;
    };
    // Step 7: KYC Documents
    kycDocs: {
        // Business Documents
        businessPan?: string | null;
        businessAddressProofType?: string;
        businessAddressProof?: string | null;
        signedMoa?: string | null;
        signedAoa?: string | null;
        registrationCertificate?: string | null;
        gstRegistration?: string | null;
        businessLicence?: string | null;
        storeInsideImage?: string | null;
        storeOutsideImage?: string | null;
        boardResolution?: string | null;
        nsdlDeclaration?: string | null;
        nsdlMaDeclaration?: string | null;
        itrFiled?: "YES" | "NO";
        itrFile?: string | null;
        itrReason?: string;
        // Person 1 Documents
        individualPan?: string | null;
        kycFront?: string | null;
        kycBack?: string | null;
        individualAddressProofType?: string;
        individualAddressProof?: string | null;
        individualPhoto?: string | null;
        // Bank Documents
        bankAccountProofType?: string;
        bankAccountProof?: string | null;
    };
};
