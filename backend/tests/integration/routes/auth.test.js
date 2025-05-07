require("dotenv").config();
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../../src/models/user');

let server;

describe('/api/auth', () => {
    beforeEach( () => { 
        server = require('../../../src/index'); 
    });

    afterEach( async () => {
        await User.delete('test_user@gmail.com');
        server.close();
    });

    describe('POST /', () => {

        let email;
        let password
        let user;
    
        const exec = async () => {
            return request(server)
            .post('/api/auth')
            .send({ email, password });
        }
    
        beforeEach( async () => {
            email = 'test_user@gmail.com';
            password = '12345';

            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User( {name: 'TestUser', email, password: hashedPassword } );
            await user.save();
        });
    
        afterEach( async () => {
            await User.delete('test_user@gmail.com');
        })

        it('should return a token if email and password are valid', async () => {

            const res = await exec();

            const decodedToken = jwt.decode(res.body.accessToken);
            console.log(decodedToken);

            expect(res.status).toBe(200);
            expect(decodedToken.id).toBe(user.id);
        });

        it('should return a 400 response if email or password are invalid', async () => {
            email = 'invalid@';

            const res = await exec();

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/at least 12/i);
        });

        it('should return a 400 response if email not exists', async () => {
            email = 'test@gmail.com';

            const res = await exec();

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/invalid email/i);
        });

        it('should return a 400 response if password is not correct', async () => {
            password = 'wrong_password';

            const res = await exec();

            expect(res.status).toBe(400);
            expect(res.text).toMatch(/invalid.*password/i);
        });
    });
});