import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccessTokenService } from './access-token.service.js';
import { PasswordHashService } from './password-hash.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

export interface PasswordLoginResult {
    accessToken: string;
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
    ) {}

    async authenticate(identifier: string, password: string): Promise<PasswordLoginResult> {
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
            throw new UnauthorizedException('Invalid credentials');
        }

        const accessToken = await this.accessTokenService.issueAccessToken(user.id);

        return {
            accessToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                nickname: user.nickname,
                mustChangePassword: user.mustChangePassword,
            },
        };
    }
}
