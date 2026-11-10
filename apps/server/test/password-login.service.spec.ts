import { UnauthorizedException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PasswordLoginService } from '../src/security/password-login.service.js';
import type { PrismaService } from '../src/prisma/prisma.service.js';
import type { PasswordHashService } from '../src/security/password-hash.service.js';
import type { AccessTokenService } from '../src/security/access-token.service.js';

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
    const service = new PasswordLoginService(
        { user: { findFirst } } as unknown as PrismaService,
        { verifyPassword } as unknown as PasswordHashService,
        { issueAccessToken } as unknown as AccessTokenService,
    );

    beforeEach(() => {
        vi.clearAllMocks();
        findFirst.mockResolvedValue(user);
        verifyPassword.mockResolvedValue(true);
        issueAccessToken.mockResolvedValue('signed-access-token');
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
        expect(issueAccessToken).toHaveBeenCalledWith(user.id);
        expect(result).toEqual({
            accessToken: 'signed-access-token',
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

    it('uses the same unauthorized response when the account does not exist', async () => {
        findFirst.mockResolvedValue(null);

        await expect(service.authenticate('missing-user', 'password')).rejects.toThrow(
            UnauthorizedException,
        );
        expect(verifyPassword).not.toHaveBeenCalled();
        expect(issueAccessToken).not.toHaveBeenCalled();
    });

    it('rejects disabled accounts without checking their password', async () => {
        findFirst.mockResolvedValue({ ...user, status: 'disabled' });

        await expect(service.authenticate(user.username, 'password')).rejects.toThrow(
            UnauthorizedException,
        );
        expect(verifyPassword).not.toHaveBeenCalled();
        expect(issueAccessToken).not.toHaveBeenCalled();
    });

    it('rejects an incorrect password without issuing a token', async () => {
        verifyPassword.mockResolvedValue(false);

        await expect(service.authenticate(user.username, 'wrong-password')).rejects.toThrow(
            UnauthorizedException,
        );
        expect(issueAccessToken).not.toHaveBeenCalled();
    });
});
