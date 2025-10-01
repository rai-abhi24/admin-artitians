import { ApiResponse } from "../api-client";
import ApiClient from "../api/client";

export async function createBusinessType(data: any, signal?: AbortSignal): Promise<any> {
    return ApiClient.post<any>('/business-types', data, { signal });
}

export async function updateBusinessType(id: string, data: any, signal?: AbortSignal): Promise<any> {
    return ApiClient.put<any>(`/business-types/${id}`, data, { signal });
}

export async function deleteBusinessType(id: string, signal?: AbortSignal): Promise<ApiResponse<{ success: boolean }>> {
    return ApiClient.delete<ApiResponse<{ success: boolean }>>(`/business-types/${id}`, { signal });
}

export async function getBusinessTypes(signal?: AbortSignal): Promise<any> {
    return ApiClient.get<any>('/business-types', { signal });
}