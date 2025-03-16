require("dotenv").config();
const jwt = require('jsonwebtoken');
const User = require('../../../src/models/user/user');
const authorization = require('../../../src/middleware/authorization');

describe('auth middleware', () => {
    it('should populate req.user with the payload of a valid JWT', () => {
        const user = new User({id: 1, name: 'TestName', email: 'test_email@gmail.com', password: '12345'});
        const token = jwt.sign({ id: user.id }, process.env.JOB_TRACKER_JWT_PRIVATE_KEY);
        const req = {
            header: jest.fn().mockReturnValue(token)
        };
        const res = {};
        const next = jest.fn();

        authorization(req, res, next);

        expect(req.user).toBeDefined();
    })
});