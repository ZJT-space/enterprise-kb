import { JwtService } from '@nestjs/jwt';
import { describe, expect, it } from 'vitest';
import { AccessTokenService } from '../src/security/access-token.service.js';

describe('AccessTokenService', () => {
    const jwtService = new JwtService({
        secret: 'unit-test-secret-with-at-least-32-characters',
        signOptions: { algorithm: 'HS256', expiresIn: '15m' },
        verifyOptions: { algorithms: ['HS256'] },
    });
    const accessTokenService = new AccessTokenService(jwtService);

    it('issues and verifies a short-lived token for a subject', async () => {
        const token = await accessTokenService.issueAccessToken('user-123', 'session-version-1');
        const claims = await accessTokenService.verifyAccessToken(token);

        expect(claims.sub).toBe('user-123');
        expect(claims.sessionVersion).toBe('session-version-1');
        expect(claims.exp - claims.iat).toBe(15 * 60);
    });

    it('rejects a malformed token', async () => {
        await expect(accessTokenService.verifyAccessToken('not-a-token')).rejects.toThrow();
    });

    it('rejects a token signed with an unsupported algorithm', async () => {
        const token = await jwtService.signAsync({}, { subject: 'user-123', algorithm: 'HS384' });

        await expect(accessTokenService.verifyAccessToken(token)).rejects.toThrow();
    });
});
