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

interface BeforeAfterTableProps {
  onEdit: (item: any) => void
}

export function BeforeAfterTable({ onEdit }: BeforeAfterTableProps) {
  const { toast } = useToast()
  const [deleteItem, setDeleteItem] = useState<any>(null)

  const { data, error, isLoading, mutate } = useSWR("/api/sections?type=before-after", fetcher)

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/sections/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete")

      mutate()
      toast({
        title: "Success",
        description: "Comparison deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comparison",
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
          Failed to load comparisons
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          {data?.sections?.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
              No before-after comparisons yet. Click &quot;Add New Comparison&quot; to create one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Before Image</TableHead>
                  <TableHead>After Image</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.sections?.map((item: any) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.title || "Untitled"}</TableCell>
                    <TableCell>
                      {item.content?.beforeImg ? (
                        <div className="relative h-16 w-24">
                          <Image
                            src={item.content.beforeImg || "/placeholder.svg"}
                            alt="Before"
                            fill
                            className="object-cover rounded"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-24 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.content?.afterImg ? (
                        <div className="relative h-16 w-24">
                          <Image
                            src={item.content.afterImg || "/placeholder.svg"}
                            alt="After"
                            fill
                            className="object-cover rounded"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-24 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.isActive ? "default" : "secondary"}>
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
          title="Delete Comparison"
          description={`Are you sure you want to delete this before-after comparison? This action cannot be undone.`}
        />
      )}
    </>
  )
}
