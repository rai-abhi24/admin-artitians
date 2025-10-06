import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Enquiry from "@/models/Enquiry";
import Section from "@/models/Section";
import AdminUser from "@/models/AdminUser";

export async function GET() {
    try {
        await connectToDB();

        const [totalEnquiries, newEnquiries, totalSections, totalUsers, recent] = await Promise.all([
            Enquiry.countDocuments(),
            Enquiry.countDocuments({ status: "new" }),
            Section.countDocuments({ isActive: true }),
            AdminUser.countDocuments(),
            Enquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
        ]);

        const enquiries = recent.map((e: any) => ({
            _id: e._id.toString(),
            name: e.name,
            email: e.email,
            phone: e.phone,
            status: e.status,
            createdAt: e.createdAt.toISOString(),
        }));

        return NextResponse.json({
            stats: { totalEnquiries, newEnquiries, totalSections, totalUsers },
            recentEnquiries: enquiries,
        });
    } catch (err) {
        console.error("GET /api/dashboard error:", err);
        return NextResponse.json({ message: "Failed to fetch dashboard data" }, { status: 500 });
    }
}