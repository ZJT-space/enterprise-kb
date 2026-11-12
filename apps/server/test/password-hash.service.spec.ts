import { describe, expect, it } from 'vitest';
import { PasswordHashService } from '@/security/password-hash.service.js';

describe('PasswordHashService', () => {
    const passwordHashService = new PasswordHashService();

    it('hashes passwords with Argon2id and verifies the correct password', async () => {
        const password = 'correct horse battery staple';
        const passwordHash = await passwordHashService.hashPassword(password);

        expect(passwordHash).toMatch(/^\$argon2id\$/);
        expect(passwordHash).not.toBe(password);
        await expect(passwordHashService.verifyPassword(passwordHash, password)).resolves.toBe(
            true,
        );
        await expect(
            passwordHashService.verifyPassword(passwordHash, 'incorrect password'),
        ).resolves.toBe(false);
    });

    it('treats an invalid stored hash as a password mismatch', async () => {
        await expect(
            passwordHashService.verifyPassword('invalid-hash', 'any password'),
        ).resolves.toBe(false);
    });
});
