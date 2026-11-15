<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Alert, Button, Card, Form, Input } from 'ant-design-vue';
import axios from 'axios';
import type { AxiosError } from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const FormItem = Form.Item;
const PasswordInput = Input.Password;

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const credentials = reactive({ identifier: '', password: '' });
const isSubmitting = ref(false);
const errorMessage = ref('');

const validationRules = {
    identifier: [{ required: true, message: '请输入用户名或邮箱' }],
    password: [{ required: true, message: '请输入密码' }],
};

async function handleSubmit(): Promise<void> {
    errorMessage.value = '';
    isSubmitting.value = true;

    try {
        await authStore.login(credentials.identifier.trim(), credentials.password);

        if (authStore.user?.mustChangePassword) {
            await router.replace({ name: 'change-password' });
            return;
        }

        const redirectTarget = route.query.redirect;
        const safeRedirect =
            typeof redirectTarget === 'string' &&
            redirectTarget.startsWith('/') &&
            !redirectTarget.startsWith('//')
                ? redirectTarget
                : { name: 'home' };

        await router.replace(safeRedirect);
    } catch (error: unknown) {
        errorMessage.value = getLoginErrorMessage(error);
    } finally {
        isSubmitting.value = false;
    }
}

function getLoginErrorMessage(error: unknown): string {
    if (!axios.isAxiosError(error)) {
        return '登录失败，请稍后重试。';
    }

    const businessCode = (error as AxiosError<{ code?: number }>).response?.data?.code;

    if (businessCode === 40005) {
        return '用户名或邮箱、密码不正确，或账号已暂时锁定。';
    }

    if (businessCode === 40029) {
        return '登录尝试次数过多，请稍后再试。';
    }

    if (businessCode === 40000) {
        return '请检查登录信息后重试。';
    }

    return '登录服务暂时不可用，请稍后重试。';
}
</script>

<template>
    <main class="login-page">
        <div class="login-layout">
            <header class="brand-block">
                <span class="brand-mark" aria-hidden="true">知</span>
                <div>
                    <p class="brand-name">企业知识库</p>
                    <p class="brand-caption">让知识沉淀，让协作更高效</p>
                </div>
            </header>

            <Card class="login-card" :bordered="false">
                <div class="card-heading">
                    <p class="eyebrow">欢迎回来</p>
                    <h1>登录你的工作空间</h1>
                    <p class="card-description">使用企业账号访问知识库</p>
                </div>

                <Alert
                    v-if="errorMessage"
                    class="login-error"
                    type="error"
                    :message="errorMessage"
                    show-icon
                />

                <Form
                    :model="credentials"
                    :rules="validationRules"
                    layout="vertical"
                    @finish="handleSubmit"
                >
                    <FormItem label="用户名或邮箱" name="identifier">
                        <Input
                            v-model:value="credentials.identifier"
                            autocomplete="username"
                            placeholder="请输入用户名或邮箱"
                            size="large"
                            autofocus
                        />
                    </FormItem>

                    <FormItem label="密码" name="password">
                        <PasswordInput
                            v-model:value="credentials.password"
                            autocomplete="current-password"
                            placeholder="请输入密码"
                            size="large"
                        />
                    </FormItem>

                    <Button
                        class="submit-button"
                        type="primary"
                        html-type="submit"
                        size="large"
                        block
                        :loading="isSubmitting"
                    >
                        登录
                    </Button>
                </Form>
            </Card>

            <footer class="login-footer">安全连接 · 仅限授权企业成员</footer>
        </div>
    </main>
</template>

<style scoped>
.login-page {
    display: grid;
    min-height: 100vh;
    align-items: center;
    justify-items: center;
    padding: 48px 24px;
    background:
        radial-gradient(ellipse at 12% 12%, rgb(88 119 231 / 13%), transparent 32%),
        radial-gradient(ellipse at 90% 85%, rgb(98 174 191 / 11%), transparent 30%), #f4f6fb;
}

.login-layout {
    display: grid;
    width: min(100%, 420px);
    gap: 28px;
}

.brand-block {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-inline: 4px;
}

.brand-mark {
    display: grid;
    width: 42px;
    height: 42px;
    flex: 0 0 auto;
    place-items: center;
    border-radius: 13px;
    color: #fff;
    background: linear-gradient(145deg, #4568df, #2949bd);
    box-shadow: 0 8px 18px rgb(49 87 213 / 23%);
    font-size: 20px;
    font-weight: 700;
}

.brand-name,
.brand-caption,
.eyebrow,
.card-description,
.login-footer {
    margin: 0;
}

.brand-name {
    color: #172033;
    font-size: 16px;
    font-weight: 650;
    letter-spacing: 0.01em;
}

.brand-caption {
    margin-top: 3px;
    color: #7c8799;
    font-size: 12px;
}

.login-card {
    overflow: hidden;
    border: 1px solid rgb(219 225 237 / 74%);
    border-radius: 18px;
    background: rgb(255 255 255 / 94%);
    box-shadow:
        0 24px 64px rgb(25 39 73 / 9%),
        0 3px 10px rgb(25 39 73 / 4%);
    backdrop-filter: blur(14px);
}

.login-card :deep(.ant-card-body) {
    padding: 36px;
}

.card-heading {
    margin-bottom: 28px;
}

.eyebrow {
    margin-bottom: 8px;
    color: #3157d5;
    font-size: 13px;
    font-weight: 600;
}

h1 {
    margin: 0;
    color: #172033;
    font-size: 25px;
    font-weight: 650;
    letter-spacing: -0.025em;
}

.card-description {
    margin-top: 9px;
    color: #7c8799;
    font-size: 14px;
}

.login-error {
    margin-bottom: 20px;
    border-radius: 8px;
}

.login-card :deep(.ant-form-item) {
    margin-bottom: 20px;
}

.login-card :deep(.ant-form-item-label > label) {
    color: #39445a;
    font-size: 13px;
    font-weight: 550;
}

.login-card :deep(.ant-input-affix-wrapper-lg),
.login-card :deep(.ant-input-lg) {
    min-height: 44px;
    border-radius: 7px;
}

.submit-button {
    height: 44px;
    margin-top: 8px;
    border-radius: 7px;
    font-weight: 600;
    box-shadow: 0 5px 12px rgb(49 87 213 / 18%);
}

.login-footer {
    color: #8c96a8;
    font-size: 12px;
    text-align: center;
}

@media (max-width: 480px) {
    .login-page {
        padding: 32px 18px;
    }

    .login-layout {
        gap: 22px;
    }

    .login-card :deep(.ant-card-body) {
        padding: 28px 22px;
    }

    h1 {
        font-size: 22px;
    }
}

@media (prefers-color-scheme: dark) {
    .login-page {
        background:
            radial-gradient(ellipse at 12% 12%, rgb(73 103 218 / 16%), transparent 32%),
            radial-gradient(ellipse at 90% 85%, rgb(70 137 153 / 12%), transparent 30%), #111827;
    }

    .login-card {
        border-color: rgb(80 94 118 / 36%);
        background: rgb(25 35 53 / 94%);
        box-shadow: 0 24px 64px rgb(0 0 0 / 20%);
    }

    .brand-name,
    h1 {
        color: #e6ebf5;
    }

    .brand-caption,
    .card-description,
    .login-footer {
        color: #98a5ba;
    }

    .login-card :deep(.ant-form-item-label > label) {
        color: #c4cede;
    }
}
</style>
