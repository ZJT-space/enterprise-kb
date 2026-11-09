import { Injectable, Logger } from '@nestjs/common';
import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);
    private readonly client;

    constructor(configService: ConfigService) {
        this.client = createClient({ url: configService.getOrThrow<string>('REDIS_URL') });
        this.client.on('error', (error) => {
            this.logger.error('Redis 客户端连接错误', error.stack);
        });
    }

    async onModuleInit(): Promise<void> {
        // 在 Nest 应用启动阶段建立 Redis 连接，连接失败时阻止服务进入就绪状态。
        await this.client.connect();
    }

    async onModuleDestroy(): Promise<void> {
        if (this.client.isOpen) {
            // 应用关闭时释放 Redis 连接，避免进程退出前遗留 socket。
            await this.client.close();
        }
    }

    async ping(): Promise<string> {
        return this.client.ping();
    }
}
