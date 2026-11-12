import 'reflect-metadata';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import { AppModule } from '@/app.module.js';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule, new FastifyAdapter());
    await app.getHttpAdapter().getInstance().register(fastifyCookie);
    const configService = app.get(ConfigService);

    await app.listen(configService.getOrThrow<number>('PORT'), '0.0.0.0');
}

void bootstrap();
