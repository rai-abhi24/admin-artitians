import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("session")?.value;
        if (!token) return NextResponse.json({ ok: true, data: null });
        const session = await verifySession(token);
        return NextResponse.json({ ok: true, data: session });
    } catch (err: any) {
        return NextResponse.json({ ok: false, error: err.message }, { status: 401 });
    }
}


