import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module.js';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule, new FastifyAdapter());

    await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

void bootstrap();
