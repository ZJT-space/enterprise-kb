<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<template>
    <main v-if="authStore.status === 'initializing'" class="app-status" role="status">
        正在恢复登录状态…
    </main>
    <RouterView v-else />
</template>

<style>
:root {
    font-family: system-ui, sans-serif;
    color: #1f2937;
    background: #f8fafc;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
}

body {
    min-width: 320px;
    min-height: 100vh;
    margin: 0;
}

.app-status {
    display: grid;
    min-height: 100vh;
    place-items: center;
}
</style>
