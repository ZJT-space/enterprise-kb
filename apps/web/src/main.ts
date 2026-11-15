import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'ant-design-vue/dist/reset.css';

import App from '@/App.vue';
import { createAppRouter } from '@/router';
import { useAuthStore } from '@/stores/auth';

const pinia = createPinia();
const router = createAppRouter(pinia);
const app = createApp(App);

app.use(pinia);
app.use(router);

const authStore = useAuthStore(pinia);
window.addEventListener('auth:password-change-required', () => {
    authStore.requirePasswordChange();
    void router.replace({ name: 'change-password' });
});

app.mount('#app');
