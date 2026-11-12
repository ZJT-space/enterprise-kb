import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface AccessTokenClaims {
    sub: string;
    sessionVersion: string;
    iat: number;
    exp: number;
}

@Injectable()
export class AccessTokenService {
    constructor(private readonly jwtService: JwtService) {}

    async issueAccessToken(subject: string, sessionVersion: string): Promise<string> {
        // Access Token 只携带用户标识和会话版本，不把可能变更的角色写入令牌。
        return this.jwtService.signAsync({ sessionVersion }, { subject });
    }

    async verifyAccessToken(token: string): Promise<AccessTokenClaims> {
        try {
            const payload = await this.jwtService.verifyAsync<Record<string, unknown>>(token);

            if (
                typeof payload.sub !== 'string' ||
                typeof payload.sessionVersion !== 'string' ||
                payload.sessionVersion.length === 0 ||
                typeof payload.iat !== 'number' ||
                typeof payload.exp !== 'number'
            ) {
                throw new UnauthorizedException('Invalid access token');
            }

            return {
                ...payload,
                sub: payload.sub,
                sessionVersion: payload.sessionVersion,
                iat: payload.iat,
                exp: payload.exp,
            };
        } catch {
            // 统一拒绝签名错误、过期令牌和缺少必要声明的令牌，避免泄露校验细节。
            throw new UnauthorizedException('Invalid access token');
        }
    }
}
