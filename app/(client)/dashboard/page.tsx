import { Metadata } from "next";
import Dashboard from "./_components/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default function DashboardPage() {
  return (
    <Dashboard />
  );
}