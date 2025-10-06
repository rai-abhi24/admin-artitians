import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Enquiry from "@/models/Enquiry"
import { formatDistanceToNow } from "date-fns"
import { connectToDB } from "@/lib/db"

async function getRecentEnquiries() {
  await connectToDB()
  const enquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(5).lean()
  return enquiries.map((e: any) => ({
    ...e,
    _id: e._id.toString(),
    createdAt: e.createdAt.toISOString(),
  }))
}

export async function RecentEnquiries() {
  const enquiries = await getRecentEnquiries()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Enquiries</CardTitle>
          <CardDescription>Latest customer enquiries from your landing page</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/enquiries">
            View all
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {enquiries.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">No enquiries yet</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enquiries.map((enquiry: any) => (
                <TableRow key={enquiry._id}>
                  <TableCell className="font-medium py-5">{enquiry.name}</TableCell>
                  <TableCell>{enquiry.email}</TableCell>
                  <TableCell>{enquiry.phone}</TableCell>
                  <TableCell>
                    <Badge className="capitalize" variant={enquiry.status === "new" ? "default" : "secondary"}>{enquiry.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(enquiry.createdAt), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
