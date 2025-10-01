import { Metadata } from "next";
import EnquiryList from "./_components/EnquiryList";

export const metadata: Metadata = {
    title: "Enquiries",
    description: "Manage enquiries.",
};

export default function EnquiryPage() {
    return (
        <EnquiryList />
    );
}