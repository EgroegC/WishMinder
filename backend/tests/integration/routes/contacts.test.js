require("dotenv").config();
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../../src/models/user');
const Contact = require('../../../src/models/contact');
const NamedayService = require('../../../src/services/namedays_service');
const ContactNormalizer = require('../../../src/services/contact/contact_normalizer_service');
const { encryptContact } = require('../../../src/utils/contact_encryption');
const { deleteAllContactsForUser } = require('../../helpers/contact_route_helper');
const { itShouldRequireAuth } = require('../../helpers/auth_test_helper');
const { getContactService, setContactService } = require('../../../src/utils/contactServiceHolder');
const { insertTestNameday, clearNamedaysAndNames } = require('../../helpers/namedays_helper');
const { closePool } = require('../../../src/config/db');

jest.mock('../../../src/config/rollbar', () => {
    const mRollbar = {
        error: jest.fn()
    };
    return () => mRollbar;
});

jest.mock('../../../src/config/logger', () => {
    return () => ({
        error: jest.fn(),
        info: jest.fn()
    });
});

describe('/api/contacts', () => {
    let server;
    let token;
    let user;

    const contactPayload = {
        name: 'ContactName',
        surname: 'ContactSurname',
        phone: '+30748374',
        email: 'email@gmail.com',
        birthdate: new Date('2002-05-12').toISOString()
    };

    const createTokenAndUser = async () => {
        const hashedPassword = await bcrypt.hash('12345', 10);
        user = new User({ name: 'TestUser', email: 'test_user@gmail.com', password: hashedPassword });
        await user.save();
        token = jwt.sign({ id: user.id }, process.env.JWT_ACCESS_TOKEN);
    };

    const execPost = async (data) => {
        return request(server)
            .post('/api/contacts')
            .set('Authorization', `Bearer ${token}`)
            .send(data);
    };

    const execGet = async (auth = token) => {
        return request(server)
            .get('/api/contacts')
            .set('Authorization', `Bearer ${auth}`);
    };

    const createContact = async () => {
        const contact = encryptContact({
            user_id: user.id,
            ...contactPayload
        });
        await contact.save();
        return contact;
    };

    beforeEach(async () => {
        server = require('../../../src/index');
        await createTokenAndUser();
    });

    afterEach(async () => {
        await deleteAllContactsForUser(user.id);
        await User.delete(user.email);
        await server.close();
    });
    afterAll(async () => { await closePool(); });

    describe('POST /', () => {
        itShouldRequireAuth(() => server, '/api/contacts', 'post', { ...contactPayload });

        it('should return 422 if validation fails', async () => {
            const res = await execPost({ name: '', phone: 'abc' });
            expect(res.status).toBe(422);
        });

        it('should return 400 if contact already exists', async () => {
            await createContact();
            const res = await execPost({
                ...contactPayload
            });
            expect(res.status).toBe(400);
        });

        it('should save and return 200 with the valid contact ', async () => {
            const res = await execPost(contactPayload);

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                ...contactPayload
            });
        });

        it('should save and return 200 with the normalized and resolved name order', async () => {
            await insertTestNameday('George', new Date());

            const names = await NamedayService.getAllNames();
            setContactService(new ContactNormalizer(names));

            const newContact =
            {
                ...contactPayload,
                name: 'Alex', surname: 'george'
            };

            const res = await execPost(newContact);
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                ...contactPayload, name: 'George', surname: 'Alex'
            });

            await clearNamedaysAndNames();
        });

        it('should save and return 200 with the valid contact that has no email and birthdate', async () => {
            const newContact = {
                name: 'ContactName',
                surname: 'ContactSurname',
                phone: '+30748374',
            };

            const res = await execPost(newContact);

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                ...newContact
            });
        });

        it('should return 500 when an unhandled error occurs', async () => {
            jest.spyOn(Contact, 'findByPhoneHash').mockImplementation(() => {
                throw new Error('Unexpected failure');
            });
            const res = await execPost(contactPayload);
            expect(res.status).toBe(500);
            Contact.findByPhoneHash.mockRestore();
        });
    });

    describe('GET /', () => {
        itShouldRequireAuth(() => server, '/api/contacts', 'get');

        it('should return 200 and an empty array if user has no contacts', async () => {
            const res = await execGet();
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(0);
        });

        it('should return 200 and all contacts for the user', async () => {
            await execPost({ ...contactPayload });

            const res = await execGet();

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(1);

            res.body.forEach(contact => {
                expect(contact).toHaveProperty('name');
                expect(contact).toHaveProperty('surname');
                expect(contact).toHaveProperty('email');
                expect(contact).toHaveProperty('phone');
                expect(contact).toHaveProperty('birthdate');
            });
        });

        it('should return 500 when an unhandled error occurs', async () => {
            jest.spyOn(Contact, 'getAllContacts').mockImplementation(() => {
                throw new Error('Unexpected failure');
            });
            const res = await execGet();
            expect(res.status).toBe(500);
            Contact.getAllContacts.mockRestore();
        });
    });

    describe('DELETE /:id', () => {
        itShouldRequireAuth(() => server, '/api/contacts/1', 'delete');

        it('should return 404 if contact not found', async () => {
            const res = await request(server)
                .delete('/api/contacts/-1')
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(404);
        });

        it('should delete the contact if it exists', async () => {
            const contact = await createContact();
            const res = await request(server)
                .delete(`/api/contacts/${contact.id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id', contact.id);
        });

        it('should return 500 when an unhandled error occurs', async () => {
            jest.spyOn(Contact, 'deleteContact').mockImplementation(() => {
                throw new Error('Unexpected failure');
            });
            const res = await request(server)
                .delete(`/api/contacts/1`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(500);
            Contact.deleteContact.mockRestore();
        });
    });

    describe('PUT /:id', () => {
        itShouldRequireAuth(() => server, '/api/contacts/1', 'put', { ...contactPayload, name: 'Upd' });

        it('should return 404 if contact not found', async () => {
            const res = await request(server)
                .put('/api/contacts/-1')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    ...contactPayload, name: 'updated'
                });
            expect(res.status).toBe(404);
        });

        it('should return 422 if validation fails', async () => {
            const res = await request(server)
                .put('/api/contacts/-1')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    ...contactPayload, name: 'u'
                });
            expect(res.status).toBe(422);
        });

        it('should update the contact if it exists', async () => {
            const contact = await createContact();
            const res = await request(server)
                .put(`/api/contacts/${contact.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    ...contactPayload, name: 'Updated'
                });

            expect(res.status).toBe(200);
            expect(res.body.name).toBe('Updated');
        });

        it('should return 500 when an unhandled error occurs', async () => {
            const updateSpy = jest.spyOn(Contact.prototype, 'update').mockImplementation(() => {
                throw new Error('Unexpected error');
            });
            const res = await request(server)
                .put(`/api/contacts/1`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    ...contactPayload, name: 'Updated'
                });
            expect(res.status).toBe(500);
            updateSpy.mockRestore();
        });
    });

    describe('POST /batch', () => {
        const importPath = '/api/contacts/batch';

        const execImport = async (contacts) => {
            return request(server)
                .post(importPath)
                .set('Authorization', `Bearer ${token}`)
                .send({ contacts });
        };

        itShouldRequireAuth(() => server, importPath, 'post', { contacts: [{}] });

        it('should return 400 if contacts is not an array or is empty', async () => {
            const res1 = await execImport(null);
            const res2 = await execImport([]);
            expect(res1.status).toBe(400);
            expect(res2.status).toBe(400);
            expect(res1.body.message).toMatch(/contacts must be a non-empty array/i);
        });

        it('should return 422 if one or more contacts fail validation', async () => {
            const invalidContacts = [
                { name: '', phone: 'not-a-phone' },
                { email: 'missing-fields@example.com' }
            ];
            const res = await execImport(invalidContacts);
            expect(res.status).toBe(422);
            expect(res.body.message).toMatch(/failed validation/i);
        });

        it('should import valid contacts and return inserted and updated counts', async () => {
            const newContacts = [
                { ...contactPayload },
                { ...contactPayload, phone: '+30999999', email: 'second@email.com' }
            ];
            const res = await execImport(newContacts);
            expect(res.status).toBe(201);
            expect(res.body.message).toBe('Contacts imported successfully.');
            expect(res.body.insertedCount).toBeGreaterThanOrEqual(2);
            expect(res.body.updatedCount).toBe(0);
        });

        it('should swap name and surname and import the contact', async () => {
            await insertTestNameday('George', new Date());

            const names = await NamedayService.getAllNames();
            setContactService(new ContactNormalizer(names));

            const newContact = [
                { ...contactPayload, name: 'Alex', surname: 'george' }
            ];
            const res = await execImport(newContact);
            expect(res.status).toBe(201);
            expect(res.body.message).toBe('Contacts imported successfully.');
            expect(res.body.insertedCount).toBeGreaterThanOrEqual(1);
            expect(res.body.updatedCount).toBe(0);

            const savedContacts = await Contact.getAllContacts(user.id);
            expect(savedContacts.length).toBeGreaterThanOrEqual(1);
            const saved = savedContacts[0];
            expect(saved.name).toBe('George');
            expect(saved.surname).toBe('Alex');

            await clearNamedaysAndNames();
        });

        it('should update existing contact if already in database', async () => {
            await createContact();

            const updatedPayload = {
                ...contactPayload,
                name: 'UpdatedName'
            };

            const res = await execImport([updatedPayload]);
            expect(res.status).toBe(201);
            expect(res.body.insertedCount).toBe(0);
            expect(res.body.updatedCount).toBeGreaterThanOrEqual(1);
            expect(res.body.updated[0]).toHaveProperty('name', 'UpdatedName');
        });

        it('should return 500 when an unhandled error occurs', async () => {
            const contactService = getContactService();
            jest.spyOn(contactService, 'normalizeContacts').mockImplementation(() => {
                throw new Error('Unexpected failure');
            });

            const newContact = [contactPayload];

            const res = await execImport(newContact);
            expect(res.status).toBe(500);
            contactService.normalizeContacts.mockRestore();
        });
    });

});
