require("dotenv").config();
const { deleteAllContactsForUser } = require('../helpers/contact_route_helper');
const ContactImporter = require('../../src/services/contact/contact_importer_service');
const crypto = require('crypto');

const fakeEncryptContact = (contact) => ({
    ...contact,
    phone_hash: crypto.createHash('sha256').update(contact.phone).digest('hex'),
    email_hash: crypto.createHash('sha256').update(contact.email || '').digest('hex'),
});

const fakeDecryptContact = (contact) => contact;

describe('ContactImporter Integration', () => {
    const userId = '1';
    const importer = new ContactImporter({
        encryptContact: fakeEncryptContact,
        decryptContact: fakeDecryptContact,
    });

    afterAll(async () => {
        await deleteAllContactsForUser(userId);
    });

    it('inserts new contacts', async () => {
        const contacts = [
            { name: 'Alice', surname: 'Smith', phone: '123', email: 'alice@example.com', birthdate: '1990-01-01' },
            { name: 'Bob', surname: 'Jones', phone: '456', email: 'bob@example.com', birthdate: '1985-05-05' },
        ];

        const result = await importer.importContacts(contacts, userId);
        expect(result.inserted).toHaveLength(2);
        expect(result.updated).toHaveLength(0);
    });

    it('returns name and surname if both are present, otherwise returns only defined fields after insertion', async () => {
        const contacts = [
            { name: 'Alice', phone: '234', email: 'alice@example.com', birthdate: '1990-01-01' },
            { name: 'Bob', surname: 'Jones', phone: '222', email: 'bob@example.com', birthdate: '1985-05-05' },
            { surname: 'Jones', phone: '4564', email: 'jones@example.com', birthdate: '1985-05-05' },
        ];

        const result = await importer.importContacts(contacts, userId);
        expect(result.inserted).toHaveLength(3);
        expect(result.updated).toHaveLength(0);
        expect(result.inserted).toEqual(
            expect.arrayContaining([
                { name: 'Alice' },
                { name: 'Bob', surname: 'Jones' },
                { surname: 'Jones' },
            ])
        );
    });

    it('updates existing contacts with same phone hash', async () => {
        const original = [
            { name: 'Alice', surname: 'Smith', phone: '123', email: 'alice@example.com', birthdate: '1990-01-01' }
        ];
        const updated = [
            { name: 'Alice', surname: 'Johnson', phone: '123', email: 'alice_new@example.com', birthdate: '1990-01-01' }
        ];

        await importer.importContacts(original, userId);
        const result = await importer.importContacts(updated, userId);

        expect(result.inserted).toHaveLength(0);
        expect(result.updated).toHaveLength(1);
        expect(result.updated[0].surname).toBe('Johnson');
    });

    it('deduplicates contacts before inserting', async () => {
        const contacts = [
            { name: 'Alice', surname: 'Smith', phone: '1234', email: 'alice@example.com', birthdate: '1990-01-01' },
            { name: 'Alice', surname: 'Smith', phone: '1234', email: 'alice@example.com', birthdate: '1990-01-01' }
        ];

        const result = await importer.importContacts(contacts, userId);
        expect(result.inserted).toHaveLength(1);
    });

    it('returns empty result if input is empty', async () => {
        const result = await importer.importContacts([], userId);
        expect(result.inserted).toEqual([]);
        expect(result.updated).toEqual([]);
    });
});
