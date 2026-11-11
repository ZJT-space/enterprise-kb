import { Injectable } from '@nestjs/common';
import { BusinessCodeException } from '../common/exceptions/business-code.exception.js';
import { AccessTokenService } from './access-token.service.js';
import { PasswordHashService } from './password-hash.service.js';
import { LoginAttemptProtectionService } from './login-attempt-protection.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RefreshTokenService } from './refresh-token.service.js';

export interface PasswordLoginResult {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        username: string;
        email: string;
        nickname: string;
        mustChangePassword: boolean;
    };
}

@Injectable()
export class PasswordLoginService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly passwordHashService: PasswordHashService,
        private readonly accessTokenService: AccessTokenService,
        private readonly loginAttemptProtection: LoginAttemptProtectionService,
        private readonly refreshTokenService: RefreshTokenService,
    ) {}

    async authenticate(identifier: string, password: string): Promise<PasswordLoginResult> {
        await this.loginAttemptProtection.assertNotLocked(identifier);

        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ username: identifier }, { email: identifier }],
            },
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

        // 对不存在、停用和密码错误的账号返回相同结果，避免泄露账号状态。
        if (
            !user ||
            user.status !== 'active' ||
            !(await this.passwordHashService.verifyPassword(user.passwordHash, password))
        ) {
            await this.loginAttemptProtection.recordFailure(identifier);
            throw new BusinessCodeException(401, 40005, 'Invalid credentials');
        }

        await this.loginAttemptProtection.clearFailures(identifier);
        const accessToken = await this.accessTokenService.issueAccessToken(user.id);
        const refreshToken = await this.refreshTokenService.issue(user.id);

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                nickname: user.nickname,
                mustChangePassword: user.mustChangePassword,
            },
        };
    }

    async refreshAccessToken(token: string): Promise<string> {
        const claims = await this.refreshTokenService.verify(token);
        const user = await this.prisma.user.findUnique({
            where: { id: claims.sub },
            select: { status: true },
        });

        // 刷新时重新检查账号状态，停用账号不能继续换取访问令牌。
        if (!user || user.status !== 'active') {
            throw new BusinessCodeException(401, 40001, 'Invalid refresh token');
        }

        return this.accessTokenService.issueAccessToken(claims.sub);
    }
}
