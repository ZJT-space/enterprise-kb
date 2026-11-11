import { Injectable } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { BusinessCodeException } from '../common/exceptions/business-code.exception.js';
import { AccessTokenService } from './access-token.service.js';
import type { AuthenticatedRequest } from './authenticated-request.js';

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(private readonly accessTokenService: AccessTokenService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const authorization = request.headers.authorization;
        const match =
            typeof authorization === 'string' ? /^Bearer\s+([^\s]+)$/i.exec(authorization) : null;

        if (!match) {
            throw new BusinessCodeException(401, 40001, 'Invalid access token');
        }

        // 验证通过后只把令牌中的主体信息附到请求上，后续守卫可再检查角色或资源权限。
        request.user = await this.accessTokenService.verifyAccessToken(match[1]);
        return true;
    }
}
