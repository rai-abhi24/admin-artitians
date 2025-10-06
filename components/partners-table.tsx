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

interface PartnersTableProps {
  onEdit: (item: any) => void
}

export function PartnersTable({ onEdit }: PartnersTableProps) {
  const { toast } = useToast()
  const [deleteItem, setDeleteItem] = useState<any>(null)

  const { data, error, isLoading, mutate } = useSWR("/api/sections?type=partner", fetcher)

  const partners = data?.section?.partners || []

  const handleDelete = async (partnerId: string) => {
    try {
      const res = await fetch(`/api/sections/partner-items?id=${partnerId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")

      mutate()
      toast({ title: "Success", description: "Partner deleted successfully" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete partner", variant: "destructive" })
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
          Failed to load partners
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardContent className="p-0 px-6 overflow-y-scroll max-h-[calc(100vh-240px)]">
          {partners.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
              No partners yet. Click&nbsp;<strong>Add New Partner</strong>&nbsp;to create one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-white">S No</TableHead>
                  <TableHead className="text-white pl-7">Logo</TableHead>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-right text-white pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((item: any, index: number) => (
                  <TableRow key={item._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {item.logoUrl ? (
                        <div className="relative h-10 w-20" onClick={() => window.open(item.logoUrl, "_blank")}>
                          <Image
                            src={item.logoUrl || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-contain hover:scale-125 transition-all duration-300 cursor-pointer"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-20 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                          No logo
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
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
          title="Delete Partner"
          description={<>Are you sure you want to delete <strong>{deleteItem.title}</strong>? This action cannot be undone.</>}
        />
      )}
    </>
  )
}