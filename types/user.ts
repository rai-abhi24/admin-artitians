export type UserRole = "admin" | "employee";
export type UserStatus = "active" | "inactive" | "suspended";

export type CreateUserRequest = {
    name: string;
    email: string;
    phone?: string;
    password: string;
    businessType: [];
    role?: UserRole;
};

export type User = {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    businessType: [];
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
}

export interface UsersResponse {
    users: User[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}