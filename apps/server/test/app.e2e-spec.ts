import {
    BadRequestException,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module.js';
import { PrismaService } from '@/prisma/prisma.service.js';
import { RedisService } from '@/redis/redis.service.js';
import { LoginIpRateLimitService } from '@/security/login-ip-rate-limit.service.js';
import { PasswordLoginService } from '@/security/password-login.service.js';
import { BusinessCodeException } from '@/common/exceptions/business-code.exception.js';

@Controller('response-test')
class ResponseTestController {
    @Get()
    success() {
        return { value: 'ok' };
    }
}

@Controller('exception-test')
class ExceptionTestController {
    @Get('bad-request')
    badRequest(): never {
        throw new BadRequestException('invalid input');
    }

    @Get('not-found')
    notFound(): never {
        throw new NotFoundException('resource not found');
    }

    @Get('unauthorized')
    unauthorized(): never {
        throw new UnauthorizedException('Access token expired');
    }

    @Get('unexpected')
    unexpected(): never {
        throw new Error('sensitive internal details');
    }
}

describe('App bootstrap', () => {
    let app: INestApplication;
    const queryRaw = vi.fn();
    const ping = vi.fn();
    const assertIpAllowed = vi.fn();
    const authenticate = vi.fn();
    const refreshAccessToken = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        assertIpAllowed.mockResolvedValue(undefined);
    });

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
            controllers: [ResponseTestController, ExceptionTestController],
        })
            .overrideProvider(PrismaService)
            .useValue({ $queryRaw: queryRaw })
            .overrideProvider(RedisService)
            .useValue({ ping })
            .overrideProvider(LoginIpRateLimitService)
            .useValue({ assertAllowed: assertIpAllowed })
            .overrideProvider(PasswordLoginService)
            .useValue({ authenticate, refreshAccessToken })
            .compile();

        app = moduleRef.createNestApplication(new FastifyAdapter());
        await app.getHttpAdapter().getInstance().register(fastifyCookie);
        await app.init();
        await app.getHttpAdapter().getInstance().ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('initializes the Nest application with the Fastify adapter', () => {
        expect(app.getHttpAdapter().getInstance()).toBeDefined();
    });

    it('wraps successful business responses in the standard envelope', async () => {
        const response = await app.getHttpAdapter().getInstance().inject({
            method: 'GET',
            url: '/response-test',
        });
        const body = response.json();

        expect(response.statusCode).toBe(200);
        expect(body).toMatchObject({
            code: 20000,
            message: 'success',
            data: { value: 'ok' },
        });
        expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
    });

    it('reports a healthy service when the database query succeeds', async () => {
        queryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);
        ping.mockResolvedValueOnce('PONG');

        const response = await app.getHttpAdapter().getInstance().inject({
            method: 'GET',
            url: '/health',
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({ status: 'ok', database: 'ok', redis: 'ok' });
    });

    it('reports the service as unavailable when the database query fails', async () => {
        queryRaw.mockRejectedValueOnce(new Error('database unavailable'));

        const response = await app.getHttpAdapter().getInstance().inject({
            method: 'GET',
            url: '/health',
        });

        expect(response.statusCode).toBe(503);
        expect(response.json()).toMatchObject({
            code: 50000,
            message: '服务器内部错误',
            data: null,
        });
    });

    it('reports the service as unavailable when the Redis query fails', async () => {
        queryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);
        ping.mockRejectedValueOnce(new Error('Redis unavailable'));

        const response = await app.getHttpAdapter().getInstance().inject({
            method: 'GET',
            url: '/health',
        });

        expect(response.statusCode).toBe(503);
        expect(response.json()).toMatchObject({
            code: 50000,
            message: '服务器内部错误',
            data: null,
        });
    });

    it('keeps the HTTP status and maps a bad request to its business code', async () => {
        const response = await app.getHttpAdapter().getInstance().inject({
            method: 'GET',
            url: '/exception-test/bad-request',
        });

        expect(response.statusCode).toBe(400);
        expect(response.json()).toMatchObject({
            code: 40000,
            message: 'invalid input',
            data: null,
        });
    });

    it('limits login requests by IP and returns the standard success envelope', async () => {
        assertIpAllowed.mockResolvedValueOnce(undefined);
        authenticate.mockResolvedValueOnce({
            accessToken: 'signed-token',
            refreshToken: 'signed-refresh-token',
            user: { id: 'user-1', username: 'zheng', mustChangePassword: false },
        });

        const response = await app
            .getHttpAdapter()
            .getInstance()
            .inject({
                method: 'POST',
                url: '/auth/login',
                payload: { identifier: 'zheng', password: 'correct-password' },
            });

        expect(response.statusCode).toBe(200);
        expect(assertIpAllowed).toHaveBeenCalledWith('127.0.0.1');
        expect(authenticate).toHaveBeenCalledWith('zheng', 'correct-password');
        expect(response.json()).toMatchObject({
            code: 20000,
            data: { accessToken: 'signed-token' },
        });
        expect(response.json().data).not.toHaveProperty('refreshToken');
        expect(response.headers['set-cookie']).toContain('refreshToken=signed-refresh-token');
        expect(response.headers['set-cookie']).toContain('HttpOnly');
        expect(response.headers['set-cookie']).toContain('Path=/auth');
    });

    it('uses the refresh cookie to issue a new access token', async () => {
        refreshAccessToken.mockResolvedValueOnce('renewed-access-token');

        const response = await app
            .getHttpAdapter()
            .getInstance()
            .inject({
                method: 'POST',
                url: '/auth/refresh',
                cookies: { refreshToken: 'signed-refresh-token' },
            });

        expect(response.statusCode).toBe(200);
        expect(refreshAccessToken).toHaveBeenCalledWith('signed-refresh-token');
        expect(response.json()).toMatchObject({
            code: 20000,
            data: { accessToken: 'renewed-access-token' },
        });
    });

    it('rejects refresh requests without a refresh cookie', async () => {
        const response = await app.getHttpAdapter().getInstance().inject({
            method: 'POST',
            url: '/auth/refresh',
        });

        expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(response.json()).toMatchObject({ code: 40001 });
        expect(refreshAccessToken).not.toHaveBeenCalled();
    });

    it('rejects malformed login requests after applying IP rate limiting', async () => {
        const response = await app
            .getHttpAdapter()
            .getInstance()
            .inject({
                method: 'POST',
                url: '/auth/login',
                payload: { identifier: '', password: '' },
            });

        expect(response.statusCode).toBe(400);
        expect(assertIpAllowed).toHaveBeenCalledWith('127.0.0.1');
        expect(authenticate).not.toHaveBeenCalled();
    });

    it('returns the standard unauthorized response for invalid credentials', async () => {
        authenticate.mockRejectedValueOnce(
            new BusinessCodeException(401, 40005, 'Invalid credentials'),
        );

        const response = await app
            .getHttpAdapter()
            .getInstance()
            .inject({
                method: 'POST',
                url: '/auth/login',
                payload: { identifier: 'unknown-user', password: 'incorrect' },
            });

        expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(response.json()).toMatchObject({ code: 40005, message: 'Invalid credentials' });
    });

    it('keeps token failures on the token-expired business code', async () => {
        const response = await app.getHttpAdapter().getInstance().inject({
            method: 'GET',
            url: '/exception-test/unauthorized',
        });

        expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(response.json()).toMatchObject({ code: 40001 });
    });

    it('preserves the rate-limit status when the IP exceeds its allowance', async () => {
        assertIpAllowed.mockRejectedValueOnce(
            new HttpException('Too many login attempts', HttpStatus.TOO_MANY_REQUESTS),
        );

        const response = await app
            .getHttpAdapter()
            .getInstance()
            .inject({
                method: 'POST',
                url: '/auth/login',
                payload: { identifier: 'zheng', password: 'password' },
            });

        expect(response.statusCode).toBe(HttpStatus.TOO_MANY_REQUESTS);
        expect(response.json()).toMatchObject({ code: 40029 });
        expect(authenticate).not.toHaveBeenCalled();
    });

    it('keeps the HTTP status and maps a missing resource to its business code', async () => {
        const response = await app.getHttpAdapter().getInstance().inject({
            method: 'GET',
            url: '/exception-test/not-found',
        });

        expect(response.statusCode).toBe(404);
        expect(response.json()).toMatchObject({
            code: 40004,
            message: 'resource not found',
            data: null,
        });
    });

    it('hides unexpected exception details from the response', async () => {
        const response = await app.getHttpAdapter().getInstance().inject({
            method: 'GET',
            url: '/exception-test/unexpected',
        });

        expect(response.statusCode).toBe(500);
        expect(response.json()).toMatchObject({
            code: 50000,
            message: '服务器内部错误',
            data: null,
        });
        expect(response.body).not.toContain('sensitive internal details');
    });
});
