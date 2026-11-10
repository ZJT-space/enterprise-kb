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

    async getValue(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async deleteKey(key: string): Promise<number> {
        return this.client.del(key);
    }

    async recordLoginFailure(
        failuresKey: string,
        lockKey: string,
        maximumFailures: number,
        failureWindowSeconds: number,
        lockDurationSeconds: number,
    ): Promise<number> {
        // 用 Lua 将失败计数、窗口过期和锁定写入作为一个原子操作，避免并发登录漏计。
        const result = await this.client.eval(
            `
                if redis.call('EXISTS', KEYS[2]) == 1 then
                    return -1
                end

                local failures = redis.call('INCR', KEYS[1])
                if failures == 1 then
                    redis.call('EXPIRE', KEYS[1], ARGV[2])
                end

                if failures >= tonumber(ARGV[1]) then
                    redis.call('SET', KEYS[2], '1', 'EX', ARGV[3], 'NX')
                end

                return failures
            `,
            {
                keys: [failuresKey, lockKey],
                arguments: [
                    String(maximumFailures),
                    String(failureWindowSeconds),
                    String(lockDurationSeconds),
                ],
            },
        );

        return Number(result);
    }
}
