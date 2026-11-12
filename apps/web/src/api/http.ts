import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { accessToken } from '@/auth/access-token';

interface ApiEnvelope<T> {
    code: number;
    message: string;
    data: T;
    timestamp: string;
}

interface RefreshResponse {
    accessToken: string;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';
const excludedRefreshPaths = new Set(['/auth/login', '/auth/refresh', '/auth/logout']);

export const apiClient = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
});

const refreshClient = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
});

let refreshPromise: Promise<string> | null = null;

// 每个业务请求发出前，从内存状态读取最新的 Access Token。
apiClient.interceptors.request.use((config) => {
    if (accessToken.value) {
        config.headers.set('Authorization', `Bearer ${accessToken.value}`);
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiEnvelope<unknown>>) => {
        const originalRequest = error.config as
            (InternalAxiosRequestConfig & { hasRetriedAfterRefresh?: boolean }) | undefined;
        const businessCode = error.response?.data?.code;
        const requestPath = originalRequest?.url?.split('?')[0] ?? '';

        if (
            !originalRequest ||
            businessCode !== 40001 ||
            originalRequest.hasRetriedAfterRefresh ||
            excludedRefreshPaths.has(requestPath)
        ) {
            return Promise.reject(error);
        }

        originalRequest.hasRetriedAfterRefresh = true;

        let token: string;

        try {
            // 并发请求共用同一次刷新，避免同时轮换 Refresh Token。
            token = await refreshAccessToken();
        } catch {
            accessToken.value = null;
            return Promise.reject(error);
        }

        // 刷新成功后仅重放一次原请求，防止错误响应造成无限循环。
        originalRequest.headers.set('Authorization', `Bearer ${token}`);
        return apiClient(originalRequest);
    },
);

export async function getApiData<T>(url: string): Promise<T> {
    const response = await apiClient.get<ApiEnvelope<T>>(url);
    return response.data.data;
}

export async function postApiData<T, TBody = undefined>(url: string, body?: TBody): Promise<T> {
    const response = await apiClient.post<ApiEnvelope<T>>(url, body);
    return response.data.data;
}

async function refreshAccessToken(): Promise<string> {
    if (!refreshPromise) {
        // 刷新接口使用独立客户端，避免再次进入业务请求的刷新拦截器。
        refreshPromise = refreshClient
            .post<ApiEnvelope<RefreshResponse>>('/auth/refresh')
            .then((response) => {
                const token = response.data.data.accessToken;
                accessToken.value = token;
                return token;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}
