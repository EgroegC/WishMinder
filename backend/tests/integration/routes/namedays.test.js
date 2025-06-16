require("dotenv").config();
const request = require('supertest');
const jwt = require('jsonwebtoken');
const NamedayService = require('../../../src/services/namedays_service');
const User = require('../../../src/models/user');
const { itShouldRequireAuth } = require('../../helpers/auth_test_helper');
const { insertTestNameday, clearNamedaysAndNames } = require('../../helpers/namedays_helper');

describe('/api/namedays', () => {
    beforeEach(() => { server = require('../../../src/index'); });
    afterEach(() => { server.close(); });

    describe('GET /upcomming', () => {

        let token, user;
        const fiveDaysLater = new Date();
        const twoDaysLater = new Date();
        fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);
        twoDaysLater.setDate(twoDaysLater.getDate() + 2);

        beforeEach(async () => {
            user = new User({ name: 'TestUser', email: 'test_user@gmail.com', password: 'hashed' });
            await user.save();
            token = jwt.sign({ id: user.id }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '1h' });

            await insertTestNameday('Γιώργος', twoDaysLater);
            await insertTestNameday('Μαρία', fiveDaysLater);
        });

        afterEach(async () => {
            await User.delete(user.email);
            await clearNamedaysAndNames();
        });

        itShouldRequireAuth(() => server, '/api/namedays/upcoming', 'get');

        it('should return 200 and the nameday list if token is valid', async () => {
            const res = await request(server)
                .get('/api/namedays/upcoming')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(2);
            expect(res.body[0]).toHaveProperty('name', 'Γιώργος');
        });

        it('should return an empty array if no namedays found', async () => {
            jest.spyOn(NamedayService, 'getUpcomingNamedays').mockResolvedValue([]);

            const res = await request(server)
                .get('/api/namedays/upcoming')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);

            NamedayService.getUpcomingNamedays.mockRestore();
        });

        it('should return 500 when an unhandled error occurs', async () => {
            jest.spyOn(NamedayService, 'getUpcomingNamedays').mockRejectedValue(
                new Error('Unexpected failure')
            );

            const res = await request(server)
                .get('/api/namedays/upcoming')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(500);
            NamedayService.getUpcomingNamedays.mockRestore();
        });
    });

    describe('/api/namedays/:date', () => {
        const testDate = new Date().toISOString().split('T')[0];

        beforeEach(async () => {
            await insertTestNameday('Γιώργος', new Date(testDate));
            await insertTestNameday('Γεωργία', new Date(testDate));
        });

        afterEach(async () => {
            await clearNamedaysAndNames();
        });

        it('should return 200 and the nameday list for a valid date', async () => {
            const res = await request(server).get(`/api/namedays/${testDate}`)

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ name: 'Γιώργος' }),
                    expect.objectContaining({ name: 'Γεωργία' }),
                ])
            );
        });

        it('should return 400 for invalid date format', async () => {
            const res = await request(server).get('/api/namedays/16-06-2025')

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Date must be in YYYY-MM-DD format.');
        });

        it('should return an empty array if no namedays found', async () => {
            await clearNamedaysAndNames();

            const res = await request(server).get(`/api/namedays/${testDate}`)

            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });

        it('should return 500 when an unhandled error occurs', async () => {
            jest.spyOn(NamedayService, 'getNamedaysByDate').mockRejectedValue(
                new Error('Unexpected failure')
            );

            const res = await request(server).get(`/api/namedays/${testDate}`)

            expect(res.status).toBe(500);

            NamedayService.getNamedaysByDate.mockRestore();
        });
    });

});

