import type { ExecutionContext } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BusinessCodeException } from '../src/common/exceptions/business-code.exception.js';
import { AccessTokenGuard } from '../src/security/access-token.guard.js';
import type { AuthenticatedRequest } from '../src/security/authenticated-request.js';
import type { AccessTokenService } from '../src/security/access-token.service.js';

describe('AccessTokenGuard', () => {
    const claims = { sub: 'user-123', iat: 1_800_000_000, exp: 1_800_000_900 };
    const verifyAccessToken = vi.fn();
    const guard = new AccessTokenGuard({ verifyAccessToken } as unknown as AccessTokenService);

    beforeEach(() => {
        vi.clearAllMocks();
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
