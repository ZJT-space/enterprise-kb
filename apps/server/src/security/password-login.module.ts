import { Global, Module } from '@nestjs/common';
import { PasswordLoginService } from './password-login.service.js';

@Global()
@Module({
    providers: [PasswordLoginService],
    exports: [PasswordLoginService],
})
export class PasswordLoginModule {}
