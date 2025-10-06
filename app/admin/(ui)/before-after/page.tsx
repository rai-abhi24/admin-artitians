"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { BeforeAfterTable } from "@/components/before-after-table"
import { BeforeAfterDialog } from "@/components/before-after-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function BeforeAfterPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)

  const handleEdit = (item: any) => {
    setEditItem(item)
    setIsDialogOpen(true)
  }

  const handleClose = () => {
    setIsDialogOpen(false)
    setEditItem(null)
  }

  return (
    <div className="flex flex-col">
      <Header title="Before-After Gallery" description="Manage before and after images on your landing page" />
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-end">
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Comparison
          </Button>
        </div>

        <BeforeAfterTable onEdit={handleEdit} />

        <BeforeAfterDialog open={isDialogOpen} onClose={handleClose} editItem={editItem} />
      </div>
    </div>
  )
}
