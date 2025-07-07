require("dotenv").config();
const Contact = require('../../../src/models/contact');

describe('Contact constructor validation', () => {
    it('should throw if user_id is missing', () => {
        const contact = {
            name: 'Alice',
            surname: 'Smith',
            phone: '123456',
        };

        expect(() => new Contact(contact)).toThrow('user_id is required');
    });

    it('should throw if phone is missing', () => {
        const contact = {
            user_id: 1,
            name: 'Alice',
            surname: 'Smith',
        };

        expect(() => new Contact(contact)).toThrow('phone is required');
    });

    it('should throw if both name and surname are missing', () => {
        const contact = {
            user_id: 1,
            phone: '123456',
        };

        expect(() => new Contact(contact)).toThrow('At least one of name or surname is required');
    });

    it('should return a contact object if user_id, name/surname and phone are not missing', () => {
        const contact = {
            user_id: 1,
            name: 'Test',
            phone: '123456',
        };

        let result;
        result = new Contact(contact);

        expect(result).toBeInstanceOf(Contact);
        expect(result.name).toBe('Test');
        expect(result.surname).toBeUndefined();
        expect(result.phone).toBe('123456');
        expect(result.email).toBeNull();
        expect(result.phone_hash).toBeNull();
        expect(result.email_hash).toBeNull();
        expect(result.birthdate).toBeNull();
    });

});
