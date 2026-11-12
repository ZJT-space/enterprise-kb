import type { ExecutionContext } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BusinessCodeException } from '@/common/exceptions/business-code.exception.js';
import { AccessTokenGuard } from '@/security/access-token.guard.js';
import type { AuthenticatedRequest } from '@/security/authenticated-request.js';
import type { AccessTokenService } from '@/security/access-token.service.js';
import type { SessionVersionService } from '@/security/session-version.service.js';

describe('AccessTokenGuard', () => {
    const claims = {
        sub: 'user-123',
        sessionVersion: 'session-version-1',
        iat: 1_800_000_000,
        exp: 1_800_000_900,
    };
    const verifyAccessToken = vi.fn();
    const getCurrent = vi.fn();
    const guard = new AccessTokenGuard(
        { verifyAccessToken } as unknown as AccessTokenService,
        { getCurrent } as unknown as SessionVersionService,
    );

    beforeEach(() => {
        vi.clearAllMocks();
        getCurrent.mockResolvedValue('session-version-1');
    });

    function createContext(authorization?: string): {
        context: ExecutionContext;
        request: Partial<AuthenticatedRequest>;
    } {
        const request: Partial<AuthenticatedRequest> = {
            headers: { authorization } as AuthenticatedRequest['headers'],
        };
        const context = {
            switchToHttp: () => ({ getRequest: () => request }),
        } as unknown as ExecutionContext;

        return { context, request };
    }

    it('verifies a Bearer token and attaches its claims to the request', async () => {
        verifyAccessToken.mockResolvedValueOnce(claims);
        const { context, request } = createContext('Bearer valid-token');

        await expect(guard.canActivate(context)).resolves.toBe(true);

        expect(verifyAccessToken).toHaveBeenCalledWith('valid-token');
        expect(request.user).toEqual(claims);
    });

    it('rejects a missing authorization header', async () => {
        const { context } = createContext();

        await expect(guard.canActivate(context)).rejects.toMatchObject({
            businessCode: 40001,
            status: 401,
        });
        expect(verifyAccessToken).not.toHaveBeenCalled();
    });

    it('rejects a malformed or non-Bearer authorization header', async () => {
        const { context } = createContext('Basic credentials');

        await expect(guard.canActivate(context)).rejects.toMatchObject({ businessCode: 40001 });
        expect(verifyAccessToken).not.toHaveBeenCalled();
    });

    it('propagates invalid token failures from the verifier', async () => {
        verifyAccessToken.mockRejectedValueOnce(
            new BusinessCodeException(401, 40001, 'Invalid access token'),
        );
        const { context } = createContext('Bearer invalid-token');

        await expect(guard.canActivate(context)).rejects.toThrow(BusinessCodeException);
    });
});
