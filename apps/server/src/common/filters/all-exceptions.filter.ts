import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { BusinessCodeException } from '../exceptions/business-code.exception.js';

const BUSINESS_CODE_BY_STATUS: Record<number, number> = {
    [HttpStatus.BAD_REQUEST]: 40000,
    [HttpStatus.UNAUTHORIZED]: 40001,
    [HttpStatus.FORBIDDEN]: 40003,
    [HttpStatus.NOT_FOUND]: 40004,
    [HttpStatus.CONFLICT]: 40009,
    [HttpStatus.TOO_MANY_REQUESTS]: 40029,
};

interface ErrorResponse {
    code: number;
    message: string;
    data: null;
    timestamp: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const isHttpException = exception instanceof HttpException;
        const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const response = host.switchToHttp().getResponse();

        if (!isHttpException || status >= HttpStatus.INTERNAL_SERVER_ERROR) {
            // 服务端错误只记录在日志中，避免把异常信息或堆栈泄露给调用方。
            this.logger.error(exception instanceof Error ? exception.stack : String(exception));
        }

        const body: ErrorResponse = {
            code: this.getBusinessCode(exception, status),
            message: this.getMessage(exception, status),
            data: null,
            timestamp: new Date().toISOString(),
        };

        this.httpAdapterHost.httpAdapter.reply(response, body, status);
    }

    private getBusinessCode(exception: unknown, status: number): number {
        if (exception instanceof BusinessCodeException) {
            return exception.businessCode;
        }

        if (BUSINESS_CODE_BY_STATUS[status]) {
            return BUSINESS_CODE_BY_STATUS[status];
        }

        return status >= HttpStatus.INTERNAL_SERVER_ERROR ? 50000 : 40000;
    }

    private getMessage(exception: unknown, status: number): string {
        if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
            return '服务器内部错误';
        }

        if (exception instanceof HttpException) {
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                return exceptionResponse;
            }

            if (
                typeof exceptionResponse === 'object' &&
                exceptionResponse !== null &&
                'message' in exceptionResponse
            ) {
                const message = exceptionResponse.message;

                if (typeof message === 'string') {
                    return message;
                }

                if (Array.isArray(message) && message.every((item) => typeof item === 'string')) {
                    return message.join('; ');
                }
            }

            return exception.message;
        }

        return '请求失败';
    }
}
