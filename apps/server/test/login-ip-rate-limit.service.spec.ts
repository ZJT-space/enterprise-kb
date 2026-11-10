import { HttpStatus } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { LoginIpRateLimitService } from '../src/security/login-ip-rate-limit.service.js';
import type { RedisService } from '../src/redis/redis.service.js';

describe('LoginIpRateLimitService', () => {
    const consumeSlidingWindowRequest = vi.fn();
    const redis = { consumeSlidingWindowRequest } as unknown as RedisService;
    const service = new LoginIpRateLimitService(redis);

    it('allows requests while the IP is below the per-minute limit', async () => {
        consumeSlidingWindowRequest.mockResolvedValueOnce(true);

        await expect(service.assertAllowed('192.0.2.10')).resolves.toBeUndefined();
        expect(consumeSlidingWindowRequest).toHaveBeenCalledWith(
            expect.stringMatching(/^auth:login:ip:[a-f0-9]{64}$/),
            expect.any(Number),
            60_000,
            30,
            expect.any(String),
        );
        expect(consumeSlidingWindowRequest.mock.calls[0][0]).not.toContain('192.0.2.10');
    });

    it('rejects requests after 30 attempts in the rolling minute', async () => {
        consumeSlidingWindowRequest.mockResolvedValueOnce(false);

        await expect(service.assertAllowed('192.0.2.10')).rejects.toMatchObject({
            status: HttpStatus.TOO_MANY_REQUESTS,
        });
    });
});
