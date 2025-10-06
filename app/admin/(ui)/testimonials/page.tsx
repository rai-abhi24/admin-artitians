"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { TestimonialsTable } from "@/components/testimonial-table"
import { TestimonialDialog } from "@/components/testimonial-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function TestimonialsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<any | null>(null)

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
      <Header title="Testimonials" description="Manage testimonials on your landing page" />
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Breadcrumb />
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Testimonial
          </Button>
        </div>

        <TestimonialsTable onEdit={handleEdit} />

        <TestimonialDialog open={isDialogOpen} onClose={handleClose} editItem={editItem} />
      </div>
    </div>
  )
}
