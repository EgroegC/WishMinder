const auth_validate = require('../../../../src/routes/validation/auth_validation');

describe('validate_auth', () => {

    let email, password;

    beforeEach(async () => {
        email = 'test_user@gmail.com';
        password = '12345';
    });

    describe("test a valid user", () => {
        it("should return no error for a valid user", () => {

            const { error } = auth_validate({email, password});
            expect(error).toBeUndefined();
        });
    });

    describe('test an invalid email', () => {
        it("should return an error if email is missing", () => {
            
            const { error } = auth_validate({password: password});
            expect(error).toBeDefined();
            expect(error.details[0].message).toMatch(/email.*required/i);
        });

        it("Should return an error if email is too short", () => {
            email = 'e@gmail.com';

            const { error } = auth_validate({email, password});
            expect(error).toBeDefined();
            expect(error.details[0].message).toMatch(/email.*12 characters/i);
        });

        it('should return an error if email is too long', () => {
            email = "J".repeat(256);

            const { error } = auth_validate({email, password});
            expect(error).toBeDefined();
            expect(error.details[0].message).toMatch(/email.*255 characters/i);
        });

        it("should return an error if email is invalid", () => {
            email = "not-an-email"

            const { error } = auth_validate({email, password});
            expect(error).toBeDefined();
            expect(error.details[0].message).toMatch(/email.*valid/i);
        });
    });

    describe("test an invalid password", () => {
        it("should return an error if password is missing", () => {

            const { error } = auth_validate({email});
            expect(error).toBeDefined();
            expect(error.details[0].message).toMatch(/password.*required/i);
        });

        it("should return an error if password is too short", () => {
            password = '123';

            const { error } = auth_validate({email, password});
            expect(error).toBeDefined();
            expect(error.details[0].message).toMatch(/password.*5 characters/i);
        });

        it('should return an error if password is too long', () => {
            password = "J".repeat(256);
            
            const { error } = auth_validate({email, password});
            expect(error).toBeDefined();
            expect(error.details[0].message).toMatch(/password.*255 characters/i);
        });
    });
})


