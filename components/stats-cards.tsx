import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Layers, Users, TrendingUp } from "lucide-react"
import { connectToDB } from "@/lib/db"
import Enquiry from "@/models/Enquiry"
import Section from "@/models/Section"
import AdminUser from "@/models/AdminUser"

async function getStats() {
  await connectToDB()

  const [totalEnquiries, newEnquiries, totalSections, totalUsers] = await Promise.all([
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: "new" }),
    Section.countDocuments({ isActive: true }),
    AdminUser.countDocuments(),
  ]);

  return {
    totalEnquiries,
    newEnquiries,
    totalSections,
    totalUsers,
  }
}

export async function StatsCards() {
  const stats = await getStats()

  const cards = [
    {
      title: "Total Enquiries",
      value: stats.totalEnquiries,
      description: `${stats.newEnquiries} new enquiries`,
      icon: Mail,
      trend: "+12% from last month",
    },
    {
      title: "Active Sections",
      value: stats.totalSections,
      description: "Content sections live",
      icon: Layers,
      trend: "All systems operational",
    },
    {
      title: "Admin Users",
      value: stats.totalUsers,
      description: "Active administrators",
      icon: Users,
      trend: "Secure access",
    },
  ]

  return (
    <div className="flex gap-6">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="hover-elevate p-0 m-0 cursor-pointer hover:scale-105 transition-all ease-linear flex-1"
        >
          <div className="flex items-stretch justify-between p-4">
            <div className="flex-1 pr-4">
              <CardHeader className="p-0 pb-3">
                <CardTitle className="text-sm font-medium capitalize">{card.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-3xl lg:text-4xl font-bold mb-1">
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </div>
            <div className="flex items-center">
              <card.icon className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
