require("dotenv").config();
const request = require('supertest');
const jwt = require('jsonwebtoken');
const User = require('../../../src/models/user');
const CelebrationService = require('../../../src/services/celebration_service');
const Contact = require('../../../src/models/contact');
const {itShouldRequireAuth} = require('../../helpers/auth_test_helper');
const { insertTestNameday, clearNamedaysAndNames } = require('../../helpers/namedays_helper');
const { deleteAllContactsForUser } = require('../../helpers/contact_route_helper');

jest.mock('../../../src/config/rollbar', () => {
    const mRollbar = {
      error: jest.fn()
    };
    return () => mRollbar;
});
  
jest.mock('../../../src/config/logger', () => {
    return () => ({
      info: jest.fn(),
      error: jest.fn()
    });
});

describe('/api/celebrations/today', () => {
    beforeEach( () => { server = require('../../../src/index'); } );
    afterEach( () => { server.close(); } );

    describe('GET /', () => {

        let token, user;

        const createContact = async (id) => {
            const contact = new Contact({
                user_id: id,
                name: 'Γιώργος',
                surname: 'ContactSurname',
                phone: '+30748374',
                email: 'email@gmail.com',
                birthdate: new Date()
            });
            await contact.save();
        };
        
        beforeEach(async () => {
            user = new User({ name: 'TestUser', email: 'test_user@gmail.com', password: 'hashed' });
            await user.save();
            token = jwt.sign({ id: user.id }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '1h' });

            await insertTestNameday('Γιώργος', new Date());
        });
    
        afterEach(async () => {
            await User.delete(user.email);
            await clearNamedaysAndNames();
            await deleteAllContactsForUser(user.id);
        });

        itShouldRequireAuth(() => server, '/api/celebrations/today', 'get');
    
        it("should return 200 if at least a contact has celebrates", async () => {
            await createContact(user.id);

            const res = await request(server)
              .get("/api/celebrations/today")
              .set("Authorization", `Bearer ${token}`);
      
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0]).toHaveProperty("type", "birthday");
            expect(res.body[1]).toHaveProperty("type", "nameday");
            expect(res.body[1]).toHaveProperty("name", "Γιώργος");
        });
      
        it("should return empty array if no celebrations found", async () => {
            const res = await request(server)
              .get("/api/celebrations/today")
              .set("Authorization", `Bearer ${token}`);
      
            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });
      
        it("should return 500 if the service throws", async () => {
            jest
              .spyOn(CelebrationService, "getTodaysCelebrationsForUser")
              .mockRejectedValue(new Error("Simulated failure"));
      
            const res = await request(server)
              .get("/api/celebrations/today")
              .set("Authorization", `Bearer ${token}`);
      
            expect(res.status).toBe(500);
        });
    });
});

