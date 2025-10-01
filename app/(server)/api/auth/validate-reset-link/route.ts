import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { AdminUser } from "@/models";
import { PasswordResetToken } from "@/models";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
    try {
        await connectToDB();
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");
        const token = searchParams.get("token");

        if (!email || !token) {
            return NextResponse.json({ valid: false, reason: "missing" }, { status: 400 });
        }
        console.log("user", email);

        const user = await AdminUser.findOne({ email }).lean<{ _id: string }>();
        console.log("user", user);

        if (!user) {
            return NextResponse.json({ valid: false, reason: "invalid" }, { status: 200 });
        }

        const doc = await PasswordResetToken.findOne({ userId: user._id, status: "unused" })
            .sort({ createdAt: -1 })
            .lean<{ tokenHash: string; expiresAt: Date }>();

        if (!doc) {
            return NextResponse.json({ valid: false, reason: "not_found" }, { status: 200 });
        }

        const match = await bcrypt.compare(token, doc.tokenHash);
        if (!match) {
            return NextResponse.json({ valid: false, reason: "mismatch" }, { status: 200 });
        }

        if (Date.now() > new Date(doc.expiresAt).getTime()) {
            return NextResponse.json({ valid: false, reason: "expired" }, { status: 200 });
        }

        return NextResponse.json({ valid: true });
    } catch (err: any) {
        return NextResponse.json({ valid: false, message: err.message }, { status: 500 });
    }
}


