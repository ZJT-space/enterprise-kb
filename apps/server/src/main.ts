import 'reflect-metadata';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module.js';

dotenv.config({ path: fileURLToPath(new URL('../../../.env', import.meta.url)) });

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule, new FastifyAdapter());

    await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

void bootstrap();
