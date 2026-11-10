import { Global, Module } from '@nestjs/common';
import { LoginAttemptProtectionService } from './login-attempt-protection.service.js';
import { PasswordLoginService } from './password-login.service.js';

@Global()
@Module({
    providers: [LoginAttemptProtectionService, PasswordLoginService],
    exports: [LoginAttemptProtectionService, PasswordLoginService],
})
export class PasswordLoginModule {}
