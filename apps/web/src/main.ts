import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from '@/App.vue';
import { createAppRouter } from '@/router';

const pinia = createPinia();
const router = createAppRouter(pinia);
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount('#app');
