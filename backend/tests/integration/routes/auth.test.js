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
        server.close();
    });

    let user, email, password, refreshToken;

    const createValidUserAndToken = async () => {
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User( {name: 'TestUser', email, password: hashedPassword } );
        await user.save();

        refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_TOKEN, { expiresIn: '3d' });
    }

    describe('POST /', () => {
    
        const exec = async () => {
            return request(server)
            .post('/api/auth')
            .send({ email, password });
        }
    
        beforeEach( async () => {
            email = 'test_user@gmail.com';
            password = '12345';

            await createValidUserAndToken();
        });
    
        afterEach( async () => {
            await User.delete('test_user@gmail.com');
        })

        it('should return a token if email and password are valid', async () => {

            const res = await exec();

            const decodedToken = jwt.decode(res.body.accessToken);

            expect(res.status).toBe(200);
            expect(decodedToken.id).toBe(user.id);
        });

        it('should return a 422 response if email or password are invalid', async () => {
            email = 'invalid@';

            const res = await exec();

            expect(res.status).toBe(422);
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

        it('should create the refreshToken cookie', async () => {
            const res = await exec();
        
            const cookies = res.headers['set-cookie'];
            expect(cookies).toBeDefined();
        
            const refreshTokenCookie = cookies.find(cookie => cookie.startsWith('refreshToken='));
            expect(refreshTokenCookie).toBeDefined();
        
            const tokenValue = refreshTokenCookie.split('=')[1].split(';')[0];
            expect(tokenValue).toBeTruthy();
        
            expect(refreshTokenCookie).toMatch(/HttpOnly/i);
            expect(refreshTokenCookie).toMatch(/Secure/i);
            expect(refreshTokenCookie).toMatch(/SameSite=None/i);
        });
    });

    describe('/api/auth/logout', () => {    
        const exec = () => {
            return request(server).post('/api/auth/logout');
        };
    
        it('should respond with 204', async () => {
            const res = await exec();
            expect(res.status).toBe(204);
        });
    
        it('should clear the refreshToken cookie', async () => {
            const res = await exec();
            
            const cookies = res.headers['set-cookie'];
            expect(cookies).toBeDefined();
            
            const refreshTokenCookie = cookies.find(cookie => cookie.startsWith('refreshToken='));
            expect(refreshTokenCookie).toBeDefined();
            expect(refreshTokenCookie).toMatch(/^refreshToken=;/);
            expect(refreshTokenCookie).toMatch(/Expires=|Max-Age=0/);
        });
    });

    describe('/api/auth/refresh', () => {    
        const exec = (token) => {
            return request(server)
                .post('/api/auth/refresh')
                .set('Cookie', [`refreshToken=${token}`]);
        };
    
        it('should return 403 if refresh token is missing', async () => {
            const res = await request(server).post('/api/auth/refresh');
            expect(res.status).toBe(403);
            expect(res.text).toMatch(/no refresh token/i);
        });
    
        it('should return 403 if refresh token is invalid', async () => {
            const res = await exec('invalid.token.here');
            expect(res.status).toBe(403);
            expect(res.text).toMatch(/invalid refresh token/i);
        });
    
        it('should return 403 if refresh token is expired', async () => {
            const expiredToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_TOKEN, { expiresIn: '-10s' });
            const res = await exec(expiredToken);
    
            expect(res.status).toBe(403);
            expect(res.text).toMatch(/expired/i);
        });
    
        it('should return 200 and a new access token if refresh token is valid', async () => {
            const res = await exec(refreshToken);
    
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('accessToken');
    
            const decoded = jwt.decode(res.body.accessToken);
            expect(decoded).toHaveProperty('id', user.id);
        });
    });
});