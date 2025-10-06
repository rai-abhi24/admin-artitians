"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { mutate } from "swr"

const beforeAfterSchema = z.object({
  title: z.string().optional(),
  beforeImg: z.string().url("Must be a valid URL"),
  afterImg: z.string().url("Must be a valid URL"),
  isActive: z.boolean().default(true),
})

type BeforeAfterFormData = z.infer<typeof beforeAfterSchema>

interface BeforeAfterDialogProps {
  open: boolean
  onClose: () => void
  editItem?: any
}

export function BeforeAfterDialog({ open, onClose, editItem }: BeforeAfterDialogProps) {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BeforeAfterFormData>({
    resolver: zodResolver(beforeAfterSchema as any),
    defaultValues: {
      isActive: true,
    },
  })

  const isActive = watch("isActive")

  useEffect(() => {
    if (editItem) {
      reset({
        title: editItem.title || "",
        beforeImg: editItem.content?.beforeImg || "",
        afterImg: editItem.content?.afterImg || "",
        isActive: editItem.isActive ?? true,
      })
    } else {
      reset({
        title: "",
        beforeImg: "",
        afterImg: "",
        isActive: true,
      })
    }
  }, [editItem, reset, open])

  const onSubmit = async (formData: BeforeAfterFormData) => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/sections", {
        method: editItem ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "before-after",
          title: formData.title,
          content: {
            beforeImg: formData.beforeImg,
            afterImg: formData.afterImg,
          },
          isActive: formData.isActive,
          _id: editItem?._id,
        }),
      })

      if (!res.ok) throw new Error("Failed to save")

      mutate("/api/sections?type=before-after")
      toast({
        title: "Success",
        description: `Comparison ${editItem ? "updated" : "created"} successfully`,
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save comparison",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editItem ? "Edit" : "Add"} Before-After Comparison</DialogTitle>
          <DialogDescription>
            {editItem ? "Update the comparison images" : "Add a new before-after comparison to your landing page"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title (optional)</Label>
            <Input id="title" placeholder="Enter comparison title" {...register("title")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="beforeImg">Before Image URL</Label>
            <Input id="beforeImg" type="url" placeholder="https://example.com/before.jpg" {...register("beforeImg")} />
            {errors.beforeImg && <p className="text-sm text-destructive">{errors.beforeImg.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="afterImg">After Image URL</Label>
            <Input id="afterImg" type="url" placeholder="https://example.com/after.jpg" {...register("afterImg")} />
            {errors.afterImg && <p className="text-sm text-destructive">{errors.afterImg.message}</p>}
            <p className="text-xs text-muted-foreground">Upload images to your preferred hosting service</p>
          </div>

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
