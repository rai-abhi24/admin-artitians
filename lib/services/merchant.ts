import ApiClient from "@/lib/api/client";

export async function createMerchant(payload: any) {
    return ApiClient.post<{ ok: boolean; id: string }>(`/merchants`, payload);
}

export async function presignUpload(payload: { fileName: string; fileType: string; prefix?: string }) {
    return ApiClient.post<{ ok: boolean; uploadUrl: string; key: string; url: string }>(`/uploads/presign`, payload);
}

export async function listMerchants() {
    return ApiClient.get<{ ok: boolean; data: any[] }>(`/merchants`);
}

export async function getMerchant(id: string) {
    return ApiClient.get<{ ok: boolean; data: any }>(`/merchants/${id}`);
}

export async function updateMerchant(id: string, payload: any) {
    return ApiClient.patch<{ ok: boolean; data: any }>(`/merchants/${id}`, payload);
}
