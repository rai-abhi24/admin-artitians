import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

import bcrypt from "bcryptjs";

const APP_ROUTES = [
    "/leads",
];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const paas = "Artitians@123admin"
    console.log(await bcrypt.hashSync(paas, 10));
    
    const isAppRoute = APP_ROUTES.some((p) => pathname.startsWith(p));
    const token = req.cookies.get("session")?.value;
    const isAuth = !!token && (await verifyToken(token));

    if (isAuth && pathname === "/") {
        const url = req.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    // Block unauthenticated users from app routes
    if (isAppRoute && !isAuth) {
        const url = req.nextUrl.clone();
        url.pathname = "/";
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

async function verifyToken(token?: string): Promise<boolean> {
    if (!token) return false;

    try {
        await verifySession(token);
        return true;
    } catch (error) {
        console.error("Token verification failed:", error);
        return false;
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - Files with extensions (images, etc.)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};