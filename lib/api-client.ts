import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
  isNetworkError?: boolean;
}

class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;
  private baseURL: string;

  private constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token");
          if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
          }
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Response interceptor
    // this.axiosInstance.interceptors.response.use(
    //   (response: AxiosResponse) => response,
    //   (error: any) => {
    //     if (error.response?.status === 401) {
    //       localStorage.removeItem('token');
    //       localStorage.removeItem('user');
    //       window.location.href = '/';
    //     }
    //     return Promise.reject(error);
    //   }
    // );
  }

  private handleError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      return {
        message:
          (error.response?.data as any)?.message ||
          error.message ||
          "Request failed",
        status: error.response?.status,
        data: error.response?.data,
        isNetworkError: !error.response,
      };
    }

    return {
      message: (error as Error)?.message || "Unknown error",
      status: 500,
    };
  }

  public async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      console.log("data",data);
      const response = await this.axiosInstance.post<T>(url, data, config);
      console.log("response",response);
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export const apiClient = ApiClient.getInstance();

// User service functions
export interface CreateUserRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: "employee" | "admin";
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "employee" | "admin";
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
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

export const userService = {
  // Create a new user
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    return apiClient.post<ApiResponse<User>>('/users', userData);
  },

  // Get all users with pagination and filters
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }): Promise<ApiResponse<UsersResponse>> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.role) searchParams.set('role', params.role);
    if (params?.status) searchParams.set('status', params.status);

    const queryString = searchParams.toString();
    const url = queryString ? `/users?${queryString}` : '/users';
    
    return apiClient.get<ApiResponse<UsersResponse>>(url);
  },

  // Get user by ID
  async getUserById(id: string): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>(`/users/${id}`);
  },

  // Update user
  async updateUser(id: string, userData: Partial<CreateUserRequest>): Promise<ApiResponse<User>> {
    return apiClient.put<ApiResponse<User>>(`/users/${id}`, userData);
  },

  // Delete user
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/users/${id}`);
  }
};