import { CreateUserRequest } from "@/types/user";
import { ApiResponse } from "../api-client";
import ApiClient from "../api/client";

export async function createUser(userData: CreateUserRequest, signal?: AbortSignal): Promise<any> {
    return ApiClient.post<any>('/users', userData, { signal });
}

export async function updateUser(id: string, userData: Partial<CreateUserRequest>, signal?: AbortSignal): Promise<any> {
    return ApiClient.put<any>(`/users/${id}`, userData, { signal });
}

export async function deleteEnquiry(id: string, signal?: AbortSignal): Promise<ApiResponse<{ success: boolean }>> {
    return ApiClient.delete<ApiResponse<{ success: boolean }>>(`/users/${id}`, { signal });
}

export async function getEnquiries(params?: { search?: string, limit?: number }, signal?: AbortSignal): Promise<any> {
    return ApiClient.get<any>('/enquiries', { params, signal });
}