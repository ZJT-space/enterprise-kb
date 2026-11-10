import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { z } from 'zod';
import { LoginIpRateLimitService } from './login-ip-rate-limit.service.js';
import { PasswordLoginService } from './password-login.service.js';

const loginRequestSchema = z
    .object({
        identifier: z.string().trim().min(1).max(128),
        password: z.string().min(1).max(1024),
    })
    .strict();

@Controller('auth')
export class PasswordLoginController {
    constructor(
        private readonly loginIpRateLimit: LoginIpRateLimitService,
        private readonly passwordLogin: PasswordLoginService,
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Req() request: FastifyRequest, @Body() body: unknown) {
        // 每个登录请求先计入 IP 窗口，包括格式错误的请求，避免借参数错误绕过限流。
        await this.loginIpRateLimit.assertAllowed(request.ip);

        const parsedBody = loginRequestSchema.safeParse(body);

        if (!parsedBody.success) {
            throw new BadRequestException('Invalid login request');
        }

        return this.passwordLogin.authenticate(
            parsedBody.data.identifier,
            parsedBody.data.password,
        );
    }
}
