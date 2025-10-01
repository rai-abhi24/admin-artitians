import { Metadata } from "next";
import BusinessTypesList from "./_components/BusinessTypesList";

export const metadata: Metadata = {
    title: "Business Types",
    description: "Manage business types.",
};

export default function BusinessTypesPage() {
    return (
        <BusinessTypesList />
    );
}