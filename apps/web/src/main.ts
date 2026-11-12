import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from '@/App.vue';
import { useAuthStore } from '@/stores/auth';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.mount('#app');

// 应用挂载后恢复登录态，避免等待刷新接口期间阻塞页面渲染。
void useAuthStore(pinia).restoreSession();
