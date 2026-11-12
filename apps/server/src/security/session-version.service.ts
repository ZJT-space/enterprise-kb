import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { RedisService } from '@/redis/redis.service.js';

const SESSION_VERSION_KEY_PREFIX = 'auth:session-version:';

@Injectable()
export class SessionVersionService {
    constructor(private readonly redisService: RedisService) {}

    async getOrCreate(userId: string): Promise<string> {
        const key = this.getKey(userId);
        const currentVersion = await this.redisService.getValue(key);

        if (currentVersion) {
            return currentVersion;
        }

        // 初始化时使用 SET NX，确保并发登录拿到同一个会话版本。
        await this.redisService.setValueIfAbsent(key, randomUUID());

        const initializedVersion = await this.redisService.getValue(key);

        if (!initializedVersion) {
            throw new ServiceUnavailableException('Session state is unavailable');
        }

        return initializedVersion;
    }

    async getCurrent(userId: string): Promise<string | null> {
        return this.redisService.getValue(this.getKey(userId));
    }

    async revokeAll(userId: string): Promise<void> {
        // 更换随机版本后，旧 Access Token 与 Refresh Token 会同时失效。
        await this.redisService.setValue(this.getKey(userId), randomUUID());
    }

    private getKey(userId: string): string {
        return `${SESSION_VERSION_KEY_PREFIX}${userId}`;
    }
}
