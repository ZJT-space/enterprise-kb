import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { accessToken } from '@/auth/access-token';
import { getApiData, postApiData } from '@/api/http';

export interface AuthUser {
    id: string;
    username: string;
    email: string;
    nickname: string;
    mustChangePassword: boolean;
}

interface LoginResponse {
    accessToken: string;
    user: AuthUser;
}

interface CurrentUserResponse {
    user: AuthUser;
}

interface RefreshResponse {
    accessToken: string;
}

type AuthStatus = 'initializing' | 'authenticated' | 'anonymous' | 'error';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<AuthUser | null>(null);
    const status = ref<AuthStatus>('initializing');
    const isAuthenticated = computed(() => status.value === 'authenticated');

    // 请求刷新失败并清空 Access Token 时，同步清除前端登录状态。
    watch(accessToken, (token) => {
        if (!token && status.value === 'authenticated') {
            user.value = null;
            status.value = 'anonymous';
        }
    });

    async function restoreSession(): Promise<void> {
        status.value = 'initializing';

        try {
            // 先用 HttpOnly Cookie 换取 Access Token，再请求当前用户资料。
            const refreshed = await postApiData<RefreshResponse>('/auth/refresh');
            accessToken.value = refreshed.accessToken;

            const currentUser = await getApiData<CurrentUserResponse>('/auth/me');
            user.value = currentUser.user;
            status.value = 'authenticated';
        } catch {
            accessToken.value = null;
            user.value = null;
            status.value = 'anonymous';
        }
    }

    async function login(identifier: string, password: string): Promise<void> {
        const result = await postApiData<LoginResponse, { identifier: string; password: string }>(
            '/auth/login',
            { identifier, password },
        );

        accessToken.value = result.accessToken;
        user.value = result.user;
        status.value = 'authenticated';
    }

    async function logout(): Promise<void> {
        try {
            await postApiData<{ loggedOut: boolean }>('/auth/logout');
        } finally {
            accessToken.value = null;
            user.value = null;
            status.value = 'anonymous';
        }
    }

    return {
        accessToken,
        user,
        status,
        isAuthenticated,
        restoreSession,
        login,
        logout,
    };
});
