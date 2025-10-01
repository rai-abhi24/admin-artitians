"use client";

import { useState, useEffect } from "react";
import { Edit, MoreHorizontal, Plus, Trash2, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { createBusinessType, getBusinessTypes, updateBusinessType, deleteBusinessType } from "@/lib/services/business-type";
import { ApiError } from "@/lib/api/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BusinessType {
    _id: string;
    type: string;
    description: string;
    status: string;
}

interface CreateBusinessTypeRequest {
    type: string;
    description: string;
}

export default function BusinessTypesList() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [_error, setError] = useState<string | null>(null);
    const [_success, setSuccess] = useState<string | null>(null);
    const [newType, setNewType] = useState<CreateBusinessTypeRequest>({
        type: "",
        description: "",
    });
    const [editType, setEditType] = useState<BusinessType>({
        _id: "",
        type: "",
        description: "",
        status: "active",
    });

    useEffect(() => {
        const loadBusinessTypes = async (signal?: AbortSignal) => {
            setError(null);
            try {
                const response = await getBusinessTypes(signal);

                if (response.success && response.data) {
                    setBusinessTypes(response.data);
                } else {
                    setError(response.message || 'Failed to load business types');
                }
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError.message || 'Failed to load business types');
            } finally {
                setLoading(false);
            }
        };

        loadBusinessTypes();
    }, []);

    const handleCreateBusinessType = async () => {
        setCreating(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await createBusinessType(newType);

            if (response.success && response.data) {
                setBusinessTypes(prev => [response.data!, ...prev]);
                setNewType({ type: "", description: "" });
                setIsCreateDialogOpen(false);
                setSuccess('Business type created successfully!');
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Failed to create business type');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteBusinessType = async (typeId: string) => {
        if (!confirm('Are you sure you want to delete this business type?')) return;

        try {
            const response = await deleteBusinessType(typeId);

            if (response.success) {
                setBusinessTypes(prev => prev.filter(type => type._id !== typeId));
                setSuccess('Business type deleted successfully!');
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Failed to delete business type');
        }
    };

    const handleEditBusinessType = async () => {
        if (!editType._id) return;

        setUpdating(true);
        setError(null);
        setSuccess(null);

        try {
            // Prepare update data (exclude password if empty)
            const updateData: any = {
                type: editType.type,
                description: editType.description,
                status: editType.status
            };

            const response = await updateBusinessType(editType._id, updateData);

            if (response.success && response.data) {
                setBusinessTypes(prev => prev.map(type =>
                    type._id === editType._id ? response.data! : type
                ));
                setEditType({ _id: "", type: "", description: "", status: "active" });
                setIsEditDialogOpen(false);
                setSuccess('Business type updated successfully!');
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Failed to update business type');
        } finally {
            setUpdating(false);
        }
    };

    const openEditDialog = (t: BusinessType) => {
        console.log(t);

        setEditType({
            _id: t._id,
            type: t.type,
            description: t.description,
            status: t.status,
        });
        setIsEditDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <Card data-testid="card-business-types-table">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Business Types ({businessTypes.length})</span>
                        <Button
                            onClick={() => setIsCreateDialogOpen(true)}
                            data-testid="button-create-business-type"
                            className="py-6"
                        >
                            Add Business Type
                            <Plus className="h-4 w-4" />
                        </Button>
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-primary hover:bg-primary">
                                    <TableHead className="text-white" data-testid="header-serial">S No</TableHead>
                                    <TableHead className="text-white" data-testid="header-business-type">Type</TableHead>
                                    <TableHead className="text-white" data-testid="header-contact">Description</TableHead>
                                    <TableHead className="text-white" data-testid="header-status">Status</TableHead>
                                    <TableHead className="text-white" data-testid="header-actions">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow key={"loading-business-types"}>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : businessTypes.length === 0 ? (
                                    <TableRow key={"no-business-types"}>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No business types found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    businessTypes.map((businessType, index) => (
                                        <TableRow key={`row-business-type-${index}`} className="hover-elevate" data-testid={`row-business-type-${index}`}>
                                            <TableCell data-testid={`cell-serial-${index}`}>
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <div className="font-medium">{index + 1}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell data-testid={`cell-business-type-${index}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="font-medium">{businessType.type}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell data-testid={`cell-role-${index}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="font-medium">{businessType.description}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell data-testid={`cell-status-${index}`}>
                                                <Badge
                                                    className={`${businessType.status === "active"
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                                        : businessType.status === "inactive"
                                                            ? "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                                                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                                        } capitalize`}
                                                >
                                                    {businessType.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell data-testid={`cell-actions-${index}`}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" data-testid={`button-actions-${index}`}>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => openEditDialog(businessType)}
                                                            data-testid={`action-edit-${index}`}
                                                        >
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteBusinessType(businessType._id)}
                                                            className="text-destructive"
                                                            data-testid={`action-delete-${index}`}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Create Business Type Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent data-testid="dialog-create-business-type">
                    <DialogHeader>
                        <DialogTitle data-testid="heading-create-business-type">
                            <UserPlus className="h-5 w-5 mr-2 inline" />
                            Add New Business Type
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="type" data-testid="label-business-type">Type</Label>
                            <Input
                                id="type"
                                placeholder="Enter Business Type"
                                value={newType.type}
                                onChange={(e) => setNewType(prev => ({ ...prev, type: e.target.value }))}
                                data-testid="input-business-type"
                                className="py-6"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="desc" data-testid="label-business-type-email">Description</Label>
                            <Input
                                id="desc"
                                placeholder="Enter Description"
                                value={newType.description}
                                onChange={(e) => setNewType(prev => ({ ...prev, description: e.target.value }))}
                                className="py-6"
                                data-testid="input-business-type-email"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsCreateDialogOpen(false)}
                            data-testid="button-cancel-create-business-type"
                            className="py-6 cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateBusinessType}
                            disabled={!newType.type || creating}
                            data-testid="button-save-business-type"
                            className="py-6 cursor-pointer"
                        >
                            {creating ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Business Type'
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Business Type Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent data-testid="dialog-edit-business-type" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle data-testid="heading-edit-business-type">
                            <Edit className="h-5 w-5 mr-2 inline" />
                            Edit Business Type
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="type" data-testid="label-business-type">Type</Label>
                            <Input
                                id="type"
                                placeholder="Enter Business Type"
                                value={editType.type}
                                onChange={(e) => setEditType(prev => ({ ...prev, type: e.target.value }))}
                                data-testid="input-business-type"
                                className="py-6"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="desc" data-testid="label-business-type-email">Description</Label>
                            <Input
                                id="desc"
                                placeholder="Enter Description"
                                value={editType.description}
                                onChange={(e) => setEditType(prev => ({ ...prev, description: e.target.value }))}
                                className="py-6"
                                data-testid="input-business-type-email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-status" data-testid="label-edit-status">Status</Label>
                            <Select value={editType.status || "active"} onValueChange={(value) => setEditType(prev => ({ ...prev, status: value as "active" | "inactive" }))}>
                                <SelectTrigger className="w-full py-6" data-testid="select-edit-status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-between gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                            data-testid="button-cancel-edit-business-type"
                            className="py-6 cursor-pointer"
                            disabled={updating}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditBusinessType}
                            disabled={!editType.type || updating}
                            data-testid="button-save-edit-business-type"
                            className="py-6 cursor-pointer"
                        >
                            {updating ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update Business Type'
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}