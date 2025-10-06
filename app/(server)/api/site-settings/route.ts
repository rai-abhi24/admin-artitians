import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

export async function GET() {
    try {
        await connectToDB();

        const settings = await SiteSettings.findOne();

        return NextResponse.json({ success: true, settings }, { status: 200 });
    } catch (err: any) {
        console.error("GET /api/site-settings error:", err);
        return NextResponse.json(
            { success: false, message: "Failed to fetch site settings" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const body = await req.json();
        const {
            email,
            phoneNumber,
            whatsappNumber,
            facebook,
            instagram,
            linkedin,
            youtube,
            maintenance,
        } = body;

        if (!phoneNumber || !whatsappNumber) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        let settings = await SiteSettings.findOne();

        if (settings) {
            settings.email = email;
            settings.phoneNumber = phoneNumber;
            settings.whatsappNumber = whatsappNumber;
            settings.facebook = facebook;
            settings.instagram = instagram;
            settings.linkedin = linkedin;
            settings.youtube = youtube;
            settings.maintenance = maintenance;

            await settings.save();
        } else {
            settings = await SiteSettings.create({
                email,
                phoneNumber,
                whatsappNumber,
                facebook,
                instagram,
                linkedin,
                youtube,
                maintenance,
            });
        }

        return NextResponse.json(
            { success: true, message: "Settings saved successfully", settings },
            { status: 200 }
        );
    } catch (err: any) {
        console.error("POST /api/site-settings error:", err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal server error" },
            { status: 500 }
        );
    }
}