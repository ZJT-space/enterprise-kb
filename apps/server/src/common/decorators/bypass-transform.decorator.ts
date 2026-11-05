import { SetMetadata } from '@nestjs/common';

export const BYPASS_TRANSFORM_KEY = 'bypassTransform';

// 标记不应被统一响应拦截器包装的路由，例如健康检查和文件流接口。
export const BypassTransform = () => SetMetadata(BYPASS_TRANSFORM_KEY, true);
