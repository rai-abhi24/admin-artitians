import { S3Client } from "@aws-sdk/client-s3";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
export const bucketName = process.env.AWS_S3_BUCKET as string;
const region = process.env.AWS_REGION;

if (!bucketName) {
  throw new Error("❌ Please set AWS_S3_BUCKET in environment");
}

export const s3Client = new S3Client({
  region,
  credentials: accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined,
});

export function buildObjectKey(parts: Array<string | undefined | null>) {
  return parts.filter(Boolean).join("/");
}
