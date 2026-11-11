import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenGuard } from './access-token.guard.js';
import { AccessTokenService } from './access-token.service.js';

@Global()
@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
                signOptions: {
                    algorithm: 'HS256' as const,
                    expiresIn: '15m' as const,
                },
                verifyOptions: {
                    algorithms: ['HS256'] as const,
                },
            }),
        }),
    ],
    providers: [AccessTokenService, AccessTokenGuard],
    exports: [JwtModule, AccessTokenService, AccessTokenGuard],
})
export class AccessTokenModule {}
