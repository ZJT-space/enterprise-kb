import {
    Injectable,
    type CallHandler,
    type ExecutionContext,
    type NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map } from 'rxjs';
import type { Observable } from 'rxjs';
import { BYPASS_TRANSFORM_KEY } from '../decorators/bypass-transform.decorator.js';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
    constructor(private readonly reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        // 控制器或路由声明豁免时保留原始响应，例如健康检查和文件流接口。
        const shouldBypass = this.reflector.getAllAndOverride<boolean>(BYPASS_TRANSFORM_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (shouldBypass) {
            return next.handle();
        }

        // 这里只包装成功结果；异常响应由后续的全局异常过滤器统一处理。
        return next.handle().pipe(
            map((data: unknown) => ({
                code: 20000,
                message: 'success',
                data,
                timestamp: new Date().toISOString(),
            })),
        );
    }
}
