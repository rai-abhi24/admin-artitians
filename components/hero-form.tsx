"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import UploadFile from "./upload-file";
import Image from "next/image";

const heroSchema = z.object({
  highlightedText: z.string().min(1, "Highlighted text is required"),
  normalText: z.string().min(1, "Normal text is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  backgroundImage: z.string().optional(),
  galleryImages: z.array(z.string()).optional(),
});

type HeroFormData = z.infer<typeof heroSchema>;

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function HeroForm() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [bgPreview, setBgPreview] = useState<string | null>(null);
  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);

  const { data, isLoading, mutate } = useSWR("/api/sections?type=hero", fetcher);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HeroFormData>();

  // 🔄 Pre-fill existing data
  useEffect(() => {
    if (data?.section) {
      const section = data.section;
      reset({
        highlightedText: section.highlightedText || "",
        normalText: section.normalText || "",
        subtitle: section.subtitle || "",
        backgroundImage: section.backgroundImage || "",
        galleryImages: section.content?.galleryImages || [],
      });

      setBgPreview(section.backgroundImage || null);
      setGalleryPreview(section.content?.galleryImages || []);
    }
  }, [data, reset]);

  // 💾 Submit handler
  const onSubmit = async (formData: HeroFormData) => {
    try {
      setIsSaving(true);

      const bgUrl = bgPreview || "";
      const galleryUrls = galleryPreview || [];

      await axios({
        method: data?.section ? "PUT" : "POST",
        url: "/api/sections",
        data: {
          type: "hero",
          _id: data?.section?._id || "",
          highlightedText: formData.highlightedText,
          normalText: formData.normalText,
          subtitle: formData.subtitle,
          backgroundImage: bgUrl,
          content: {
            galleryImages: galleryUrls,
          },
        },
      });

      toast({
        title: "✅ Success",
        description: "Hero section updated successfully!",
      });

      mutate();
    } catch (error) {
      console.error(error);
      toast({
        title: "❌ Error",
        description: "Failed to update hero section",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section Content</CardTitle>
        <CardDescription>Manage heading, subtitle, background & carousel dynamically</CardDescription>
      </CardHeader>

      <CardContent className="overflow-y-scroll max-h-[calc(100vh-240px)]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Highlighted Text */}
          <div className="space-y-2">
            <Label htmlFor="highlightedText">Highlighted Heading Text</Label>
            <Input id="highlightedText" placeholder="e.g. Artitians Interior" {...register("highlightedText")} />
            {errors.highlightedText && <p className="text-sm text-destructive">{errors.highlightedText.message}</p>}
          </div>

          {/* Normal Text */}
          <div className="space-y-2">
            <Label htmlFor="normalText">Normal Heading Text</Label>
            <Input id="normalText" placeholder="e.g. Where Dreams Take Shape" {...register("normalText")} />
            {errors.normalText && <p className="text-sm text-destructive">{errors.normalText.message}</p>}
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea id="subtitle" placeholder="Enter hero subtitle..." rows={3} {...register("subtitle")} />
            {errors.subtitle && <p className="text-sm text-destructive">{errors.subtitle.message}</p>}
          </div>

          {/* Background Image */}
          <div className="space-y-2">
            <Label>Background Image</Label>
            <UploadFile
              files={bgPreview ? [bgPreview] : []}
              onFileChange={(urls) => setBgPreview(urls[0] || null)}
            />
            {bgPreview && (
              <Image
                src={bgPreview}
                alt="Preview"
                className="mt-2 h-80 rounded-md object-cover border-2 border-solid border-gray-300"
                width={400}
                height={300}
              />
            )}
          </div>

          {/* Gallery Images */}
          <div className="space-y-2">
            <Label>Carousel Images</Label>
            <UploadFile
              files={galleryPreview}
              onFileChange={(urls) => setGalleryPreview(urls)}
              multiple
            />
            <div className="mt-2 flex flex-wrap gap-4">
              {galleryPreview.map((src, idx) => (
                <Image
                  key={idx}
                  src={src}
                  alt="preview"
                  className="w-40 h-28 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-[200px] lg:h-[150px] object-cover rounded-xl shadow-lg border-2 border-solid border-gray-300"
                  width={200}
                  height={150}
                />
              ))}
            </div>
          </div>

          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}