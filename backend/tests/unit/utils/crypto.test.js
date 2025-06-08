describe('crypto module', () => {
    const ORIGINAL_ENV = process.env;

    beforeEach(() => {
        jest.resetModules(); // Clear module cache
        process.env = { ...ORIGINAL_ENV };
    });

    afterEach(() => {
        process.env = ORIGINAL_ENV;
    });

    it('should throw if ENCRYPTION_KEY is missing', () => {
        delete process.env.ENCRYPTION_KEY;

        expect(() => {
            require('../../../src/utils/crypto');
        }).toThrow('Invalid or missing ENCRYPTION_KEY in .env');
    });

    it('should throw if ENCRYPTION_KEY is invalid (wrong length)', () => {
        process.env.ENCRYPTION_KEY = Buffer.from('short-key').toString('base64');

        expect(() => {
            require('../../../src/utils/crypto');
        }).toThrow('Invalid or missing ENCRYPTION_KEY in .env');
    });

    it('should throw when decrypting malformed data', () => {
        process.env.ENCRYPTION_KEY = Buffer.from('12345678901234567890123456789012').toString('base64');
        const { decrypt } = require('../../../src/utils/crypto');

        expect(() => decrypt('not:valid:data')).toThrow();
    });

    it('should encrypt and then decrypt to the original text', () => {
        process.env.ENCRYPTION_KEY = Buffer.from('12345678901234567890123456789012').toString('base64');
        const { encrypt, decrypt } = require('../../../src/utils/crypto');

        const text = 'Hello, encryption!';
        const encrypted = encrypt(text);
        const decrypted = decrypt(encrypted);

        expect(typeof encrypted).toBe('string');
        expect(decrypted).toBe(text);
    });
});
