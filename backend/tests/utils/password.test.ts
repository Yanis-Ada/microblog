import { describe, it, expect } from 'vitest';
import { faker } from '@faker-js/faker';
import { hashPassword, verifyPassword } from '../../src/utils/password';

describe('Password Hashing', () => {

    it('should hash password without exposing plain text', async () => {
        const password = faker.internet.password({ length: 12 });
        const hashed = await hashPassword(password);

        expect(hashed).not.toBe(password);
        expect(hashed).not.toContain(password);
    });

    it('should generate bcrypt hash with correct format', async () => {
        const password = faker.internet.password({ length: 12 });
        const hashed = await hashPassword(password);

        expect(hashed).toMatch(/^\$2[aby]\$/);
        expect(hashed).toHaveLength(60);
    });

    it('should generate unique hashes for same password', async () => {
        const password = faker.internet.password({ length: 12 });
        const hash1 = await hashPassword(password);
        const hash2 = await hashPassword(password);

        expect(hash1).not.toBe(hash2);
    });

    it('should verify correct password', async () => {
        const password = faker.internet.password({ length: 12 });
        const hashed = await hashPassword(password);
        const isValid = await verifyPassword(password, hashed);

        expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
        const password = faker.internet.password({ length: 12 });
        const wrongPassword = faker.internet.password({ length: 12 });
        const hashed = await hashPassword(password);
        const isValid = await verifyPassword(wrongPassword, hashed);

        expect(isValid).toBe(false);
    });
});