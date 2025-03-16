const validateUser = require('../../../../src/routes/validation/user_validation');

describe('validate_user', () => {

  let name, email, password;

  beforeEach(async () => {
    name = 'Test_user';
    email = 'test_user@gmail.com';
    password = '12345';
  });

  describe("test a valid user", () => {
    it("should return no error for a valid user", () => {

      const { error } = validateUser({ name, email, password });
      expect(error).toBeUndefined();
    });
  });

  describe("tets an invalid name", () => {
    it("should return an error if name is missing", () => {

      const { error } = validateUser({ email, password });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/name.*required/i);
    });

    it("Should return an error if name is too short", () => {
      name = 'Te';

      const { error } = validateUser({ name, email, password });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/name.*3 characters/i);
    });

    it('should return an error if name is too long', () => {
      name = "J".repeat(51);

      const { error } = validateUser({ name, email, password });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/name.*50 characters/i);
    });
  });

  describe('test an invalid email', () => {
    it("should return an error if email is missing", () => {

      const { error } = validateUser({ name, password });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/email.*required/i);
    });

    it("Should return an error if email is too short", () => {
      email = "e@gmail.com"

      const { error } = validateUser({ name, email, password });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/email.*12 characters/i);
    });

    it('should return an error if email is too long', () => {
      email = "J".repeat(256);

      const { error } = validateUser({ name, email, password });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/email.*255 characters/i);
    });

    it("should return an error if email is invalid", () => {
      email = 'not-an-email';

      const { error } = validateUser({ name, email, password });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/email.*valid/i);
    });
  });

  describe("test an invalid password", () => {
    it("should return an error if password is missing", () => {

      const { error } = validateUser({ name, email });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/password.*required/i);
    });

    it("should return an error if password is too short", () => {
      password = '123';

      const { error } = validateUser({ name, email, password });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/password.*5 characters/i);
    });

    it('should return an error if password is too long', () => {
      password = "J".repeat(256);

      const { error } = validateUser({ name, email, password });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/password.*255 characters/i);
    });
  });
})


