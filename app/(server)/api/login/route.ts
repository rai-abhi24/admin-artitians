import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { AdminUser } from "@/models";
import bcrypt from "bcryptjs";
import { signSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: "Missing credentials" }, { status: 400 });
        }

        const user = await AdminUser.findOne({ email })
            .lean<{
                _id: string;
                email: string;
                password: string;
                role?: string
            }>();

        if (!user) {
            return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
        }

        const token = await signSession({
            userId: String(user._id),
            email: user.email,
            role: user.role
        });

        const res = NextResponse.json({ success: true });

        res.cookies.set("session", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/"
        });
        return res;
    } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}