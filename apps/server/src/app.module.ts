import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { z } from 'zod';
import { fileURLToPath } from 'node:url';
import { PrismaModule } from './prisma/prisma.module.js';
import { HealthModule } from './health/health.module.js';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { RedisModule } from './redis/redis.module.js';
import { PasswordHashModule } from './security/password-hash.module.js';
import { AccessTokenModule } from './security/access-token.module.js';
import { PasswordLoginModule } from './security/password-login.module.js';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: fileURLToPath(new URL('../../../.env', import.meta.url)),
            validationSchema: z.object({
                PORT: z.coerce.number().int().min(1).max(65535).default(3000),
                ACCESS_TOKEN_SECRET: z.string().min(32),
                REFRESH_TOKEN_SECRET: z.string().min(32),
                DATABASE_URL: z
                    .string()
                    .url()
                    .refine(
                        (value) =>
                            value.startsWith('postgres://') || value.startsWith('postgresql://'),
                        'must be a PostgreSQL connection URL',
                    ),
                REDIS_URL: z
                    .string()
                    .url()
                    .refine(
                        (value) => value.startsWith('redis://') || value.startsWith('rediss://'),
                        'must be a Redis connection URL',
                    ),
            }),
        }),
        PrismaModule,
        RedisModule,
        PasswordHashModule,
        AccessTokenModule,
        PasswordLoginModule,
        HealthModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseTransformInterceptor,
        },
    ],
})
export class AppModule {}
