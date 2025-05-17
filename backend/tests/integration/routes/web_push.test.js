require("dotenv").config();
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const webpush = require('web-push');
const PushSubscription = require('../../../src/models/push_subscription');
const User = require('../../../src/models/user');
const {itShouldRequireAuth} = require('../../helpers/auth_test_helper');
const { deleteAllPushSubscriptionsForUser } = require('../../helpers/push_subscription_helper');

jest.mock('web-push', () => ({
    setVapidDetails: jest.fn(),
    sendNotification: jest.fn(),
}));

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

const logger = require('../../../src/config/logger')();
const rollbar = require('../../../src/config/rollbar')();

describe('/api/notification', () => {
    beforeEach( () => { server = require('../../../src/index'); } );
    afterEach( () => { server.close(); } );

    let user, token;

    const createTokenAndUser = async () => {
        const hashedPassword = await bcrypt.hash('12345', 10);
        user = new User({ name: 'TestUser', email: 'test_user@gmail.com', password: hashedPassword });
        await user.save();
        token = jwt.sign({ id: user.id }, process.env.JWT_ACCESS_TOKEN);
    };

    describe('POST /subscribe', () => {

        beforeEach(async () => {
            await createTokenAndUser();
        });

        afterEach(async () => {
            await deleteAllPushSubscriptionsForUser(user.id);
            await User.delete(user.email);
        });

        const exec = (payload) => {
            return request(server)
              .post('/api/notification/subscribe')
              .set('Authorization', `Bearer ${token}`)
              .set('User-Agent', 'Jest Test Suite')
              .send(payload);
        };

        itShouldRequireAuth(() => server, '/api/notification/subscribe', 'post');

        it('should return 400 if input is invalid', async () => {
            const payload = {
                endpoint: '',
                keys: {}
            };
          
            const res = await exec(payload);
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
        });

        it('should return 201 and store subscription if input is valid', async () => {
            const payload = {
                endpoint: 'https://example.com/endpoint',
                expirationTime: null,
                keys: {
                  p256dh: 'p256dh-test-key',
                  auth: 'auth-test-key'
                }
            };
          
            const res = await exec(payload);
          
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('message', 'Subscription stored');
          
            const subs = await PushSubscription.getByUser(user.id);
            expect(subs.some(s => s.endpoint === payload.endpoint)).toBe(true);
        });
    });

    describe('POST /notification/send', () => {

        let payload;
        
        beforeEach(async () => {
          await createTokenAndUser();
      
          await PushSubscription.createOrUpdate(user.id, {
            endpoint: 'https://example.com/push',
            expiration_time: null,
            keys: {
              p256dh: 'fake-key',
              auth: 'fake-auth'
            }
          }, 'TestAgent/1.0');

          webpush.sendNotification.mockResolvedValue();

          payload = {
            title: 'Test Notification',
            body: 'This is a test notification',
            data: {
              url: 'http://example/url'
            }
          }
        });
      
        afterEach(async () => {
          await deleteAllPushSubscriptionsForUser(user.id);
          await User.delete(user.email);
          jest.clearAllMocks();
        });
      
        const exec = () => {
          return request(server)
            .post('/api/notification/send')
            .set('Authorization', `Bearer ${token}`)
            .send(payload);
        };
      
        it('should send push notification and respond with 200', async () => {
          const res = await exec();
      
          expect(res.status).toBe(200);
          expect(res.body.message).toMatch(/completed/i);
      
          expect(webpush.sendNotification).toHaveBeenCalledTimes(1);
          expect(webpush.sendNotification).toHaveBeenCalledWith(
            expect.objectContaining({
              endpoint: expect.any(String),
              keys: expect.any(Object)
            }),
            expect.any(String)
          );
        });
      
        it('should return 400 if payload is invalid', async () => {
          payload = {}
          const res = await exec();
      
          expect(res.status).toBe(400);
          expect(res.body.message).toMatch(/required/i);
        });
      
        it('should return 500 on unexpected failure', async () => {
            webpush.sendNotification.mockRejectedValue(new Error('Simulated failure'));
          
            const res = await exec();
          
            expect(res.status).toBe(500);
        });
    });
});

