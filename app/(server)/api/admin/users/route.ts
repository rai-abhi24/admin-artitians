import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { AdminUser } from "@/models";
import bcrypt from "bcryptjs";

export async function GET(_req: Request) {
    try {
        await connectToDB();
        const users = await AdminUser.find({})
            .select("-password")
            .sort({ createdAt: -1 })
            .lean();
        return NextResponse.json({
            success: true,
            data: users
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectToDB();
        const body = await req.json();

        if (!body.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
        if (!body.email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
        if (!body.password) return NextResponse.json({ error: "Password is required" }, { status: 400 });

        const existingUser = await AdminUser.findOne({ email: body.email });
        if (existingUser) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

        const hashedPassword = await bcrypt.hash(String(body.password), 12);
        body.password = hashedPassword;

        const user = await AdminUser.create(body);

        return NextResponse.json({
            success: true,
            data: user
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await connectToDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "id (userId) is required" }, { status: 400 });

        const body = await req.json();

        if (body.password) {
            const newPassword = await bcrypt.hash(String(body.password), 12);
            body.password = newPassword;
        }

        const user = await AdminUser.findOneAndUpdate({ _id: id }, body, { new: true });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json({
            success: true,
            data: user
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await connectToDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "id (userId) is required" }, { status: 400 });

        const user = await AdminUser.findOneAndDelete({ _id: id });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json({
            success: true,
            data: user
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}