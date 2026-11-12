import { ref } from 'vue';

// Access Token 只保存在内存中，页面刷新后由 HttpOnly Refresh Token Cookie 恢复会话。
export const accessToken = ref<string | null>(null);
