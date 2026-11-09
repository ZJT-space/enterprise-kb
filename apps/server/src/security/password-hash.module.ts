import { Global, Module } from '@nestjs/common';
import { PasswordHashService } from './password-hash.service.js';

@Global()
@Module({
    providers: [PasswordHashService],
    exports: [PasswordHashService],
})
export class PasswordHashModule {}
