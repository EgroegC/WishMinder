require("dotenv").config();
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../../src/models/user');
const Contact = require('../../../src/models/contact');
const { deleteAllContactsForUser } = require('../../helpers/contact_route_helper');
const { itShouldRequireAuth } = require('../../helpers/auth_test_helper');

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
        const contact = new Contact({
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

    describe('POST /', () => {
        itShouldRequireAuth(() => server, '/api/contacts', 'post', {...contactPayload});

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

        it('should save and return the contact if valid', async () => {
            const res = await execPost({
                ...contactPayload
            });

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                ...contactPayload
            });
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
            await execPost({ ...contactPayload});

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
    });

    describe('PUT /:id', () => {
        itShouldRequireAuth(() => server, '/api/contacts/1', 'put', {...contactPayload, name: 'Upd'});

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
    });
});
