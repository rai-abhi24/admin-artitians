"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const siteSettingsSchema = z.object({
  email: z.string().email("Must be a valid email"),
  phoneNumber: z.string().min(10, "Enter a valid phone number"),
  whatsappNumber: z.string().min(10, "Enter a valid WhatsApp number"),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  youtube: z.string().optional(),
  maintenance: z.boolean().default(false),
});

type SiteSettingsData = z.infer<typeof siteSettingsSchema>;

export function SiteSettingsForm() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SiteSettingsData>({
    resolver: zodResolver(siteSettingsSchema as any),
    defaultValues: {
      email: "",
      phoneNumber: "",
      whatsappNumber: "",
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
      maintenance: false,
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/site-settings");
        const data = await res.json();
        if (data?.settings) {
          reset(data.settings);
        }
      } catch (err) {
        console.error("Failed to load site settings:", err);
      }
    };
    fetchSettings();
  }, [reset]);

  const onSubmit = async (formData: SiteSettingsData) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save settings");

      toast({
        title: "✅ Success",
        description: "Site settings updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
        <CardDescription>Configure global site settings</CardDescription>
      </CardHeader>
      <CardContent className="overflow-y-scroll max-h-[calc(100vh-320px)]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email (for &quot;Contact Us&quot;)</Label>
            <Input id="email" placeholder="Enter email" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          {/* ☎️ Contact Numbers */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number (for &quot;Call Now&quot;)</Label>
            <Input id="phoneNumber" placeholder="Enter phone number" {...register("phoneNumber")} />
            {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <Input id="whatsappNumber" placeholder="Enter WhatsApp number" {...register("whatsappNumber")} />
            {errors.whatsappNumber && <p className="text-sm text-destructive">{errors.whatsappNumber.message}</p>}
          </div>

          {/* 🌐 Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input id="facebook" placeholder="https://facebook.com/yourpage" {...register("facebook")} />
              {errors.facebook && <p className="text-sm text-destructive">{errors.facebook.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input id="instagram" placeholder="https://instagram.com/yourpage" {...register("instagram")} />
              {errors.instagram && <p className="text-sm text-destructive">{errors.instagram.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter URL</Label>
              <Input id="twitter" placeholder="https://twitter.com/yourpage" {...register("twitter")} />
              {errors.twitter && <p className="text-sm text-destructive">{errors.twitter.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube URL</Label>
              <Input id="youtube" placeholder="https://youtube.com/@yourchannel" {...register("youtube")} />
              {errors.youtube && <p className="text-sm text-destructive">{errors.youtube.message}</p>}
            </div>
          </div>

          {/* 🛠 Maintenance Mode */}
          <div className="flex items-center justify-between border rounded-md px-3 py-4 bg-muted/30">
            <div>
              <Label htmlFor="maintenance">Maintenance Mode</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Temporarily disable your landing page for visitors.
              </p>
            </div>
            <Switch
              id="maintenance"
              checked={watch("maintenance")}
              onCheckedChange={(checked) => setValue("maintenance", checked)}
            />
          </div>

          <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}