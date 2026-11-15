<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { ConfigProvider, theme } from 'ant-design-vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const isDarkMode = ref(false);
let colorSchemeQuery: MediaQueryList | undefined;

const themeConfig = computed(() => ({
    algorithm: isDarkMode.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
        colorPrimary: '#3157d5',
        borderRadius: 6,
        fontFamily: 'Inter, "PingFang SC", "Microsoft YaHei", sans-serif',
    },
}));

function updateColorScheme(event: MediaQueryListEvent): void {
    isDarkMode.value = event.matches;
}

onMounted(() => {
    colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    isDarkMode.value = colorSchemeQuery.matches;
    colorSchemeQuery.addEventListener('change', updateColorScheme);
});

onBeforeUnmount(() => {
    colorSchemeQuery?.removeEventListener('change', updateColorScheme);
});
</script>

<template>
    <ConfigProvider :theme="themeConfig">
        <main v-if="authStore.status === 'initializing'" class="app-status" role="status">
            正在恢复登录状态…
        </main>
        <RouterView v-else />
    </ConfigProvider>
</template>

<style>
:root {
    font-family: system-ui, sans-serif;
    color: #1f2937;
    background: #f8fafc;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    color-scheme: light;
}

body {
    min-width: 320px;
    min-height: 100vh;
    margin: 0;
}

@media (prefers-color-scheme: dark) {
    :root {
        color: #e5e7eb;
        background: #111827;
        color-scheme: dark;
    }
}

.app-status {
    display: grid;
    min-height: 100vh;
    place-items: center;
}
</style>
