import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import { RedisService } from '../redis/redis.service.js';

const MAX_LOGIN_REQUESTS_PER_IP = 30;
const LOGIN_WINDOW_MILLISECONDS = 60 * 1000;

@Injectable()
export class LoginIpRateLimitService {
    constructor(private readonly redis: RedisService) {}

    async assertAllowed(ipAddress: string): Promise<void> {
        const ipHash = createHash('sha256').update(ipAddress.trim().toLowerCase()).digest('hex');
        const allowed = await this.redis.consumeSlidingWindowRequest(
            `auth:login:ip:${ipHash}`,
            Date.now(),
            LOGIN_WINDOW_MILLISECONDS,
            MAX_LOGIN_REQUESTS_PER_IP,
            randomUUID(),
        );

        if (!allowed) {
            throw new HttpException('Too many login attempts', HttpStatus.TOO_MANY_REQUESTS);
        }
    }
}
