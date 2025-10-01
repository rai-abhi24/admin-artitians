import api from "@/lib/api/client";

export type Note = {
    text: string;
    userId: string;
    userEmail?: string;
    createdAt: string;
};

export type Lead = {
    _id: string;
    name: string;
    natureOfBusiness?: string;
    phone?: string;
    companyName: string;
    date: string;
    notes: Note[];
    createdAt: string;
    updatedAt: string;
};

export type CreateLeadRequest = {
    name: string;
    natureOfBusiness?: string;
    phone?: string;
    companyName: string;
};

export type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data?: T;
    errors?: string[];
};

export type LeadsResponse = {
    leads: Lead[];
    pagination: { page: number; limit: number; total: number; pages: number };
};

export function createLead(data: CreateLeadRequest, signal?: AbortSignal) {
    return api.post<ApiResponse<Lead>>("/leads", data, { signal });
}

export function getLeads(params?: { page?: number; limit?: number; search?: string }, signal?: AbortSignal) {
    const sp = new URLSearchParams();
    if (params?.page) sp.set("page", String(params.page));
    if (params?.limit) sp.set("limit", String(params.limit));
    if (params?.search) sp.set("search", params.search);
    const url = sp.toString() ? `/leads?${sp.toString()}` : "/leads";
    return api.get<ApiResponse<LeadsResponse>>(url, { signal });
}

export function getLead(id: string, signal?: AbortSignal) {
    return api.get<ApiResponse<Lead>>(`/leads/${id}`, { signal });
}

export function updateLead(id: string, data: Partial<CreateLeadRequest & { notes: Note[] }>, signal?: AbortSignal) {
    return api.put<ApiResponse<Lead>>(`/leads/${id}`, data, { signal });
}

export function deleteLead(id: string, signal?: AbortSignal) {
    return api.delete<ApiResponse<void>>(`/leads/${id}`, { signal });
}

export function getLeadNotes(id: string, signal?: AbortSignal) {
    return api.get<ApiResponse<Note[]>>(`/leads/${id}/notes`, { signal });
}

export function addLeadNote(id: string, note: string, signal?: AbortSignal) {
    return api.post<ApiResponse<Note[]>>(`/leads/${id}/notes`, { note }, { signal });
}
