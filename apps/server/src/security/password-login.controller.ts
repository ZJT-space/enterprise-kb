import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { BusinessCodeException } from '../common/exceptions/business-code.exception.js';
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
        private readonly configService: ConfigService,
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(
        @Req() request: FastifyRequest,
        @Res({ passthrough: true }) reply: FastifyReply,
        @Body() body: unknown,
    ) {
        // 每个登录请求先计入 IP 窗口，包括格式错误的请求，避免借参数错误绕过限流。
        await this.loginIpRateLimit.assertAllowed(request.ip);

        const parsedBody = loginRequestSchema.safeParse(body);

        if (!parsedBody.success) {
            throw new BadRequestException('Invalid login request');
        }

        const result = await this.passwordLogin.authenticate(
            parsedBody.data.identifier,
            parsedBody.data.password,
        );

        // Refresh Token 仅通过 HttpOnly Cookie 传递，避免暴露给前端脚本。
        reply.setCookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'production',
            sameSite: 'lax',
            path: '/auth',
            maxAge: 7 * 24 * 60 * 60,
        });

        return {
            accessToken: result.accessToken,
            user: result.user,
        };
    }

    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    async refresh(@Req() request: FastifyRequest) {
        const token = request.cookies?.refreshToken;

        if (!token) {
            // 缺少 Cookie 与无效或过期令牌使用相同业务码。
            throw new BusinessCodeException(401, 40001, 'Invalid refresh token');
        }

        return { accessToken: await this.passwordLogin.refreshAccessToken(token) };
    }
}
