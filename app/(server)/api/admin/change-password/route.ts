import { connectToDB } from "@/lib/db";
import { AdminUser } from "@/models";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const { email, currentPassword, newPassword, confirmPassword } = await req.json();

        if (!email || !currentPassword || !newPassword || !confirmPassword) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json({ success: false, message: "New password and confirmation do not match" }, { status: 400 });
        }

        if (typeof newPassword !== "string" || newPassword.length < 6) {
            return NextResponse.json({ success: false, message: "Password too weak (6 characters minimum)" }, { status: 400 });
        }

        const user = await AdminUser.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(String(currentPassword), user.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, message: "Invalid current password" }, { status: 400 });
        }

        const newHash = await bcrypt.hash(String(newPassword), 12);
        user.password = newHash;
        await user.save();

        return NextResponse.json({ success: true, message: "Password updated successfully" }, { status: 200 });
    } catch (err: any) {
        console.error("Change password error:", err);
        return NextResponse.json({ success: false, message: err.message || "Internal Server Error" }, { status: 500 });
    }
}