"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, File as FileIcon, X } from "lucide-react";

export type UploadFileProps = {
    file: string | null | undefined;
    onFileChange: (fileUrl: string | null) => void;
    accept?: string;
    className?: string;
    allowDownload?: boolean;
};

const DEFAULT_CLASS =
    "mt-1.5 block w-full rounded-md border bg-background px-1 py-1 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-secondary-foreground hover:file:bg-secondary/80 cursor-pointer";

import { presignUpload } from "@/lib/services/merchant";

export function UploadFile({ file, onFileChange, accept, className, allowDownload = true }: UploadFileProps) {
    const containerClass = className || DEFAULT_CLASS;
    const fileName = useMemo(() => (file ? file.split("/").pop() || "document" : undefined), [file]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const blob = e.target.files?.[0] || null;
        if (!blob) {
            onFileChange(null);
            return;
        }
        // Upload to S3 using presigned URL
        void (async () => {
            setUploading(true);
            setProgress(0);
            try {
                const presign = await presignUpload({ fileName: blob.name, fileType: blob.type, prefix: "merchants" });
                const { uploadUrl, url } = presign as any;

                await new Promise<void>((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.upload.onprogress = (evt) => {
                        if (!evt.lengthComputable) return;
                        const pct = Math.round((evt.loaded / evt.total) * 100);
                        setProgress(pct);
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

                setProgress(100);
                onFileChange(url);
            } catch (err) {
                console.error(err);
                setUploading(false);
                setProgress(0);
            } finally {
                setUploading(false);
            }
        })();
    }

    function handleView() {
        if (!file) return;
        const url = file;
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName || "document";
        a.target = "_blank";
        a.click();
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

    if (!file) {
        return <input className={containerClass} type="file" accept={accept} onChange={handleInputChange} />;
    }

    return (
        <div className={`${containerClass} h-12 flex items-center justify-between px-2 overflow-hidden`}>
            <div className="flex items-center min-w-0" title={fileName}>
                <FileIcon className="ml-1 mr-1.5 min-h-5 min-w-5" />
                <p className="truncate">{fileName}</p>
            </div>
            <div className="flex items-center gap-0">
                {allowDownload && (
                    <Button
                        type="button"
                        title="Remove"
                        variant="ghost"
                        className="text-sm rounded-lg w-6 h-6 p-0 hover:scale-125 transition-all duration-200 ease-in-out"
                        onClick={handleView}
                    >
                        <Eye className="h-5 w-5" />
                    </Button>
                )}
                <Button
                    type="button"
                    title="Remove"
                    variant="ghost"
                    className="text-sm rounded-lg w-6 h-6 p-0 hover:scale-125 transition-all duration-200 ease-in-out"
                    onClick={() => onFileChange(null)}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export default UploadFile;


