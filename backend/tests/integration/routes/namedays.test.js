require("dotenv").config();
const request = require('supertest');
const jwt = require('jsonwebtoken');
const Nameday = require('../../../src/models/Nameday');
const User = require('../../../src/models/user');
const {itShouldRequireAuth} = require('../../helpers/auth_test_helper');

describe('/api/namedays', () => {
    beforeEach( () => { server = require('../../../src/index'); } );
    afterEach( () => { server.close(); } );

    describe('GET /upcomming', () => {

        let token, user;
        
        beforeEach(async () => {
            user = new User({ name: 'TestUser', email: 'test_user@gmail.com', password: 'hashed' });
            await user.save();
    
            token = jwt.sign({ id: user.id }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '1h' });
        });
    
        afterEach(async () => {
            await User.delete(user.email);
            await server.close();
        });

        itShouldRequireAuth(() => server, '/api/namedays/upcoming', 'get');
    
        it('should return 200 and the nameday list if token is valid', async () => {    
            const mockData = [
                { name: 'Γιώργος', date: '2025-05-18' },
                { name: 'Μαρία', date: '2025-05-20' }
            ];
    
            jest.spyOn(Nameday, 'getUpcomingNamedays').mockResolvedValue(mockData);
    
            const res = await request(server)
                .get('/api/namedays/upcoming')
                .set('Authorization', `Bearer ${token}`);
    
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(2);
            expect(res.body[0]).toHaveProperty('name', 'Γιώργος');
        });
    
        it('should return an empty array if no namedays found', async () => {
            jest.spyOn(Nameday, 'getUpcomingNamedays').mockResolvedValue([]);
    
            const res = await request(server)
                .get('/api/namedays/upcoming')
                .set('Authorization', `Bearer ${token}`);
    
            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });
    });
});

