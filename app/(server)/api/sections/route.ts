import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Section from "@/models/Section";

export async function GET(req: Request) {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!type) return NextResponse.json({ error: "type is required" }, { status: 400 });

    // Ensure single doc per type (auto-create empty shell for partner/hero if needed)
    let section = await Section.findOne({ type });
    if (!section) {
        section = await Section.create(
            type === "partner"
                ? { type, partners: [] }
                : { type, highlightedText: "", normalText: "", subtitle: "", backgroundImage: "", content: { galleryImages: [] } }
        );
    }
    return NextResponse.json({ section });
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
    return NextResponse.json({ section }, { status: 201 });
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
    return NextResponse.json({ section: updated });
}