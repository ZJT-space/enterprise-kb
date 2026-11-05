import { Controller, Get } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

@Controller('response-test')
class ResponseTestController {
    @Get()
    success() {
        return { value: 'ok' };
    }
}

describe('App bootstrap', () => {
    let app: INestApplication;
    const queryRaw = vi.fn();

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
            controllers: [ResponseTestController],
        })
            .overrideProvider(PrismaService)
            .useValue({ $queryRaw: queryRaw })
            .compile();

        app = moduleRef.createNestApplication(new FastifyAdapter());
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

        const response = await app.getHttpAdapter().getInstance().inject({
            method: 'GET',
            url: '/health',
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({ status: 'ok', database: 'ok' });
    });

    it('reports the service as unavailable when the database query fails', async () => {
        queryRaw.mockRejectedValueOnce(new Error('database unavailable'));

        const response = await app.getHttpAdapter().getInstance().inject({
            method: 'GET',
            url: '/health',
        });

        expect(response.statusCode).toBe(503);
        expect(response.json()).toEqual({ status: 'error', database: 'unavailable' });
    });
});
