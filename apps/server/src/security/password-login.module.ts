import { Global, Module } from '@nestjs/common';
import { LoginAttemptProtectionService } from '@/security/login-attempt-protection.service.js';
import { LoginIpRateLimitService } from '@/security/login-ip-rate-limit.service.js';
import { PasswordLoginController } from '@/security/password-login.controller.js';
import { PasswordLoginService } from '@/security/password-login.service.js';
import { RefreshTokenService } from '@/security/refresh-token.service.js';

@Global()
@Module({
    controllers: [PasswordLoginController],
    providers: [
        LoginAttemptProtectionService,
        LoginIpRateLimitService,
        PasswordLoginService,
        RefreshTokenService,
    ],
    exports: [
        LoginAttemptProtectionService,
        LoginIpRateLimitService,
        PasswordLoginService,
        RefreshTokenService,
    ],
})
export class PasswordLoginModule {}
