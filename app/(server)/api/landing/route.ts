import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import Section from "@/models/Section";

let cachedData: any = null;
let lastFetched = 0;
const CACHE_TTL = 1000 * 60 * 5;

export async function GET() {
    try {
        const now = Date.now();
        if (cachedData && now - lastFetched < CACHE_TTL) {
            return NextResponse.json(
                { success: true, data: cachedData },
                {
                    status: 200,
                    headers: {
                        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
                    },
                }
            );
        }

        await connectToDB();
        const [settings, heroSection, modules, testimonials, partners]: any =
            await Promise.all([
                SiteSettings.findOne().lean(),
                Section.findOne({ type: "hero" }).lean(),
                Section.findOne({ type: "module" }).lean(),
                Section.findOne({ type: "testimonial" }).lean(),
                Section.findOne({ type: "partner" }).lean(),
            ]);

        const response = {
            hero: {
                highlightedText: heroSection?.highlightedText || "",
                normalText: heroSection?.normalText || "",
                subtitle: heroSection?.subtitle || "",
                backgroundImage: heroSection?.backgroundImage || "",
                content: heroSection?.content?.galleryImages || [],
            },
            testimonials: testimonials?.testimonials || [],
            partners: partners?.partners || [],
            modules: modules?.modules || [],
            settings: {
                email: settings?.email || "",
                phoneNumber: settings?.phoneNumber || "",
                whatsappNumber: settings?.whatsappNumber || "",
                facebook: settings?.facebook || "",
                instagram: settings?.instagram || "",
                linkedin: settings?.linkedin || "",
                youtube: settings?.youtube || "",
                maintenance: settings?.maintenance || false,
            },
        };

        // ✅ Save to cache
        cachedData = response;
        lastFetched = now;

        return NextResponse.json(
            { success: true, data: response },
            {
                status: 200,
                headers: {
                    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
                },
            }
        );
    } catch (err: any) {
        console.error("GET /api/site-settings error:", err);
        return NextResponse.json(
            { success: false, message: "Failed to fetch site settings" },
            { status: 500 }
        );
    }
}