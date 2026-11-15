import type { Pinia } from 'pinia';
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import { useAuthStore } from '@/stores/auth';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: { name: 'home' },
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/auth/LoginView.vue'),
        meta: { guestOnly: true },
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/HomeView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/change-password',
        name: 'change-password',
        component: () => import('@/views/auth/ChangePasswordPlaceholderView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'home' },
    },
];

export function createAppRouter(pinia: Pinia) {
    const router = createRouter({
        history: createWebHistory(import.meta.env.BASE_URL),
        routes,
    });

    router.beforeEach(async (to) => {
        const authStore = useAuthStore(pinia);

        if (authStore.status === 'initializing') {
            // 在判断访问权限前等待会话恢复完成，避免刷新页面时误跳到登录页。
            await authStore.restoreSession();
        }

        if (to.meta.requiresAuth && !authStore.isAuthenticated) {
            return {
                name: 'login',
                query: { redirect: to.fullPath },
            };
        }

        if (authStore.user?.mustChangePassword && to.name !== 'change-password') {
            return { name: 'change-password' };
        }

        if (to.name === 'change-password' && !authStore.user?.mustChangePassword) {
            return { name: 'home' };
        }

        if (to.meta.guestOnly && authStore.isAuthenticated) {
            return { name: 'home' };
        }

        return true;
    });

    return router;
}
