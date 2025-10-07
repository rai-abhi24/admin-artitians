import { ApiResponse } from "../api-client";
import ApiClient from "../api/client";

export async function deleteEnquiry(id: string, signal?: AbortSignal): Promise<ApiResponse<{ success: boolean }>> {
    return ApiClient.delete<ApiResponse<{ success: boolean }>>(`/enquiries?id=${id}`, { signal });
}

export async function getEnquiries(params?: { search?: string, limit?: number }, signal?: AbortSignal): Promise<any> {
    return ApiClient.get<any>('/enquiries', { params, signal });
}

export async function presignUpload(payload: { fileName: string; fileType: string; prefix?: string }) {
    return ApiClient.post<{ ok: boolean; uploadUrl: string; key: string; url: string }>(`/uploads/presign`, payload);
}