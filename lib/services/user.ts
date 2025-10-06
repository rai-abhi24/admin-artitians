import { CreateUserRequest } from "@/types/user";
import { ApiResponse } from "../api-client";
import ApiClient from "../api/client";

export async function createEnquiry(enquiryData: CreateUserRequest, signal?: AbortSignal): Promise<any> {
    return ApiClient.post<any>('/enquiries', enquiryData, { signal });
}

export async function updateEnquiry(id: string, enquiryData: Partial<CreateUserRequest>, signal?: AbortSignal): Promise<any> {
    return ApiClient.put<any>(`/enquiries/${id}`, enquiryData, { signal });
}

export async function deleteEnquiry(id: string, signal?: AbortSignal): Promise<ApiResponse<{ success: boolean }>> {
    return ApiClient.delete<ApiResponse<{ success: boolean }>>(`/enquiries?id=${id}`, { signal });
}

export async function getEnquiries(params?: { search?: string, limit?: number }, signal?: AbortSignal): Promise<any> {
    return ApiClient.get<any>('/enquiries', { params, signal });
}