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
import UploadFile from "./upload-file"
const partnerSchema = z.object({
  title: z.string().min(1, "Partner name is required"),
  logoUrl: z.string().url("Must be a valid URL"),
  isActive: z.boolean().default(true),
})

type PartnerFormData = z.infer<typeof partnerSchema>

export function PartnerDialog({ open, onClose, editItem }: any) {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } =
    useForm<PartnerFormData>({ resolver: zodResolver(partnerSchema as any), defaultValues: { isActive: true } })

  useEffect(() => {
    if (editItem) {
      reset({ title: editItem.title || "", logoUrl: editItem.logoUrl || "", isActive: !!editItem.isActive })
    } else {
      reset({ title: "", logoUrl: "", isActive: true })
    }
  }, [editItem, reset, open])

  const onSubmit = async (formData: PartnerFormData) => {
    setIsSaving(true)
    try {
      const res = await fetch(
        editItem ? `/api/sections/partner-items?id=${editItem._id}` : "/api/sections/partner-items",
        {
          method: editItem ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      )

      if (!res.ok) throw new Error("Failed to save")
      mutate("/api/sections?type=partner")
      toast({ title: "Success", description: `Partner ${editItem ? "updated" : "created"} successfully` })
      onClose()
    } catch {
      toast({ title: "Error", description: "Failed to save partner", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editItem ? "Edit" : "Add"} Partner</DialogTitle>
          <DialogDescription>
            {editItem ? "Update the partner details" : "Add a new partner logo to your landing page"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-scroll">
          <div className="space-y-2">
            <Label>Partner Name</Label>
            <Input placeholder="Enter partner name" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Logo Upload</Label>
            <UploadFile
              files={watch("logoUrl") ? [watch("logoUrl")] : []}
              onFileChange={(urls) => setValue("logoUrl", urls[0] || "")}
            />
            {errors.logoUrl && <p className="text-sm text-destructive">{errors.logoUrl.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <Label>Active</Label>
            <Switch checked={watch("isActive")} onCheckedChange={(v) => setValue("isActive", v)} />
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