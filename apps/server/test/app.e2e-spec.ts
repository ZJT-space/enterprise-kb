import { FastifyAdapter } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module.js';

describe('App bootstrap', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication(new FastifyAdapter());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('initializes the Nest application with the Fastify adapter', () => {
        expect(app.getHttpAdapter().getInstance()).toBeDefined();
    });
});
