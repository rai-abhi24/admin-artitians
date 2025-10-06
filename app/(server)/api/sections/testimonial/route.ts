import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Section from "@/models/Section";

export async function GET() {
    try {
        await connectToDB();

        let section = await Section.findOne({ type: "testimonial" });
        if (!section) {
            section = await Section.create({ type: "testimonial", testimonials: [] });
        }

        return NextResponse.json({ success: true, testimonials: section.testimonials || [] });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

async function ensureTestimonialSection() {
    await connectToDB();
    let section = await Section.findOne({ type: "testimonial" });
    if (!section) section = await Section.create({ type: "testimonial", testimonials: [] });
    return section;
}


export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const body = await req.json();

        const section = await ensureTestimonialSection();

        const newTestimonial = {
            text: body.text,
            name: body.name,
            role: body.role,
            image: body.image || "",
            order: body.order || 0,
            isActive: true,
        };

        section.testimonials.push(newTestimonial);
        await section.save();

        return NextResponse.json({ success: true, testimonials: section.testimonials });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectToDB();
        const body = await req.json();

        const { id, ...updateFields } = body;
        const section = await Section.findOne({ type: "testimonial" });
        if (!section) throw new Error("Testimonials section not found");

        const testimonialIndex = section.testimonials.findIndex((t: any) => t._id.toString() === id);
        if (testimonialIndex === -1) throw new Error("Testimonial not found");

        section.testimonials[testimonialIndex] = {
            ...section.testimonials[testimonialIndex],
            ...updateFields,
        };

        await section.save();

        return NextResponse.json({ success: true, testimonials: section.testimonials });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectToDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        const section = await Section.findOne({ type: "testimonial" });
        if (!section) throw new Error("Testimonials section not found");

        section.testimonials = section.testimonials.filter((t: any) => t._id.toString() !== id);
        await section.save();

        return NextResponse.json({ success: true, testimonials: section.testimonials });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}