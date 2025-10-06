import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

const APP_ROUTES: string[] = [
    "/admin",
    "/admin/dashboard",
    "/admin/enquiries",
    "/admin/hero",
    "/admin/testimonials",
    "/admin/partners",
    "/admin/before-after",
    "/admin/users",
    "/admin/settings",
];

const PUBLIC_ROUTES = [
    "/",
    "/api",
    "/admin/login",
    "/admin/forgot-password",
    "/admin/reset-password",
];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const isAppRoute = APP_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"));
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const token = req.cookies.get("session")?.value;
    const isAuth = !!token && (await verifyToken(token));

    const res = NextResponse.next();
    setCorsHeaders(res);

    if (req.method === "OPTIONS") {
        return new NextResponse(null, {
            status: 200,
            headers: res.headers,
        });
    }

    if (isAuth && pathname === "/") {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/dashboard";
        return NextResponse.redirect(url);
    }

    if (!isAuth && (pathname === "/" || pathname === "/admin")) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
    }

    if (isAppRoute && !isAuth && !isPublicRoute) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
    }

    if (isAuth && (pathname === "/admin/login" || pathname === "/admin")) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/dashboard";
        return NextResponse.redirect(url);
    }

    return res;
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

function setCorsHeaders(res: NextResponse) {
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export const config = {
    matcher: [
        // Match all except static files and image routes
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};