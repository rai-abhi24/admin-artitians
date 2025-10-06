"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { mutate } from "swr"
import UploadFile from "./upload-file" // 👈 your upload component
import Image from "next/image"

// ✅ Validation: image is optional now
const testimonialSchema = z.object({
  text: z.string().min(10, "Testimonial must be at least 10 characters"),
  name: z.string().min(2, "Name is required"),
  role: z.string().min(2, "Role is required"),
  image: z.string().url("Must be a valid image URL").optional().or(z.literal("")),
  isActive: z.boolean().default(true),
})

type TestimonialFormData = z.infer<typeof testimonialSchema>

interface TestimonialDialogProps {
  open: boolean
  onClose: () => void
  editItem?: any
}

export function TestimonialDialog({ open, onClose, editItem }: TestimonialDialogProps) {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema as any),
    defaultValues: {
      isActive: true,
    },
  })

  const isActive = watch("isActive")
  const currentImage = uploadedImage || watch("image")

  useEffect(() => {
    if (editItem) {
      reset({
        text: editItem.text || "",
        name: editItem.name || "",
        role: editItem.role || "",
        image: editItem.image || "",
        isActive: editItem.isActive ?? true,
      })
      setUploadedImage(editItem.image || null)
    } else {
      reset({
        text: "",
        name: "",
        role: "",
        image: "",
        isActive: true,
      })
      setUploadedImage(null)
    }
  }, [editItem, reset, open])

  const onSubmit = async (formData: TestimonialFormData) => {
    setIsSaving(true)
    try {
      // ✅ Use uploaded image if available, else whatever is in form
      const finalImage = uploadedImage || formData.image || ""

      const res = await fetch("/api/sections/testimonial", {
        method: editItem ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image: finalImage,
          id: editItem?._id,
        }),
      })

      if (!res.ok) throw new Error("Failed to save testimonial")

      mutate("/api/sections?type=testimonial")
      toast({
        title: "Success",
        description: `Testimonial ${editItem ? "updated" : "added"} successfully`,
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save testimonial",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="overscroll-x-scroll">
        <DialogHeader>
          <DialogTitle>{editItem ? "Edit" : "Add"} Testimonial</DialogTitle>
          <DialogDescription>
            {editItem
              ? "Update the testimonial details"
              : "Add a new testimonial to display on landing page."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Testimonial text */}
          <div className="space-y-2">
            <Label htmlFor="text">Testimonial Text</Label>
            <Textarea
              id="text"
              rows={4}
              placeholder="Write the customer's review..."
              {...register("text")}
            />
            {errors.text && <p className="text-sm text-destructive">{errors.text.message}</p>}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Customer Name</Label>
            <Input id="name" placeholder="e.g. Sarah Johnson" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Customer Role / Company</Label>
            <Input id="role" placeholder="e.g. Founder - StyleHub" {...register("role")} />
            {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
          </div>

          {/* ✅ Image Upload OR URL */}
          <div className="space-y-2">
            <Label>Customer Image (optional)</Label>

            <div className="space-y-3">
              {/* Upload */}
              <UploadFile
                files={uploadedImage ? [uploadedImage] : []}
                onFileChange={(urls) => setUploadedImage(urls[0] || null)}
                accept="image/*"
              />
              {errors.image && <p className="text-sm text-destructive">{errors.image.message}</p>}
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Active</Label>
            <Switch id="isActive" checked={isActive} onCheckedChange={(checked) => setValue("isActive", checked)} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editItem ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}