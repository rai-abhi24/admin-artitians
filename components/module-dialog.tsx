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
import UploadFile from "./upload-file"
import Image from "next/image"

const moduleSchema = z.object({
  heading: z.string().min(2, "Heading is required"),
  description: z.string().min(1, "Description must be at least 1 character"),
  image: z.string().url("Must be a valid image URL").optional().or(z.literal("")),
  type: z.string().min(1, "Type is required").optional().or(z.literal("")),
  isActive: z.boolean().default(true),
})

type ModuleFormData = z.infer<typeof moduleSchema>

interface ModuleDialogProps {
  open: boolean
  onClose: () => void
  editItem?: any
}

export function ModuleDialog({ open, onClose, editItem }: ModuleDialogProps) {
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
  } = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema as any),
    defaultValues: {
      isActive: true,
    },
  })

  const isActive = watch("isActive")
  const currentImage = uploadedImage || watch("image")

  useEffect(() => {
    if (editItem) {
      reset({
        heading: editItem.heading || "",
        description: editItem.description || "",
        image: editItem.image || "",
        isActive: editItem.isActive ?? true,
        type: editItem.type || "",
      })
      setUploadedImage(editItem.image || null)
    } else {
      reset({
        heading: "",
        description: "",
        image: "",
        type: "",
        isActive: true,
      })
      setUploadedImage(null)
    }
  }, [editItem, reset, open])

  const onSubmit = async (formData: ModuleFormData) => {
    setIsSaving(true)
    try {
      const finalImage = uploadedImage || formData.image || ""

      const res = await fetch("/api/sections/module", {
        method: editItem ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image: finalImage,
          id: editItem?._id,
          type: formData.type || "",
        }),
      })

      if (!res.ok) throw new Error("Failed to save module")

      mutate("/api/sections?type=module")
      toast({
        title: "Success",
        description: `Module ${editItem ? "updated" : "added"} successfully`,
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save module",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="overflow-x-scroll">
        <DialogHeader>
          <DialogTitle>{editItem ? "Edit" : "Add"} Module</DialogTitle>
          <DialogDescription>
            {editItem
              ? "Update the module details"
              : "Add a new module to display on landing page."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Heading */}
          <div className="space-y-2">
            <Label htmlFor="heading">Heading</Label>
            <Input id="heading" placeholder="e.g. Modern 2BHK" {...register("heading")} />
            {errors.heading && <p className="text-sm text-destructive">{errors.heading.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Write a brief description of the module..."
              {...register("description")}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Input id="type" placeholder="e.g. Villa, Penthouse, 3BHK" {...register("type")} />
            {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
          </div>

          {/* ✅ Image Upload OR URL */}
          <div className="space-y-2 mt-8">
            <Label>Image</Label>

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