require("dotenv").config();
const request = require('supertest');
const jwt = require('jsonwebtoken');
const Messages = require('../../../src/models/messages');
const {itShouldRequireAuth} = require('../../helpers/auth_test_helper');

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

describe('/api/messages', () => {
    beforeEach( () => { server = require('../../../src/index'); } );
    afterEach( () => { server.close(); } );

    describe('GET /me', () => {
        let token;

        const userPayload = { id: 1, name: 'Test User' };

        beforeEach(() => {
            token = jwt.sign(userPayload, process.env.JWT_ACCESS_TOKEN, { expiresIn: '15m' });
    
            jest.spyOn(Messages, 'getAllMessages').mockImplementation(async (type) => {
                if (type === 'birthday') return [{ id: 1, text: 'Happy Birthday!' }];
                if (type === 'nameday') return [{ id: 2, text: 'Happy Nameday!' }];
                return null;
            });
        });
    
        afterEach(async () => {
            jest.restoreAllMocks();
            await server.close();
        });

        const exec = (type) => {
            const req = request(server).get('/api/messages');
            req.set('Authorization', `Bearer ${token}`);
            if (type) req.query({ type });
            return req;
        };

        itShouldRequireAuth(() => server, '/api/messages', 'get');

        it('should return 400 if type is not provided', async () => {
            const res = await exec(null);
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error', 'Invalid type');
        });
    
        it('should return 400 if type is invalid', async () => {
            const res = await exec('holiday');
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error', 'Invalid type');
        });
    
        it('should return 200 and birthday messages if type is birthday', async () => {
            const res = await exec('birthday');
            expect(res.status).toBe(200);
            expect(res.body).toEqual([{ id: 1, text: 'Happy Birthday!' }]);
        });
    
        it('should return 200 and nameday messages if type is nameday', async () => {
            const res = await exec('nameday');
            expect(res.status).toBe(200);
            expect(res.body).toEqual([{ id: 2, text: 'Happy Nameday!' }]);
        });
    
        it('should return 500 when an unhandled error occurs', async () => {
            Messages.getAllMessages.mockResolvedValue(null);
            const res = await exec('birthday');
            expect(res.status).toBe(500);
        });
    });
});

