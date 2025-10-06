"use client";

import { useState, useEffect } from "react";
import { MoreHorizontal, Search, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getEnquiries, deleteEnquiry } from "@/lib/services/user";
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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IEnquiry } from "@/models/Enquiry";
import { DeleteDialog } from "@/components/delete-dialog";

export default function EnquiryList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [enquiries, setEnquiries] = useState<IEnquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [_error, setError] = useState<string | null>(null);
    const [_success, setSuccess] = useState<string | null>(null);
    const [deleteItem, setDeleteItem] = useState<IEnquiry | null>(null);
    const loadEnquiries = async (signal?: AbortSignal) => {
        setError(null);
        try {
            const response = await getEnquiries({
                search: searchTerm || undefined,
                limit: 100
            }, signal);

            if (response.success && response.data) {
                setEnquiries(response.data.enquiries);
            } else {
                setError(response.message || 'Failed to load enquiries');
            }
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Failed to load enquiries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEnquiries();
    }, [searchTerm]);

    const handleDeleteEnquiry = async (enquiryId: string) => {
        if (!confirm('Are you sure you want to delete this enquiry?')) return;

        try {
            const response = await deleteEnquiry(enquiryId);

            if (response.success) {
                setEnquiries(prev => prev.filter(enquiry => enquiry._id !== enquiryId));
                setSuccess('Enquiry deleted successfully!');
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError(response.message || 'Failed to delete enquiry');
            }
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Failed to delete enquiry');
        }
    };

    const formatDate = (dateString: Date) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search enquiries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 py-6 w-80"
                            data-testid="input-search-enquiries"
                        />
                    </div>
                </div>

                <Card data-testid="card-enquiries-table">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Enquiries ({enquiries.length})</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-primary hover:bg-primary">
                                        <TableHead className="text-white" data-testid="header-serial">S No</TableHead>
                                        <TableHead className="text-white" data-testid="header-user">Name</TableHead>
                                        <TableHead className="text-white" data-testid="header-contact">Contact</TableHead>
                                        <TableHead className="text-white" data-testid="header-contact">WhatsApp</TableHead>
                                        <TableHead className="text-white" data-testid="header-status">Status</TableHead>
                                        <TableHead className="text-white" data-testid="header-created">Date</TableHead>
                                        <TableHead className="text-white" data-testid="header-actions">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow key={"loading-enquiries"}>
                                            <TableCell colSpan={8} className="text-center py-8">
                                                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                                <p className="mt-2 text-muted-foreground">Loading enquiries...</p>
                                            </TableCell>
                                        </TableRow>
                                    ) : enquiries.length === 0 ? (
                                        <TableRow key={"no-enquiries"}>
                                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                                No enquiries found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        enquiries.map((user, index) => (
                                            <TableRow key={`row-user-${index}`} className="hover-elevate" data-testid={`row-user-${index}`}>
                                                <TableCell data-testid={`cell-serial-${index}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <div className="font-medium">{index + 1}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell data-testid={`cell-user-${index}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <div className="font-medium">{user.name}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell data-testid={`cell-contact-${index}`}>
                                                    <div className="space-y-1">
                                                        <div className="text-xs text-muted-foreground">{user.phone}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell data-testid={`cell-wp-${index}`}>
                                                    <div className="text-sm pl-1">{user.sendWhatsAppUpdate ? "Yes" : "No"}</div>
                                                </TableCell>
                                                <TableCell data-testid={`cell-status-${index}`}>
                                                    <div className="text-sm capitalize pl-1">{user.status}</div>
                                                </TableCell>
                                                <TableCell data-testid={`cell-created-${index}`}>
                                                    <div className="text-sm">{formatDate(user.createdAt)}</div>
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
                                                                onClick={() => setDeleteItem(user)}
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
            </div>

            {deleteItem && (
                <DeleteDialog
                    open={!!deleteItem}
                    onClose={() => setDeleteItem(null)}
                    onConfirm={() => {
                        handleDeleteEnquiry(deleteItem._id as any)
                        setDeleteItem(null)
                    }}
                    title="Delete Enquiry"
                    description={<>Are you sure you want to delete <strong>{deleteItem.name}</strong>? This action cannot be undone.</>}
                />
            )}
        </>
    );
}