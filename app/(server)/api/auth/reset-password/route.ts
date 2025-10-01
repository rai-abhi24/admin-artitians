import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { AdminUser } from "@/models";
import { PasswordResetToken } from "@/models";
import bcrypt from "bcryptjs";

const FIVE_MINUTES_MS = 5 * 60 * 1000;

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const { email, token, password } = await req.json();
        if (!email || !token || !password) {
            return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
        }

        if (typeof password !== "string" || password.length < 8) {
            return NextResponse.json({ success: false, message: "Password too weak" }, { status: 400 });
        }

        const user = await AdminUser.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, message: "Invalid link" }, { status: 400 });
        }

        const doc = await PasswordResetToken.findOne({ userId: user._id, status: "unused" }).sort({ createdAt: -1 });
        if (!doc) {
            return NextResponse.json({ success: false, message: "Invalid or expired link" }, { status: 400 });
        }

        const match = await bcrypt.compare(String(token), doc.tokenHash);
        if (!match) {
            return NextResponse.json({ success: false, message: "Invalid or expired link" }, { status: 400 });
        }

        if (Date.now() > new Date(doc.expiresAt).getTime()) {
            return NextResponse.json({ success: false, message: "Link expired" }, { status: 400 });
        }

        // Hash the new password
        const newHash = await bcrypt.hash(String(password), 12);
        user.password = newHash;
        await user.save();

        // Invalidate this token and any other unused tokens for this user
        await PasswordResetToken.updateMany({ userId: user._id, status: "unused" }, { $set: { status: "used" } });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}


