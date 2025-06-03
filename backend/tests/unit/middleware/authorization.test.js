require("dotenv").config();
const jwt = require('jsonwebtoken');
const User = require('../../../src/models/user');
const { authenticateToken } = require('../../../src/middleware/authorization');

describe('auth middleware', () => {
    it('should populate req.user with the payload of a valid JWT', () => {
        const user = new User({ id: 1, name: 'TestName', email: 'test_email@gmail.com', password: '12345' });
        const token = jwt.sign({ id: user.id }, process.env.JWT_ACCESS_TOKEN);
        const req = {
            header: jest.fn().mockReturnValue(`Bearer ${token}`)
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        const next = jest.fn();

        authenticateToken(req, res, next);

        expect(req.user).toBeDefined();
        expect(next).toHaveBeenCalled();
    })
});