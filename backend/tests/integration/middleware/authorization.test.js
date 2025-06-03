require("dotenv").config();
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../../src/models/user');

describe('authorization middleware', () => {
    beforeEach(() => { server = require('../../../src/index'); });
    afterEach(() => { server.close(); });

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

    it('should return 401 if no token is provided', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401); ``
    });

    it('should return 403 if token is invalid', async () => {
        token = 'a';

        const res = await exec();

        expect(res.status).toBe(403);
    });

    it('should return 200 if token is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });
});