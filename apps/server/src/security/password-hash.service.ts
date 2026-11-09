import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class PasswordHashService {
    async hashPassword(password: string): Promise<string> {
        // 明确使用 Argon2id，哈希串会包含随机盐和算法参数。
        return argon2.hash(password, { type: argon2.argon2id });
    }

    async verifyPassword(passwordHash: string, password: string): Promise<boolean> {
        try {
            return await argon2.verify(passwordHash, password);
        } catch {
            // 无效哈希格式按密码不匹配处理，不向调用方暴露原生库错误。
            return false;
        }
    }
}
