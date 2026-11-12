import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BusinessCodeException } from '@/common/exceptions/business-code.exception.js';

export interface RefreshTokenClaims {
    sub: string;
    sessionVersion: string;
    iat: number;
    exp: number;
}

@Injectable()
export class RefreshTokenService {
    private readonly secret: string;

    constructor(
        private readonly jwtService: JwtService,
        configService: ConfigService,
    ) {
        this.secret = configService.getOrThrow<string>('REFRESH_TOKEN_SECRET');
    }

    async issue(subject: string, sessionVersion: string): Promise<string> {
        return this.jwtService.signAsync(
            { sessionVersion },
            {
                secret: this.secret,
                algorithm: 'HS256',
                expiresIn: '7d',
                subject,
            },
        );
    }

    async verify(token: string): Promise<RefreshTokenClaims> {
        try {
            const payload = await this.jwtService.verifyAsync<Record<string, unknown>>(token, {
                secret: this.secret,
                algorithms: ['HS256'],
            });

            if (
                typeof payload.sub !== 'string' ||
                typeof payload.sessionVersion !== 'string' ||
                payload.sessionVersion.length === 0 ||
                typeof payload.iat !== 'number' ||
                typeof payload.exp !== 'number'
            ) {
                throw new Error('Refresh token is missing required claims');
            }

            return {
                sub: payload.sub,
                sessionVersion: payload.sessionVersion,
                iat: payload.iat,
                exp: payload.exp,
            };
        } catch {
            // 对无效、过期或格式错误的刷新令牌统一返回 Token 失效业务码。
            throw new BusinessCodeException(401, 40001, 'Invalid refresh token');
        }
    }
}
