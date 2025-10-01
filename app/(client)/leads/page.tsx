import { Metadata } from "next";
import Leads from "./_components/Leads";

export const metadata: Metadata = {
    title: "Leads",
    description: "Manage and track your merchant leads efficiently.",
};

export default function LeadsPage() {
    return (
        <Leads />
    );
}
