import { Global, Module } from '@nestjs/common';
import { LoginAttemptProtectionService } from './login-attempt-protection.service.js';
import { LoginIpRateLimitService } from './login-ip-rate-limit.service.js';
import { PasswordLoginService } from './password-login.service.js';

@Global()
@Module({
    providers: [LoginAttemptProtectionService, LoginIpRateLimitService, PasswordLoginService],
    exports: [LoginAttemptProtectionService, LoginIpRateLimitService, PasswordLoginService],
})
export class PasswordLoginModule {}
