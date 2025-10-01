import ApiClient from "../api/client";

export async function getDashboardData(params?: { search?: string, limit?: number }, signal?: AbortSignal) {
    return ApiClient.get('/dashboard', { params, signal });
}