import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change";
const key = new TextEncoder().encode(JWT_SECRET);

export type Session = { userId: string; email: string; role?: string };

export async function signSession(session: Session) {
    return await new SignJWT(session as any)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(key);
}

export async function verifySession(token: string) {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return payload as unknown as Session;
}


