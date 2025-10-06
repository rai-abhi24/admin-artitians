"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { mutate } from "swr"

const partnerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Must be a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const updateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Must be a valid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),
})

type AdminUsersFormData = z.infer<typeof updateSchema>

export function AdminUsersDialog({ open, onClose, editItem }: any) {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } =
    useForm<AdminUsersFormData>({ resolver: zodResolver(editItem ? updateSchema : partnerSchema) })

  useEffect(() => {
    if (editItem) {
      reset({ name: editItem.name || "", email: editItem.email || "" })
    } else {
      reset({ name: "", email: "", password: "" })
    }
  }, [editItem, reset, open])

  const onSubmit = async (formData: AdminUsersFormData) => {
    setIsSaving(true)
    try {
      if (!formData.password) {
        delete formData.password
      }

      const res = await fetch(
        editItem ? `/api/admin/users?id=${editItem._id}` : "/api/admin/users",
        {
          method: editItem ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      )

      if (!res.ok) throw new Error("Failed to save")
      mutate("/api/admin/users")
      toast({ title: "Success", description: `Admin ${editItem ? "updated" : "created"} successfully` })
      onClose()
    } catch {
      toast({ title: "Error", description: "Failed to save admin", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editItem ? "Edit" : "Add"} Admin</DialogTitle>
          <DialogDescription>{null}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-scroll">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input placeholder="Enter name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input placeholder="Enter email" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2 mt-2">
            <Label>{editItem ? "Password (optional)" : "Password"}</Label>
            <Input placeholder={editItem ? "Leave blank to keep current password" : "Enter password"} {...register("password")} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
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