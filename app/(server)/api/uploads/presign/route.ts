import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { bucketName, s3Client, buildObjectKey } from "@/lib/storage/s3";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { fileName, fileType, prefix } = body as { fileName: string; fileType: string; prefix?: string };

        if (!fileName || !fileType) {
            return NextResponse.json({ ok: false, error: "fileName and fileType required" }, { status: 400 });
        }

        const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
        const objectKey = buildObjectKey([prefix || "merchant-uploads", `${Date.now()}-${safeName}`]);

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
            ContentType: fileType,
            ACL: "private",
        } as any);

        const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 5 });

        return NextResponse.json({ ok: true, uploadUrl: url, key: objectKey, url: `https://${bucketName}.s3.amazonaws.com/${objectKey}` });
    } catch (err: any) {
        return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
    }
}


