"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, File as FileIcon, X } from "lucide-react";
import { presignUpload } from "@/lib/services/user";

export type UploadFileProps = {
    files: string[]; // ✅ now an array
    onFileChange: (fileUrls: string[]) => void;
    accept?: string;
    className?: string;
    allowDownload?: boolean;
    multiple?: boolean; // ✅ optional toggle for multi-upload
};

const DEFAULT_CLASS =
    "mt-1.5 block w-full rounded-md border bg-background px-1 py-1 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:text-white file:px-3 file:py-2 hover:file:bg-primary/90 cursor-pointer";

export function UploadFile({
    files,
    onFileChange,
    accept,
    className,
    allowDownload = true,
    multiple = false,
}: UploadFileProps) {
    const containerClass = className || DEFAULT_CLASS;
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const fileNames = useMemo(() => files?.map((f) => f.split("/").pop() || "file") || [], [files]);

    async function uploadSingleFile(blob: File): Promise<string> {
        const presign = await presignUpload({
            fileName: blob.name,
            fileType: blob.type,
        });

        const { uploadUrl, url } = presign as any;

        await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.upload.onprogress = (evt) => {
                if (evt.lengthComputable) {
                    const pct = Math.round((evt.loaded / evt.total) * 100);
                    setProgress(pct);
                }
            };
            xhr.onerror = () => reject(new Error("Upload failed"));
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) resolve();
                else reject(new Error(`Upload failed with status ${xhr.status}`));
            };
            xhr.open("PUT", uploadUrl);
            xhr.setRequestHeader("Content-Type", blob.type);
            xhr.send(blob);
        });

        return url;
    }

    async function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const blobs = Array.from(e.target.files || []);
        if (blobs.length === 0) {
            onFileChange([]);
            return;
        }

        setUploading(true);
        setProgress(0);

        try {
            // ✅ Upload all files sequentially or in parallel
            const uploadedUrls = await Promise.all(blobs.map(uploadSingleFile));

            // ✅ Merge with previous files if needed
            const newUrls = multiple ? [...(files || []), ...uploadedUrls] : uploadedUrls;
            onFileChange(newUrls);
        } catch (err) {
            console.error("Upload error:", err);
            setProgress(0);
        } finally {
            setUploading(false);
        }
    }

    function handleView(url: string) {
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.download = url.split("/").pop() || "document";
        a.click();
    }

    function removeFile(index: number) {
        const newFiles = files.filter((_, i) => i !== index);
        onFileChange(newFiles);
    }

    if (uploading) {
        return (
            <div className={`${containerClass} h-12 flex items-center gap-2 px-3`}>
                <div className="w-full bg-muted rounded h-2 overflow-hidden">
                    <div className="bg-primary h-2 transition-all ease-linear" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-xs tabular-nums w-10 text-right">{progress}%</span>
            </div>
        );
    }

    if (!files || files.length === 0) {
        return <input className={containerClass} type="file" accept={accept} multiple={multiple} onChange={handleInputChange} />;
    }

    return (
        <div className="space-y-2">
            {files.map((fileUrl, idx) => (
                <div key={fileUrl} className={`${containerClass} h-12 flex items-center justify-between px-2 overflow-hidden`}>
                    <div className="flex items-center min-w-0" title={fileNames[idx]}>
                        <FileIcon className="ml-1 mr-1.5 min-h-5 min-w-5" />
                        <p className="truncate max-w-[200px] md:max-w-xs">{fileNames[idx]}</p>
                    </div>
                    <div className="flex items-center gap-0">
                        {allowDownload && (
                            <Button
                                type="button"
                                title="View"
                                variant="ghost"
                                className="text-sm rounded-lg w-6 h-6 p-0 hover:scale-125 transition-all duration-200 ease-in-out"
                                onClick={() => handleView(fileUrl)}
                            >
                                <Eye className="h-5 w-5" />
                            </Button>
                        )}
                        <Button
                            type="button"
                            title="Remove"
                            variant="ghost"
                            className="text-sm rounded-lg w-6 h-6 p-0 hover:scale-125 transition-all duration-200 ease-in-out"
                            onClick={() => removeFile(idx)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}

            {/* Add More Button */}
            {multiple && (
                <input
                    className={containerClass}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleInputChange}
                />
            )}
        </div>
    );
}

export default UploadFile;