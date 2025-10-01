"use client";

import { useEffect, useMemo, useState } from "react";
import { Edit, MoreHorizontal, Plus, Search, Trash2, UserPlus, Loader2, MessageCircle, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Note } from "@/lib/services/lead";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Leads() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [_error, setError] = useState<string | null>(null);
    const [_success, setSuccess] = useState<string | null>(null);
    const [newLead, setNewLead] = useState({ name: "", natureOfBusiness: "", phone: "", companyName: "", notes: "" });
    const [newNote, setNewNote] = useState<string>("");
    const [leads, setLeads] = useState<Array<{
        _id: string;
        name: string;
        natureOfBusiness?: string;
        phone?: string;
        companyName: string;
        date?: string;
        createdAt: string;
        notes?: Note[]
    }>>([]);
    const [editLead, setEditLead] = useState<{
        _id: string;
        name: string;
        natureOfBusiness?: string;
        phone?: string;
        companyName: string;
        notes?: Note[]
    }>({ _id: "", name: "", natureOfBusiness: "", phone: "", companyName: "", notes: [] });

    // Notes Modal state
    const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
    const [notesLead, setNotesLead] = useState<{ _id: string; name: string; companyName: string } | null>(null);
    const [notesForLead, setNotesForLead] = useState<Note[]>([]);
    const [notesLoading, setNotesLoading] = useState(false);
    const [notesAdding, setNotesAdding] = useState(false);
    const [notesNewText, setNotesNewText] = useState("");

    useEffect(() => {
        loadLeads();
    }, [searchTerm]);

    async function loadLeads(signal?: AbortSignal) {
        setError(null);
        try {
            const svc = await import("@/lib/services/lead");
            const res = await svc.getLeads({ search: searchTerm || undefined, limit: 100 }, signal);
            if (res.success && res.data) setLeads(res.data.leads as any);
            else setError(res.message || "Failed to load leads");
        } catch (e: any) {
            setError(e.message || "Failed to load leads");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateLead() {
        setCreating(true); setError(null); setSuccess(null);
        try {
            const svc = await import("@/lib/services/lead");
            const res = await svc.createLead(newLead);
            if (res.success && res.data) {
                setLeads(prev => [res.data as any, ...prev]);
                // If an initial note was provided, add it so it's saved with user + timestamp
                const noteText = newLead.notes?.trim();
                if (noteText) {
                    try {
                        const noteRes = await svc.addLeadNote(res.data._id, noteText);
                        if (noteRes.success && noteRes.data) {
                            setLeads(prev => prev.map(l => l._id === res.data!._id ? ({ ...l, notes: noteRes.data as any }) : l));
                        }
                    } catch { }
                }
                setNewLead({ name: "", natureOfBusiness: "", phone: "", companyName: "", notes: "" });
                setIsCreateDialogOpen(false);
                setSuccess("Lead created successfully!");
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError(res.message || "Failed to create lead");
                if ((res as any).errors) setError((res as any).errors.join(', '));
            }
        } catch (e: any) {
            setError(e.message || "Failed to create lead");
        } finally { setCreating(false); }
    }

    async function handleDeleteLead(id: string) {
        if (!confirm("Delete this lead?")) return;
        try {
            const svc = await import("@/lib/services/lead");
            const res = await svc.deleteLead(id);
            if (res.success) {
                setLeads(prev => prev.filter(l => l._id !== id));
                setSuccess("Lead deleted successfully!");
                setTimeout(() => setSuccess(null), 3000);
            } else setError(res.message || "Failed to delete lead");
        } catch (e: any) { setError(e.message || "Failed to delete lead"); }
    }

    async function handleUpdateLead() {
        if (!editLead._id) return;
        setUpdating(true); setError(null); setSuccess(null);
        try {
            const svc = await import("@/lib/services/lead");
            const res = await svc.updateLead(editLead._id, { name: editLead.name, natureOfBusiness: editLead.natureOfBusiness, phone: editLead.phone, companyName: editLead.companyName });
            if (res.success && res.data) {
                setLeads(prev => prev.map(l => l._id === editLead._id ? res.data as any : l));
                setIsEditDialogOpen(false);
                setSuccess("Lead updated successfully!");
                setTimeout(() => setSuccess(null), 3000);
            } else setError(res.message || "Failed to update lead");
        } catch (e: any) { setError(e.message || "Failed to update lead"); }
        finally { setUpdating(false); }
    }

    async function openEditDialog(lead: any) {
        setEditLead({ _id: lead._id, name: lead.name, natureOfBusiness: lead.natureOfBusiness, phone: lead.phone, companyName: lead.companyName, notes: (lead.notes || []) as Note[] });
        setIsEditDialogOpen(true);
        try {
            const svc = await import("@/lib/services/lead");
            const res = await svc.getLeadNotes(lead._id);
            if (res.success && res.data) setEditLead(prev => ({ ...prev, notes: res.data! as Note[] }));
        } catch { }
    }

    function formatRelativeTime(dateInput?: string) {
        if (!dateInput) return "";
        const date = new Date(dateInput);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const sec = Math.floor(diffMs / 1000);
        const min = Math.floor(sec / 60);
        const hr = Math.floor(min / 60);
        const day = Math.floor(hr / 24);
        if (sec < 45) return "just now";
        if (sec < 90) return "1 minute ago";
        if (min < 45) return `${min} minutes ago`;
        if (min < 90) return "1 hour ago";
        if (hr < 24) return `${hr} hours ago`;
        if (hr < 36) return "1 day ago";
        if (day < 30) return `${day} days ago`;
        const months = Math.floor(day / 30);
        if (months < 18) return `${months} month${months === 1 ? "" : "s"} ago`;
        const years = Math.floor(day / 365);
        return `${years} year${years === 1 ? "" : "s"} ago`;
    }

    async function handleOpenNotesModal(lead: any) {
        setNotesLead({ _id: lead._id, name: lead.name, companyName: lead.companyName });
        setIsNotesDialogOpen(true);
        setNotesLoading(true);
        try {
            const svc = await import("@/lib/services/lead");
            const res = await svc.getLeadNotes(lead._id);
            if (res.success && res.data) setNotesForLead(res.data);
            else setNotesForLead(lead.notes || []);
        } catch {
            setNotesForLead(lead.notes || []);
        } finally {
            setNotesLoading(false);
        }
    }

    function handleCloseNotesModal() {
        setIsNotesDialogOpen(false);
        setNotesLead(null);
        setNotesForLead([]);
        setNotesNewText("");
        setNotesAdding(false);
        setNotesLoading(false);
    }

    async function handleAddNoteToLead() {
        if (!notesLead?._id || !notesNewText.trim()) return;
        setNotesAdding(true);
        try {
            const svc = await import("@/lib/services/lead");
            const res = await svc.addLeadNote(notesLead._id, notesNewText.trim());
            if (res.success && res.data) {
                setNotesForLead(res.data);
                setLeads(prev => prev.map(l => l._id === notesLead._id ? ({ ...l, notes: res.data! }) as any : l));
                setNotesNewText("");
            }
        } catch {
        } finally {
            setNotesAdding(false);
        }
    }

    const filteredLeads = useMemo(() => leads, [leads]);

    return (
        <div className="space-y-6">
            {/* Search */}
            <div className="flex items-center justify-between">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search leads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 py-6"
                        data-testid="input-search-leads"
                    />
                </div>

                <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    data-testid="button-create-lead"
                    className="py-6"
                >
                    Add Lead
                    <Plus className="h-4 w-4 cursor-pointer" />
                </Button>
            </div>

            {/* Alerts */}
            {/* {error && (<Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>)}
            {success && (<Alert className="border-green-200 bg-green-50 text-green-800"><AlertDescription>{success}</AlertDescription></Alert>)} */}

            {/* Leads Table */}
            <Card data-testid="card-leads-table">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Leads ({filteredLeads.length})</span>
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-primary hover:bg-primary">
                                    <TableHead className="text-white" data-testid="header-serial">S No</TableHead>
                                    <TableHead className="text-white" data-testid="header-lead">Name</TableHead>
                                    <TableHead className="text-white" data-testid="header-contact">Contact</TableHead>
                                    <TableHead className="text-white" data-testid="header-company">Company</TableHead>
                                    <TableHead className="text-white" data-testid="header-company">Nature of Business</TableHead>
                                    <TableHead className="text-white" data-testid="header-date">Date</TableHead>
                                    <TableHead className="text-white" data-testid="header-date">Notes</TableHead>
                                    <TableHead className="text-white" data-testid="header-actions">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                                ) : filteredLeads.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No leads found</TableCell></TableRow>
                                ) : filteredLeads.map((lead, index) => (
                                    <TableRow key={lead._id} className="hover-elevate" data-testid={`row-lead-${lead._id}`}>
                                        <TableCell data-testid={`cell-serial-${index}`}>
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <div className="font-medium">{index + 1}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell data-testid={`cell-lead-${lead._id}`}>
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <div className="font-medium">{lead.name}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell data-testid={`cell-contact-${lead._id}`}>
                                            <div className="space-y-1">
                                                {lead.phone && <div className="text-xs text-muted-foreground">{lead.phone}</div>}
                                            </div>
                                        </TableCell>
                                        <TableCell data-testid={`cell-company-${lead._id}`}>
                                            <Badge variant="outline">{lead.companyName}</Badge>
                                        </TableCell>
                                        <TableCell data-testid={`cell-nature-of-business-${lead._id}`}>
                                            <p>{lead.natureOfBusiness || "-"}</p>
                                        </TableCell>
                                        <TableCell data-testid={`cell-date-${lead._id}`}>
                                            {new Date((lead as any).date || lead.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell data-testid={`cell-notes-${lead._id}`}>
                                            <div className="relative" onClick={() => handleOpenNotesModal(lead)}>
                                                <div className={`absolute text-xs bg-red-600 ${(lead.notes || []).length > 99 ? "w-6 h-6 -top-3 left-7" : "h-5 w-5 -top-2 left-7"} rounded-full flex items-center justify-center cursor-pointer`}>
                                                    {(lead.notes || []).length > 99
                                                        ? <p className="text-white font-bold">+{99}</p>
                                                        : <p className="text-white font-bold">{(lead.notes || []).length}</p>
                                                    }
                                                </div>
                                                <MessageSquareText className="h-[25px] w-[25px] ml-3 cursor-pointer" />
                                            </div>
                                        </TableCell>
                                        <TableCell data-testid={`cell-actions-${lead._id}`}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" data-testid={`button-actions-${lead._id}`}>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditDialog(lead)} data-testid={`action-edit-${lead._id}`}>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {/* <DropdownMenuItem onClick={() => handleDeleteLead(lead._id)} className="text-destructive" data-testid={`action-delete-${lead._id}`}>
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem> */}
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

            {/* Create Lead Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent data-testid="dialog-create-lead">
                    <DialogHeader>
                        <DialogTitle data-testid="heading-create-lead">
                            <UserPlus className="h-5 w-5 mr-2 inline" />
                            Add New Lead
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" data-testid="label-lead-name">Full Name<span className="text-red-500">*</span></Label>
                            <Input id="name" placeholder="Enter lead's full name" value={newLead.name} onChange={(e) => setNewLead(prev => ({ ...prev, name: e.target.value }))} data-testid="input-lead-name" className="py-6" />
                        </div>
                        <div className="space-y-2">
                            <Label data-testid="label-lead-nature-of-business">Nature of Business <span className="text-red-500">*</span></Label>
                            <Select value={newLead.natureOfBusiness || ""} onValueChange={(value) => setNewLead(prev => ({ ...prev, natureOfBusiness: value }))}>
                                <SelectTrigger className="mt-1.5 py-6 w-full">
                                    <SelectValue placeholder="Select Nature of Business" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Lodging">Lodging</SelectItem>
                                    <SelectItem value="Business Services">Business Services</SelectItem>
                                    <SelectItem value="Agriculture Services">Agriculture Services</SelectItem>
                                    <SelectItem value="Contracted Services">Contracted Services</SelectItem>
                                    <SelectItem value="Airlines">Airlines</SelectItem>
                                    <SelectItem value="Car Rental">Car Rental</SelectItem>
                                    <SelectItem value="Transportation Services">Transportation Services</SelectItem>
                                    <SelectItem value="Utility Services">Utility Services</SelectItem>
                                    <SelectItem value="Retail Outlet Services">Retail Outlet Services</SelectItem>
                                    <SelectItem value="Clothing Stores">Clothing Stores</SelectItem>
                                    <SelectItem value="Miscellaneous Stores">Miscellaneous Stores</SelectItem>
                                    <SelectItem value="Government Services">Government Services</SelectItem>
                                    <SelectItem value="Professional Services and Membership Organizations">Professional Services and Membership Organizations</SelectItem>
                                    <SelectItem value="all_category">All Category</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" data-testid="label-lead-phone">Phone <span className="text-red-500">*</span></Label>
                            {/* <Input id="phone" placeholder="Enter phone number" value={newLead.phone || ""} onChange={(e) => setNewLead(prev => ({ ...prev, phone: e.target.value }))} data-testid="input-lead-phone" className="py-6" /> */}
                            <Input id="phone" inputMode="numeric" pattern="^[6-9][0-9]{9}$" maxLength={10} data-testid="input-lead-phone" className="py-6" value={newLead.phone || ""} onChange={(e) => setNewLead((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, "") }))} placeholder="Enter 10-digit Mobile Number" aria-invalid={!!newLead.phone && !/^[6-9][0-9]{9}$/.test(newLead.phone)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company" data-testid="label-lead-company">Company Name <span className="text-red-500">*</span></Label>
                            <Input id="company" placeholder="Enter company name" value={newLead.companyName} onChange={(e) => setNewLead(prev => ({ ...prev, companyName: e.target.value }))} data-testid="input-lead-company" className="py-6" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company" data-testid="label-lead-company">Note <span className="text-red-500">*</span></Label>
                            <Input placeholder="Add a note..." value={newLead.notes} onChange={(e) => setNewLead(prev => ({ ...prev, notes: e.target.value }))} className="py-6" data-testid="input-new-note" />
                        </div>
                    </div>
                    <div className="flex justify-between gap-2">
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} data-testid="button-cancel-create-lead" className="py-6 cursor-pointer">Cancel</Button>
                        <Button onClick={handleCreateLead} disabled={!newLead.name || !newLead.companyName || creating} data-testid="button-save-lead" className="py-6 cursor-pointer">
                            {creating ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating...</>) : "Create Lead"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Lead Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent data-testid="dialog-edit-lead">
                    <DialogHeader>
                        <DialogTitle data-testid="heading-edit-lead">
                            <Edit className="h-5 w-5 mr-2 inline" />
                            Edit Lead
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name" data-testid="label-edit-name">Full Name <span className="text-red-500">*</span></Label>
                            <Input id="edit-name" value={editLead.name} onChange={(e) => setEditLead(prev => ({ ...prev, name: e.target.value }))} className="py-6" data-testid="input-edit-name" />
                        </div>
                        <div className="space-y-2">
                            <Label data-testid="label-edit-natureOfBusiness">Nature of Business <span className="text-red-500">*</span></Label>
                            {/* <Input id="edit-email" type="email" value={editLead.natureOfBusiness || ""} onChange={(e) => setEditLead(prev => ({ ...prev, email: e.target.value }))} className="py-6" data-testid="input-edit-email" /> */}
                            <Select value={editLead.natureOfBusiness || ""} onValueChange={(value) => setNewLead(prev => ({ ...prev, natureOfBusiness: value }))}>
                                <SelectTrigger className="mt-1.5 py-6 w-full">
                                    <SelectValue placeholder="Select Nature of Business" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Lodging">Lodging</SelectItem>
                                    <SelectItem value="Business Services">Business Services</SelectItem>
                                    <SelectItem value="Agriculture Services">Agriculture Services</SelectItem>
                                    <SelectItem value="Contracted Services">Contracted Services</SelectItem>
                                    <SelectItem value="Airlines">Airlines</SelectItem>
                                    <SelectItem value="Car Rental">Car Rental</SelectItem>
                                    <SelectItem value="Transportation Services">Transportation Services</SelectItem>
                                    <SelectItem value="Utility Services">Utility Services</SelectItem>
                                    <SelectItem value="Retail Outlet Services">Retail Outlet Services</SelectItem>
                                    <SelectItem value="Clothing Stores">Clothing Stores</SelectItem>
                                    <SelectItem value="Miscellaneous Stores">Miscellaneous Stores</SelectItem>
                                    <SelectItem value="Government Services">Government Services</SelectItem>
                                    <SelectItem value="Professional Services and Membership Organizations">Professional Services and Membership Organizations</SelectItem>
                                    <SelectItem value="all_category">All Category</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-phone" data-testid="label-edit-phone">Phone <span className="text-red-500">*</span></Label>
                            <Input id="edit-phone" value={editLead.phone || ""} onChange={(e) => setEditLead(prev => ({ ...prev, phone: e.target.value }))} className="py-6" data-testid="input-edit-phone" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-company" data-testid="label-edit-company">Company Name <span className="text-red-500">*</span></Label>
                            <Input id="edit-company" value={editLead.companyName} onChange={(e) => setEditLead(prev => ({ ...prev, companyName: e.target.value }))} className="py-6" data-testid="input-edit-company" />
                        </div>
                        {/* <div className="space-y-2">
                            <Label data-testid="label-notes">Notes <span className="text-red-500">*</span></Label>
                            <div className="max-h-40 overflow-auto rounded-md border p-3 space-y-2 bg-muted/30" data-testid="notes-list">
                                {(editLead.notes || []).length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No notes yet.</p>
                                ) : (
                                    (editLead.notes || []).map((n, i) => {
                                        const author = n.userEmail || (n.userId ? `${n.userId.slice(0, 6)}…` : "");
                                        const when = n.createdAt ? new Date(n.createdAt).toLocaleString() : "";
                                        return (
                                            <div key={`note-${i}`} className="p-2 rounded bg-background border">
                                                <div className="text-sm">{n.text}</div>
                                                <div className="text-xs text-muted-foreground mt-1">{author && `by ${author}`} {when && `on ${when}`}</div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            <div className="flex gap-2 mt-2">
                                <Input placeholder="Add a note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} className="py-6" data-testid="input-new-note" />
                                <Button
                                    onClick={async () => {
                                        if (!newNote.trim() || !editLead._id) return;
                                        try {
                                            const svc = await import("@/lib/services/lead");
                                            const res = await svc.addLeadNote(editLead._id, newNote.trim());
                                            if (res.success && res.data) {
                                                setEditLead(prev => ({ ...prev, notes: res.data! }));
                                                setLeads(prev => prev.map(l => l._id === editLead._id ? ({ ...l, notes: res.data! }) : l));
                                                setNewNote("");
                                            }
                                        } catch { }
                                    }}
                                    disabled={!newNote.trim()}
                                    className="py-6"
                                    data-testid="button-add-note"
                                >
                                    Add
                                </Button>
                            </div>
                        </div> */}
                    </div>
                    <div className="flex justify-between gap-2">
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="py-6 cursor-pointer" data-testid="button-cancel-edit-lead" disabled={updating}>Cancel</Button>
                        <Button onClick={handleUpdateLead} className="py-6 cursor-pointer" data-testid="button-save-edit-lead" disabled={!editLead.name || !editLead.companyName || updating}>
                            {updating ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Updating...</>) : "Update Lead"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Notes Dialog */}
            <Dialog open={isNotesDialogOpen} onOpenChange={(open) => open ? setIsNotesDialogOpen(true) : handleCloseNotesModal()}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MessageSquareText className="h-5 w-5" />
                                <span>Notes {notesLead ? `for ${notesLead.name}` : ""}</span>
                                <Badge variant="default" className="ml-2">{notesForLead.length}</Badge>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="max-h-80 overflow-auto rounded-md border bg-muted/20">
                            {notesLoading ? (
                                <div className="flex items-center justify-center py-10 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin mr-2" />Loading notes…</div>
                            ) : notesForLead.length === 0 ? (
                                <div className="p-4 text-sm text-muted-foreground">No notes yet.</div>
                            ) : (
                                <div className="divide-y">
                                    {notesForLead.map((n, i) => {
                                        console.log(n);

                                        const author = n.userEmail || (n.userId ? `${n.userId.slice(0, 6)}…` : "");
                                        const when = n.createdAt ? new Date(n.createdAt).toLocaleString() : "";
                                        return (
                                            <div key={`lead-notes-${i}`} className="p-4 flex gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>{(author || "?").slice(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm leading-5">{n.text}</div>
                                                    <div className="text-xs text-muted-foreground mt-1" title={when}>{author && `by ${author}`} {n.createdAt && `• ${formatRelativeTime(n.createdAt)}`}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Input placeholder="Add a note..." value={notesNewText} onChange={(e) => setNotesNewText(e.target.value)} className="py-6" />
                            <Button onClick={handleAddNoteToLead} disabled={!notesNewText.trim() || notesAdding} className="py-6">
                                {notesAdding ? (<><Loader2 className="h-4 w-4 animate-spin" />Adding…</>) : "Add"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
