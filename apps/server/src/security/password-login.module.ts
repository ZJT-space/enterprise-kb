import { Global, Module } from '@nestjs/common';
import { LoginAttemptProtectionService } from './login-attempt-protection.service.js';
import { LoginIpRateLimitService } from './login-ip-rate-limit.service.js';
import { PasswordLoginController } from './password-login.controller.js';
import { PasswordLoginService } from './password-login.service.js';
import { RefreshTokenService } from './refresh-token.service.js';

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
