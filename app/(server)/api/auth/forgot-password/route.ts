import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { AdminUser } from "@/models";
import { PasswordResetToken } from "@/models";
import { sendEmail } from "@/lib/email";
import { allowRequest } from "@/lib/rate-limit";
import crypto from "crypto";
import fs from 'fs/promises';
import bcrypt from "bcryptjs";
import path from "path";

const FIVE_MINUTES_MS = 5 * 60 * 1000;

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const { email } = await req.json();
        if (!email) {
            return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
        }

        const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
        const userAgent = req.headers.get("user-agent") || "unknown";

        const key = `fp:${ip}:${email}`.toLowerCase();
        const allowed = allowRequest(key, 5, 60_000); // 5 per minute per email+ip

        if (!allowed) {
            return NextResponse.json({ success: false, message: "Too many requests. Please try again later." }, { status: 429 });
        }

        const user = await AdminUser.findOne({ email }).lean<{ _id: string; email: string }>();
        // Always respond success to avoid user enumeration
        console.log("user", user);

        if (!user) {
            return NextResponse.json({ success: false, message: "We couldn’t find an account with this email." }, { status: 404 });
        }

        const rawToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = await bcrypt.hash(rawToken, 10);
        const now = Date.now();
        const expiresAt = new Date(now + FIVE_MINUTES_MS);

        // Invalidate any previous unused tokens for this user
        await PasswordResetToken.updateMany({ userId: user._id, status: "unused" }, { $set: { status: "used" } });

        await PasswordResetToken.create({
            userId: user._id,
            email: user.email,
            tokenHash,
            expiresAt,
            status: "unused",
            ip,
            userAgent,
        });

        const ts = Date.now();
        const baseUrl = process.env.APP_BASE_URL || `${req.nextUrl.origin}`;
        const url = new URL("/reset-password", baseUrl);
        url.searchParams.set("email", user.email);
        url.searchParams.set("token", rawToken);
        url.searchParams.set("ts", String(ts));
        console.log("url", url.toString());
        
        try {
            await sendResetPasswordEmail(user.email, url.toString());
        } catch (e) {
            // Swallow email errors to avoid enumeration; still return success
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}


async function sendResetPasswordEmail(email: string, url: string) {
    const subject = "Reset your password";
    const emailTemplatePath = path.join(process.cwd(), 'templates', 'mail', 'forgot-password.html');

    let htmlTemplate = await fs.readFile(emailTemplatePath, 'utf-8');
    htmlTemplate = htmlTemplate.replace(/{{resetUrl}}/g, url);

    sendEmail(email, subject, htmlTemplate)
        .catch((err) => {
            console.error('Email sending failed:', err.message);
        });
}