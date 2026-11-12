import { BusinessCodeException } from '@/common/exceptions/business-code.exception.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PasswordLoginService } from '@/security/password-login.service.js';
import type { PrismaService } from '@/prisma/prisma.service.js';
import type { PasswordHashService } from '@/security/password-hash.service.js';
import type { AccessTokenService } from '@/security/access-token.service.js';
import type { LoginAttemptProtectionService } from '@/security/login-attempt-protection.service.js';
import type { RefreshTokenService } from '@/security/refresh-token.service.js';
import type { SessionVersionService } from '@/security/session-version.service.js';

describe('PasswordLoginService', () => {
    const user = {
        id: 'user-123',
        username: 'zheng',
        email: 'zheng@example.com',
        nickname: 'Zheng',
        passwordHash: 'argon2-hash',
        mustChangePassword: false,
        status: 'active',
    };
    const findFirst = vi.fn();
    const verifyPassword = vi.fn();
    const issueAccessToken = vi.fn();
    const issueRefreshToken = vi.fn();
    const assertNotLocked = vi.fn();
    const recordFailure = vi.fn();
    const clearFailures = vi.fn();
    const getOrCreateSessionVersion = vi.fn();
    const service = new PasswordLoginService(
        { user: { findFirst } } as unknown as PrismaService,
        { verifyPassword } as unknown as PasswordHashService,
        { issueAccessToken } as unknown as AccessTokenService,
        {
            assertNotLocked,
            recordFailure,
            clearFailures,
        } as unknown as LoginAttemptProtectionService,
        { issue: issueRefreshToken } as unknown as RefreshTokenService,
        { getOrCreate: getOrCreateSessionVersion } as unknown as SessionVersionService,
    );

    beforeEach(() => {
        vi.clearAllMocks();
        findFirst.mockResolvedValue(user);
        verifyPassword.mockResolvedValue(true);
        issueAccessToken.mockResolvedValue('signed-access-token');
        issueRefreshToken.mockResolvedValue('signed-refresh-token');
        getOrCreateSessionVersion.mockResolvedValue('session-version-1');
        assertNotLocked.mockResolvedValue(undefined);
        recordFailure.mockResolvedValue(1);
        clearFailures.mockResolvedValue(undefined);
    });

    it('authenticates with the supplied username or email and returns a token', async () => {
        const result = await service.authenticate(user.email, 'correct-password');

        expect(findFirst).toHaveBeenCalledWith({
            where: { OR: [{ username: user.email }, { email: user.email }] },
            select: {
                id: true,
                username: true,
                email: true,
                nickname: true,
                passwordHash: true,
                mustChangePassword: true,
                status: true,
            },
        });
        expect(verifyPassword).toHaveBeenCalledWith(user.passwordHash, 'correct-password');
        expect(assertNotLocked).toHaveBeenCalledWith(user.email);
        expect(clearFailures).toHaveBeenCalledWith(user.email);
        expect(issueAccessToken).toHaveBeenCalledWith(user.id, 'session-version-1');
        expect(issueRefreshToken).toHaveBeenCalledWith(user.id, 'session-version-1');
        expect(result).toEqual({
            accessToken: 'signed-access-token',
            refreshToken: 'signed-refresh-token',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                nickname: user.nickname,
                mustChangePassword: user.mustChangePassword,
            },
        });
        expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('refreshes an access token for an active account', async () => {
        const findUnique = vi.fn().mockResolvedValue({ status: 'active' });
        const verifyRefreshToken = vi.fn().mockResolvedValue({
            sub: user.id,
            sessionVersion: 'session-version-1',
            iat: 1,
            exp: 2,
        });
        const refreshService = new PasswordLoginService(
            { user: { findFirst, findUnique } } as unknown as PrismaService,
            { verifyPassword } as unknown as PasswordHashService,
            { issueAccessToken } as unknown as AccessTokenService,
            {
                assertNotLocked,
                recordFailure,
                clearFailures,
            } as unknown as LoginAttemptProtectionService,
            {
                issue: issueRefreshToken,
                verify: verifyRefreshToken,
            } as unknown as RefreshTokenService,
            {
                getCurrent: vi.fn().mockResolvedValue('session-version-1'),
            } as unknown as SessionVersionService,
        );
        issueAccessToken.mockResolvedValue('renewed-access-token');

        await expect(refreshService.refreshAccessToken('valid-refresh-token')).resolves.toBe(
            'renewed-access-token',
        );
        expect(findUnique).toHaveBeenCalledWith({
            where: { id: user.id },
            select: { status: true },
        });
    });

    it('uses the same unauthorized response when the account does not exist', async () => {
        findFirst.mockResolvedValue(null);

        await expect(service.authenticate('missing-user', 'password')).rejects.toThrow(
            BusinessCodeException,
        );
        expect(verifyPassword).not.toHaveBeenCalled();
        expect(recordFailure).toHaveBeenCalledWith('missing-user');
        expect(issueAccessToken).not.toHaveBeenCalled();
    });

    it('rejects disabled accounts without checking their password', async () => {
        findFirst.mockResolvedValue({ ...user, status: 'disabled' });

        await expect(service.authenticate(user.username, 'password')).rejects.toThrow(
            BusinessCodeException,
        );
        expect(verifyPassword).not.toHaveBeenCalled();
        expect(recordFailure).toHaveBeenCalledWith(user.username);
        expect(issueAccessToken).not.toHaveBeenCalled();
    });

    it('rejects an incorrect password without issuing a token', async () => {
        verifyPassword.mockResolvedValue(false);

        await expect(service.authenticate(user.username, 'wrong-password')).rejects.toThrow(
            BusinessCodeException,
        );
        expect(recordFailure).toHaveBeenCalledWith(user.username);
        expect(issueAccessToken).not.toHaveBeenCalled();
    });

    it('does not query credentials when the identifier is locked', async () => {
        assertNotLocked.mockRejectedValue(
            new BusinessCodeException(401, 40005, 'Invalid credentials'),
        );

        await expect(service.authenticate(user.username, 'password')).rejects.toThrow(
            BusinessCodeException,
        );
        expect(findFirst).not.toHaveBeenCalled();
        expect(recordFailure).not.toHaveBeenCalled();
    });
});
