import { BusinessCodeException } from '../src/common/exceptions/business-code.exception.js';
import { describe, expect, it, vi } from 'vitest';
import { LoginAttemptProtectionService } from '../src/security/login-attempt-protection.service.js';
import type { RedisService } from '../src/redis/redis.service.js';

describe('LoginAttemptProtectionService', () => {
    const getValue = vi.fn();
    const deleteKey = vi.fn();
    const recordLoginFailure = vi.fn();
    const redis = { getValue, deleteKey, recordLoginFailure } as unknown as RedisService;
    const service = new LoginAttemptProtectionService(redis);

    it('allows an identifier that does not have an active lock', async () => {
        getValue.mockResolvedValueOnce(null);

        await expect(service.assertNotLocked('zheng@example.com')).resolves.toBeUndefined();
        expect(getValue).toHaveBeenCalledWith(
            expect.stringMatching(/^auth:login:[a-f0-9]{64}:locked$/),
        );
    });

    it('rejects an identifier with an active lock', async () => {
        getValue.mockResolvedValueOnce('1');

        await expect(service.assertNotLocked('zheng@example.com')).rejects.toThrow(
            BusinessCodeException,
        );
    });

    it('records a 15-minute failure window and locks at five consecutive failures', async () => {
        recordLoginFailure.mockResolvedValueOnce(5);

        const failures = await service.recordFailure('zheng@example.com');

        expect(failures).toBe(5);
        expect(recordLoginFailure).toHaveBeenCalledWith(
            expect.stringMatching(/^auth:login:[a-f0-9]{64}:failures$/),
            expect.stringMatching(/^auth:login:[a-f0-9]{64}:locked$/),
            5,
            900,
            900,
        );
        expect(recordLoginFailure.mock.calls[0][0]).not.toContain('zheng@example.com');
    });

    it('clears both the failure counter and lock after successful authentication', async () => {
        deleteKey.mockResolvedValue(1);

        await service.clearFailures('zheng@example.com');

        expect(deleteKey).toHaveBeenCalledTimes(2);
        expect(deleteKey).toHaveBeenCalledWith(expect.stringMatching(/:failures$/));
        expect(deleteKey).toHaveBeenCalledWith(expect.stringMatching(/:locked$/));
    });
});
