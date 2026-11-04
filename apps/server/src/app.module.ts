import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';
import { fileURLToPath } from 'node:url';
import { PrismaModule } from './prisma/prisma.module.js';
import { HealthModule } from './health/health.module.js';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: fileURLToPath(new URL('../../../.env', import.meta.url)),
            validationSchema: z.object({
                PORT: z.coerce.number().int().min(1).max(65535).default(3000),
                DATABASE_URL: z
                    .string()
                    .url()
                    .refine(
                        (value) =>
                            value.startsWith('postgres://') || value.startsWith('postgresql://'),
                        'must be a PostgreSQL connection URL',
                    ),
            }),
        }),
        PrismaModule,
        HealthModule,
    ],
})
export class AppModule {}
