"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, Edit, MoreHorizontal, Eye, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
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
import MerchantDetailsDialog from "./MerchantDetailsDialog";
import { useRouter } from "next/navigation";
import { listMerchants, updateMerchant, getMerchant } from "@/lib/services/merchant";
import { useUser } from "@/contexts/user-context";

type MerchantStatus = "pending" | "processing" | "onboarded" | "rejected" | "approved";

type Merchant = any;

const MerchantList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useUser();

    // Initialize status filter from URL params
    useEffect(() => {
        const status = searchParams.get("status");
        if (status && ["pending", "processing", "onboarded", "approved", "rejected"].includes(status)) {
            setStatusFilter(status);
        } else {
            setStatusFilter("all");
        }
    }, [searchParams]);

    const [merchants, setMerchants] = useState<Merchant[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [details, setDetails] = useState<any | null>(null);

    useEffect(() => {
        let ignore = false;
        async function load() {
            try {
                setLoading(true);
                const res = await listMerchants();
                if (!ignore) setMerchants((res as any).data || []);
            } catch (e: any) {
                if (!ignore) setError(e?.message || "Failed to load merchants");
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        load();
        return () => { ignore = true };
    }, []);

    const getStatusColor = (status: MerchantStatus) => {
        switch (status) {
            case "pending": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 capitalize";
            case "processing": return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 capitalize";
            case "onboarded": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 capitalize";
            case "approved": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 capitalize";
            case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 capitalize";
        }
    };

    const handleStatusUpdate = async (merchantId: string, newStatus: MerchantStatus) => {
        const prev = merchants.find((m) => m._id === merchantId);
        if (!prev) return;

        setMerchants((prevMerchants) =>
            prevMerchants.map((m) =>
                m._id === merchantId ? { ...m, status: newStatus } : m
            )
        );

        try {
            await updateMerchant(merchantId, JSON.stringify({ status: newStatus }));
        } catch (error) {
            console.error("Failed to update status:", error);

            setMerchants((prevMerchants) =>
                prevMerchants.map((m) =>
                    m._id === merchantId ? { ...m, status: prev.status } : m
                )
            );
            alert("Failed to update status. Please try again.");
        }
    };

    const filteredMerchants = useMemo(() => {
        return merchants.filter(merchant => {
            const matchesSearch = searchTerm === "" ||
                (merchant.business?.brandName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (merchant.business?.legalName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (merchant.personal?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (merchant.personal?.email?.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesStatus = statusFilter === "all" || merchant.status === statusFilter.toLowerCase();

            return matchesSearch && matchesStatus;
        });
    }, [merchants, searchTerm, statusFilter]);

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value);
        // Update URL with status filter
        const url = new URL(window.location.href);
        if (value === "all") {
            url.searchParams.delete("status");
        } else {
            url.searchParams.set("status", value.toLowerCase());
        }
        router.push(url.pathname + url.search);
    };

    const getStatusOptions = (merchantId: string): MerchantStatus[] => {
        const merchant = merchants.find((m) => m._id === merchantId);
        if (!merchant) return [];

        switch (merchant.status) {
            case "pending": return ["processing", "approved", "rejected", "onboarded"];
            case "processing": return ["onboarded", "approved", "rejected"];
            case "onboarded": return ["approved", "rejected"];
        }

        return [];
    }

    function isNonEmpty(value: any) {
        return value !== undefined && value !== null && String(value).trim() !== "";
    }

    async function openDetailsDialog(merchantId: string) {
        setDetailsOpen(true);
        setDetailsLoading(true);
        setDetails(null);
        try {
            const res = await getMerchant(merchantId);
            setDetails((res as any).data || null);
        } catch (e) { }
        finally { setDetailsLoading(false); }
    }

    function InfoRow({ label, value }: { label: string; value?: any }) {
        if (!isNonEmpty(value)) return null;
        return (
            <div className="flex flex-col">
                <span className="text-[11px] text-muted-foreground">{label}</span>
                <span className="text-sm break-words">{String(value)}</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search merchants..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 py-6 max-w-[250px]"
                        data-testid="input-search-merchants"
                    />
                </div>
                <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                    <SelectTrigger className="w-full sm:w-[180px] py-6" data-testid="select-status-filter">
                        <Filter className="h-4 w-4" />
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="onboarded">Onboarded</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    onClick={() => {
                        router.push("/merchants/create");
                    }}
                    data-testid="button-create-merchant"
                    className="py-6 cursor-pointer text-[15px] pl-40"
                >
                    Add Merchant
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            {/* Merchants Table */}
            <Card data-testid="card-merchants-table">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Merchants ({filteredMerchants.length})</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-primary hover:bg-primary">
                                    <TableHead className="text-white" data-testid="header-serial">S No</TableHead>
                                    <TableHead className="text-white" data-testid="header-business-name">Business Name</TableHead>
                                    <TableHead className="text-white" data-testid="header-contact">Contact</TableHead>
                                    <TableHead className="text-white" data-testid="header-type">Business Type</TableHead>
                                    <TableHead className="text-white" data-testid="header-status">Status</TableHead>
                                    <TableHead className="text-white" data-testid="header-created">Created</TableHead>
                                    <TableHead className="text-white" data-testid="header-actions">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMerchants.map((merchant: any, index) => (
                                    <TableRow key={merchant._id} className="hover-elevate" data-testid={`row-merchant-${merchant._id}`}>
                                        <TableCell className="font-medium" data-testid={`cell-name-${merchant.id}`}>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="font-medium" data-testid={`cell-name-${merchant.id}`}>
                                            {merchant.business?.legalName || "-"}
                                        </TableCell>
                                        <TableCell data-testid={`cell-contact-${merchant.id}`}>
                                            <div className="space-y-1">
                                                <div className="text-sm font-medium">{merchant.personal?.name || "-"}</div>
                                                <div className="text-xs text-muted-foreground">{merchant.personal?.email || "-"}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell data-testid={`cell-type-${merchant.id}`}>
                                            <Badge variant="outline" className="capitalize">{(merchant.businessEntityType.split("_").join(" ")) || "-"}</Badge>
                                        </TableCell>
                                        <TableCell data-testid={`cell-status-${merchant.id}`}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Badge className={`${getStatusColor(merchant.status)} border border-gray-300 cursor-pointer hover:scale-110 transition-all ease-linear duration-200`}>
                                                        {merchant.status}
                                                    </Badge>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start">
                                                    {(getStatusOptions(merchant._id)).map(s => (
                                                        <DropdownMenuItem key={s} onClick={() => handleStatusUpdate(merchant._id, s)} className="capitalize">
                                                            {s}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                        <TableCell data-testid={`cell-created-${merchant.id}`}>
                                            {merchant.createdAt ? new Date(merchant.createdAt).toLocaleDateString() : "-"}
                                        </TableCell>
                                        <TableCell data-testid={`cell-actions-${merchant.id}`}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" data-testid={`button-actions-${merchant.id}`}>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            router.push(`/merchants/edit/${merchant._id}`);
                                                        }}
                                                        data-testid={`action-edit-${merchant.id}`}
                                                    >
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => openDetailsDialog(merchant._id)}
                                                        data-testid={`action-view-${merchant.id}`}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* View Details Dialog */}
            <MerchantDetailsDialog open={detailsOpen} onOpenChange={setDetailsOpen} details={details} loading={detailsLoading} />
        </div>
    );
};

export default MerchantList;