import { Metadata } from "next";
import EnquiryList from "./_components/EnquiryList";
import { Header } from "@/components/header";

export const metadata: Metadata = {
    title: "Enquiries",
    description: "Manage enquiries.",
};

export default function EnquiryPage() {
    return (
        <div className="flex flex-col">
            <Header title="Enquiries" description="View and manage enquiries." />
            <div className="flex-1 space-y-6 p-6 h-full">
                <EnquiryList />
            </div>
        </div>
    );
}