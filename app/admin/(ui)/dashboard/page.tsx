import { StatsCards } from "@/components/stats-cards"
import { RecentEnquiries } from "@/components/recent-enquiries"
import { Header } from "@/components/header"

export default function AdminDashboard() {
  return (
    <div className="flex flex-col">
      <Header title="Dashboard" description="Overview of your admin panel" />
      <div className="flex-1 space-y-6 p-6">
        <StatsCards />
        <RecentEnquiries />
      </div>
    </div>
  )
}