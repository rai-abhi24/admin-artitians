"use client";

import { MerchantFormProvider } from "../../../../contexts/merchant-context";
import { Stepper } from "./_components/Stepper";

export default function CreateMerchantPage() {
    return (
        <MerchantFormProvider>
            <Stepper />
        </MerchantFormProvider>
    );
}