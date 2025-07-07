require("dotenv").config();
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../../src/models/user');
const { itShouldRequireAuth } = require('../../helpers/auth_test_helper');

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

let server;

describe('/api/users', () => {
    beforeEach(() => { server = require('../../../src/index'); });
    afterEach(() => { server.close(); });

    describe('GET /me', () => {
        let token;
        let user;

        const exec = async () => {
            return request(server)
                .get('/api/users/me')
                .set('Authorization', `Bearer ${token}`);
        }

        beforeEach(async () => {
            const hashedPassword = await bcrypt.hash('12345', 10);
            user = new User({ name: 'TestUser', email: 'test_user@gmail.com', password: hashedPassword });
            await user.save();

            token = jwt.sign({ id: user.id }, process.env.JWT_ACCESS_TOKEN);
        });

        afterEach(async () => {
            await User.delete('test_user@gmail.com');
        })

        itShouldRequireAuth(() => server, '/api/users/me', 'get');

        it('should return 404 if token does not corespond to a existing user', async () => {
            token = jwt.sign({ id: user.id + 1 }, process.env.JWT_ACCESS_TOKEN);

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return user_id, name and email if token is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id', user.id);
            expect(res.body).toHaveProperty('name', user.name);
            expect(res.body).toHaveProperty('email', user.email);
        });

        it('should return 500 when an unhandled error occurs', async () => {
            jest.spyOn(User, 'findById').mockRejectedValue(
                new Error('Unexpected failure')
            );

            const res = await exec();
            expect(res.status).toBe(500);
            User.findById.mockRestore();
        });
    });

    describe('POST /', () => {

        let name, email, password;

        const exec = async () => {
            return request(server)
                .post('/api/users/')
                .send({ name, email, password });
        }

        beforeEach(async () => {
            name = 'TestUser';
            email = 'test_user@gmail.com';
            password = '12345';
        });

        afterEach(async () => {
            await User.delete('test_user@gmail.com');
        });

        it('should return 422 if name, email or password are not valid', async () => {
            name = 'T';

            const res = await exec();

            expect(res.status).toBe(422);
        });

        it('should return 400 if user is already registered', async () => {
            const hashedPassword = await bcrypt.hash('12345', 10);
            const user = new User({ name: 'TestUser', email: 'test_user@gmail.com', password: hashedPassword });
            await user.save();

            const res = await exec();

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/already registered/i);
        });

        it('should return 200 response if user is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('name', name);
            expect(res.body).toHaveProperty('email', email);
        });

        it('should return 500 when an unhandled error occurs', async () => {
            jest.spyOn(User, 'findByEmail').mockRejectedValue(
                new Error('Unexpected failure')
            );

            const res = await exec();
            expect(res.status).toBe(500);
            User.findByEmail.mockRestore();
        });
    });
});