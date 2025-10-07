import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Section from "@/models/Section";
import memoryCache, { CacheKeys } from "@/lib/cache";

async function ensurePartnerSection() {
    await connectToDB();
    let section = await Section.findOne({ type: "partner" });
    if (!section) section = await Section.create({ type: "partner", partners: [] });
    return section;
}

export async function POST(req: Request) {
    const body = await req.json();
    const section = await ensurePartnerSection();

    console.log(body);
    const nextOrder = (section.partners?.length || 0) + 1;

    section.partners?.push({
        title: body.title,
        logoUrl: body.logoUrl,
        isActive: body.isActive ?? true,
        order: body.order ?? nextOrder,
    } as any);

    await section.save();

    const cacheKey = CacheKeys.SECTION("partner");
    memoryCache.delete(cacheKey);
    console.log('🗑️  Cache invalidated - Partner Section');

    return NextResponse.json({ section }, { status: 201 });
}

export async function PUT(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id (partnerId) is required" }, { status: 400 });

    const body = await req.json();
    const section = await ensurePartnerSection();

    const item = section.partners?.id(id);
    if (!item) return NextResponse.json({ error: "Partner item not found" }, { status: 404 });

    if (typeof body.title === "string") item.title = body.title;
    if (typeof body.logoUrl === "string") item.logoUrl = body.logoUrl;
    if (typeof body.isActive === "boolean") item.isActive = body.isActive;
    if (typeof body.order === "number") item.order = body.order;

    await section.save();

    const cacheKey = CacheKeys.SECTION("partner");
    memoryCache.delete(cacheKey);
    console.log('🗑️  Cache invalidated - Partner Section');

    return NextResponse.json({ section });
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id (partnerId) is required" }, { status: 400 });

    const section = await ensurePartnerSection();
    section.partners = (section.partners || []).filter((p: any) => String(p._id) !== id);
    await section.save();

    const cacheKey = CacheKeys.SECTION("partner");
    memoryCache.delete(cacheKey);
    console.log('🗑️  Cache invalidated - Partner Section');

    return NextResponse.json({ section });
}