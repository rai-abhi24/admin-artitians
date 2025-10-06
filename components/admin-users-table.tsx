"use client"

import useSWR from "swr"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Loader2 } from "lucide-react"
import { DeleteDialog } from "./delete-dialog"
import { useToast } from "@/hooks/use-toast"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface PartnersTableProps {
  onEdit: (item: any) => void
}

export function AdminUsersTable({ onEdit }: PartnersTableProps) {
  const { toast } = useToast()
  const [deleteItem, setDeleteItem] = useState<any>(null)

  const { data, error, isLoading, mutate } = useSWR("/api/admin/users", fetcher)

  const users = data?.data || []

  const handleDelete = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")

      mutate()
      toast({ title: "Success", description: "User deleted successfully" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete user", variant: "destructive" })
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
          {users.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
              No admin users yet. Click&nbsp;<strong>Add Admin</strong>&nbsp;to create one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-white">S No</TableHead>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Role</TableHead>
                  <TableHead className="text-white">Created At</TableHead>
                  <TableHead className="text-right text-white pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((item: any, index: number) => (
                  <TableRow key={item._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="font-medium">{item.email}</TableCell>
                    <TableCell>
                      <Badge variant={"default"} className="capitalize">
                        {item.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{new Date(item.createdAt).toLocaleDateString("en-IN")}</TableCell>
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
          title="Delete Admin"
          description={<>Are you sure you want to delete <strong>{deleteItem.name}</strong>? This action cannot be undone.</>}
        />
      )}
    </>
  )
}