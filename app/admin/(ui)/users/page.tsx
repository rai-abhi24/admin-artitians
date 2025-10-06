"use client"

import { AdminUsersTable } from "@/components/admin-users-table";
import { useState } from "react"
import { Header } from "@/components/header"
import { AdminUsersDialog } from "@/components/admin-users-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AdminUsersPage() {
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
            <Header title="Admin Users" description="Manage administrator accounts." />
            <div className="flex-1 space-y-6 p-6">
                <div className="flex items-center justify-end">
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Admin
                    </Button>
                </div>

                <AdminUsersTable onEdit={handleEdit} />
                <AdminUsersDialog open={isDialogOpen} onClose={handleClose} editItem={editItem} />
            </div>
        </div>
    )
}