import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import memoryCache, { CacheKeys } from "@/lib/cache";

export async function GET() {
    try {
        const cacheKey = CacheKeys.SITE_SETTINGS;

        const cachedSettings = memoryCache.get(cacheKey);
        if (cachedSettings) {
            console.log('✅ Cache HIT - Site Settings');
            return NextResponse.json(
                {
                    success: true,
                    settings: cachedSettings,
                    source: 'cache'
                },
                { status: 200 }
            );
        }

        console.log('❌ Cache MISS - Site Settings - Fetching from DB');

        // Cache miss - fetch from database
        await connectToDB();
        const settings = await SiteSettings.findOne().lean();

        if (settings) {
            memoryCache.set(cacheKey, settings, -1);
        }

        return NextResponse.json(
            {
                success: true,
                settings,
                source: 'db'
            },
            { status: 200 }
        );
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

        const whatsappNumberWithCountryCode = `+91${whatsappNumber}`;

        let settings = await SiteSettings.findOne();

        if (settings) {
            settings.email = email;
            settings.phoneNumber = phoneNumber;
            settings.whatsappNumber = whatsappNumberWithCountryCode;
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

        const cacheKey = CacheKeys.SITE_SETTINGS;
        memoryCache.delete(cacheKey);
        console.log('🗑️  Cache invalidated - Site Settings');

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
