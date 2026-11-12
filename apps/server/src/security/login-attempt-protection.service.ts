import { Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { BusinessCodeException } from '@/common/exceptions/business-code.exception.js';
import { RedisService } from '@/redis/redis.service.js';

const MAX_LOGIN_FAILURES = 5;
const FAILURE_WINDOW_SECONDS = 15 * 60;
const LOCK_DURATION_SECONDS = 15 * 60;

@Injectable()
export class LoginAttemptProtectionService {
    constructor(private readonly redis: RedisService) {}

    async assertNotLocked(identifier: string): Promise<void> {
        const { lockKey } = this.getKeys(identifier);

        if (await this.redis.getValue(lockKey)) {
            throw new BusinessCodeException(401, 40005, 'Invalid credentials');
        }
    }

    async recordFailure(identifier: string): Promise<number> {
        const { failuresKey, lockKey } = this.getKeys(identifier);

        return this.redis.recordLoginFailure(
            failuresKey,
            lockKey,
            MAX_LOGIN_FAILURES,
            FAILURE_WINDOW_SECONDS,
            LOCK_DURATION_SECONDS,
        );
    }

    async clearFailures(identifier: string): Promise<void> {
        const { failuresKey, lockKey } = this.getKeys(identifier);

        await Promise.all([this.redis.deleteKey(failuresKey), this.redis.deleteKey(lockKey)]);
    }

    private getKeys(identifier: string): { failuresKey: string; lockKey: string } {
        // 对登录标识做摘要后再作为 Redis 键，避免在 Redis 中暴露邮箱或用户名。
        const identifierHash = createHash('sha256')
            .update(identifier.trim().toLowerCase())
            .digest('hex');
        const prefix = `auth:login:${identifierHash}`;

        return {
            failuresKey: `${prefix}:failures`,
            lockKey: `${prefix}:locked`,
        };
    }
}
