require("dotenv").config();
const { encryptContact, decryptContact } = require('../../../src/utils/contact_encryption');
const Contact = require('../../../src/models/contact');

jest.mock('../../../src/utils/crypto', () => ({
    encrypt: jest.fn((text) => `encrypted(${text})`),
    decrypt: jest.fn((text) => text.replace(/^encrypted\(/, '').replace(/\)$/, '')),
}));

jest.mock('crypto', () => {
    return {
        createHash: () => ({
            update: function (text) {
                this._text = text;
                return this;
            },
            digest: function () {
                return `hash(${this._text})`;
            },
        }),
    };
});

describe('encryptContact', () => {
    it('should return null if contact is null or undefined', () => {
        expect(encryptContact(null)).toBeNull();
        expect(encryptContact(undefined)).toBeNull();
    });

    it('should encrypt phone and email, hash them, and return a Contact object', () => {
        const contact = {
            user_id: 1,
            name: 'John',
            surname: 'Doe',
            phone: '1234567890',
            email: 'john@example.com',
            birthdate: '1990-01-01',
        };

        const result = encryptContact(contact);

        expect(result).toBeInstanceOf(Contact);
        expect(result.name).toBe('John');
        expect(result.surname).toBe('Doe');
        expect(result.phone).toBe('encrypted(1234567890)');
        expect(result.phone_hash).toBe('hash(1234567890)');
        expect(result.email).toBe('encrypted(john@example.com)');
        expect(result.email_hash).toBe('hash(john@example.com)');
        expect(result.birthdate).toBe('1990-01-01');
    });

    it('should handle missing optional fields and return a Contact instance', () => {
        const contact = {
            user_id: 1,
            surname: 'Alice',
            phone: '435443',
        };

        const result = encryptContact(contact);

        expect(result).toBeInstanceOf(Contact);
        expect(result.name).toBeUndefined();
        expect(result.surname).toBe('Alice');
        expect(result.phone).toBe('encrypted(435443)');
        expect(result.phone_hash).toBe('hash(435443)');
        expect(result.email).toBeNull();
        expect(result.email_hash).toBeNull();
        expect(result.birthdate).toBeNull();
    });

    it('should throw if phone is undefined', () => {
        const contact = {
            user_id: 1,
            name: 'Alice',
            email: 'john@example.com',
            birthdate: '1990-01-01',
        };

        expect(() => encryptContact(contact)).toThrow('phone is required');
    });
});

describe('decryptContact', () => {
    it('should return null if contact is null or undefined', () => {
        expect(decryptContact(null)).toBeNull();
        expect(decryptContact(undefined)).toBeNull();
    });

    it('should decrypt phone and email, and return a Contact object', () => {
        const encrypted = {
            user_id: 1,
            name: 'Jane',
            phone: 'encrypted(1234567890)',
            email: 'encrypted(jane@example.com)',
            birthdate: '1985-05-05',
        };

        const result = decryptContact(encrypted);

        expect(result).toBeInstanceOf(Contact);
        expect(result.name).toBe('Jane');
        expect(result.surname).toBeUndefined();
        expect(result.phone).toBe('1234567890');
        expect(result.email).toBe('jane@example.com');
        expect(result.birthdate).toBe('1985-05-05');
    });

    it('should handle missing optional fields and return a Contact instance', () => {
        const encrypted = {
            user_id: 1,
            surname: 'Bob',
            phone: '234',
            email: null,
            birthdate: null,
        };

        const result = decryptContact(encrypted);

        expect(result).toBeInstanceOf(Contact);
        expect(result.name).toBeUndefined();
        expect(result.surname).toBe('Bob');
        expect(result.phone).toBe('234')
        expect(result.email).toBeNull();
        expect(result.birthdate).toBeNull();
    });

    it('should throw if phone is undefined', () => {
        const contact = {
            user_id: 1,
            name: 'Alice',
            email: 'john@example.com',
            birthdate: '1990-01-01',
        };

        expect(() => decryptContact(contact)).toThrow('phone is required');
    });
});

