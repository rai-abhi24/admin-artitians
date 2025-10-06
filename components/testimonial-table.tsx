"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Loader2 } from "lucide-react"
import { DeleteDialog } from "./delete-dialog"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface TestimonialsTableProps {
  onEdit: (item: any) => void
}

export function TestimonialsTable({ onEdit }: TestimonialsTableProps) {
  const { toast } = useToast()
  const [deleteItem, setDeleteItem] = useState<any>(null)

  const { data, error, isLoading, mutate } = useSWR(`/api/sections?type=testimonial`, fetcher)

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/sections/testimonial?id=${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete testimonial")

      mutate()
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center text-destructive">
          Failed to load testimonials
        </CardContent>
      </Card>
    )
  }

  const testimonials = data?.section?.testimonials || []

  return (
    <>
      <Card>
        <CardContent className="p-0 px-6 overflow-y-scroll max-h-[calc(100vh-240px)]">
          {testimonials.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
              No testimonials yet. Click&nbsp;<strong>Add New Testimonial</strong>&nbsp;to create one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-white">S No</TableHead>
                  <TableHead className="text-white">Image</TableHead>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Role</TableHead>
                  <TableHead className="text-white">Text</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((item: any, index: number) => (
                  <TableRow key={item._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {item.image ? (
                        <div className="relative h-12 w-12 rounded-full overflow-hidden" onClick={() => window.open(item.image, "_blank")}>
                          <Image src={item.image} alt={item.name} className="object-cover mx-auto object-top hover:scale-110 transition-all duration-200 cursor-pointer" width={50} height={50}/>
                        </div>
                      ) : (
                        <div className="h-12 w-12 text-center rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          No<br></br> Image
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.role}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.text}</TableCell>
                    <TableCell>
                      <Badge variant={item.isActive ? "default" : "outline"}>
                        {item.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteItem(item)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {deleteItem && (
        <DeleteDialog
          open={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={() => {
            handleDelete(deleteItem._id)
            setDeleteItem(null)
          }}
          title="Delete Testimonial"
          description={`Are you sure you want to delete the testimonial by "${deleteItem.name}"? This action cannot be undone.`}
        />
      )}
    </>
  )
}