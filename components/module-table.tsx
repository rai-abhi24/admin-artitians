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

interface ModulesTableProps {
  onEdit: (item: any) => void
}

export function ModulesTable({ onEdit }: ModulesTableProps) {
  const { toast } = useToast()
  const [deleteItem, setDeleteItem] = useState<any>(null)

  const { data, error, isLoading, mutate } = useSWR(`/api/sections?type=module`, fetcher)

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/sections/module?id=${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete module")

      mutate()
      toast({
        title: "Success",
        description: "Module deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete module",
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
          Failed to load modules
        </CardContent>
      </Card>
    )
  }

  const modules = data?.section?.modules || []

  return (
    <>
      <Card>
        <CardContent className="p-0 px-6 overflow-y-scroll max-h-[calc(100vh-240px)]">
          {modules.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
              No modules yet. Click&nbsp;<strong>Add New Module</strong>&nbsp;to create one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-white">S No</TableHead>
                  <TableHead className="text-white">Image</TableHead>
                  <TableHead className="text-white">Heading</TableHead>
                  <TableHead className="text-white">Desc</TableHead>
                  <TableHead className="text-white">Type</TableHead>
                  <TableHead className="text-white text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((item: any, index: number) => (
                  <TableRow key={item._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {item.image ? (
                        <div className="relative h-12 w-12 rounded-full overflow-hidden" onClick={() => window.open(item.image, "_blank")}>
                          <Image
                            src={item.image}
                            alt={item.heading}
                            fill
                            className="object-cover hover:scale-125 transition-all duration-300 cursor-pointer"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 text-center rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          No<br></br> Image
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.heading}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                    <TableCell>
                      {item.type ? (
                        <Badge className="text-xs" variant="default">{item.type}</Badge>
                      ) : (
                        null
                      )}
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
          title="Delete Module"
          description={`Are you sure you want to delete the module by "${deleteItem.name}"? This action cannot be undone.`}
        />
      )}
    </>
  )
}