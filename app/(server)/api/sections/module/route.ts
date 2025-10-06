import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Section from "@/models/Section";

export async function GET() {
    try {
        await connectToDB();

        const section = await Section.findOne({ type: "module" });

        return NextResponse.json({ success: true, modules: section.modules || [] });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

async function ensureModuleSection() {
    await connectToDB();
    let section = await Section.findOne({ type: "module" });
    if (!section) section = await Section.create({ type: "module", modules: [] });
    return section;
}


export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const body = await req.json();

        if (!body.heading || !body.description) {
            throw new Error("Heading and description are required");
        }

        const section = await ensureModuleSection();

        const newModule = {
            heading: body.heading,
            description: body.description,
            image: body.image || "",
            type: body.type || "",
            order: body.order || 0,
            isActive: true,
        };

        section.modules.push(newModule);
        await section.save();

        return NextResponse.json({ success: true, modules: section.modules });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectToDB();
        const body = await req.json();

        const { id, ...updateFields } = body;
        const section = await Section.findOne({ type: "module" });
        if (!section) throw new Error("Modules section not found");

        const moduleIndex = section.modules.findIndex((m: any) => m._id.toString() === id);
        if (moduleIndex === -1) throw new Error("Module not found");

        section.modules[moduleIndex] = {
            ...section.modules[moduleIndex],
            ...updateFields,
        };

        await section.save();

        return NextResponse.json({ success: true, modules: section.modules });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectToDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        const section = await Section.findOne({ type: "module" });
        if (!section) throw new Error("Modules section not found");

        section.modules = section.modules.filter((m: any) => m._id.toString() !== id);
        await section.save();

        return NextResponse.json({ success: true, modules: section.modules });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}