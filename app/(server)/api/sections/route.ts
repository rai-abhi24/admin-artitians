import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Section from "@/models/Section";
import memoryCache, { CacheKeys } from "@/lib/cache";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!type) return NextResponse.json({ error: "type is required" }, { status: 400 });

    const cacheKey = CacheKeys.SECTION(type);

    const cachedSection = memoryCache.get(cacheKey);
    if (cachedSection) {
        console.log('✅ Cache HIT - Section');
        return NextResponse.json(
            {
                success: true,
                section: cachedSection,
                source: 'cache'
            },
            { status: 200 }
        );
    }

    console.log('❌ Cache MISS - Section - Fetching from DB');

    await connectToDB();
    let section = await Section.findOne({ type });
    if (!section) {
        section = await Section.create(
            type === "partner"
                ? { type, partners: [] }
                : { type, highlightedText: "", normalText: "", subtitle: "", backgroundImage: "", content: { galleryImages: [] } }
        );
    }

    if (section) {
        memoryCache.set(cacheKey, section, -1);
    }

    return NextResponse.json({
        success: true,
        section: section,
        source: 'db'
    });
}

// HERO create
export async function POST(req: Request) {
    await connectToDB();
    const body = await req.json();
    if (body.type !== "hero") {
        return NextResponse.json({ error: "POST supported only for hero in this route" }, { status: 400 });
    }
    // upsert single doc for hero
    const section = await Section.findOneAndUpdate(
        { type: "hero" },
        {
            $set: {
                highlightedText: body.highlightedText,
                normalText: body.normalText,
                subtitle: body.subtitle,
                backgroundImage: body.backgroundImage,
                content: { galleryImages: body.content?.galleryImages ?? [] },
            },
        },
        { new: true, upsert: true }
    );

    if (section) {
        memoryCache.set(CacheKeys.SECTION("hero"), section, -1);
    }

    return NextResponse.json({
        success: true,
        section: section,
    });
}

// HERO update
export async function PUT(req: Request) {
    await connectToDB();
    const body = await req.json();
    if (body.type !== "hero") {
        return NextResponse.json({ error: "PUT supported only for hero in this route" }, { status: 400 });
    }

    const updated = await Section.findOneAndUpdate(
        { type: "hero" },
        {
            $set: {
                highlightedText: body.highlightedText,
                normalText: body.normalText,
                subtitle: body.subtitle,
                backgroundImage: body.backgroundImage,
                content: { galleryImages: body.content?.galleryImages ?? [] },
            },
        },
        { new: true, upsert: true }
    );

    if (updated) {
        memoryCache.set(CacheKeys.SECTION("hero"), updated, -1);
    }

    return NextResponse.json({
        success: true,
        section: updated,
    });
}