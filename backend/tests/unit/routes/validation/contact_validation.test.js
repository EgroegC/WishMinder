const {validateContact} = require('../../../../src/routes/validation/contact_validation');

const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

describe('validate_contact', () => {

  let name, surname, email, phone, birthdate;

  beforeEach(async () => {
    name = 'Test_user';
    surname = 'Test_surname'
    email = 'test_user@gmail.com';
    phone = '6987213621'
    birthdate = oneYearAgo;
  });

  describe("test a valid contact", () => {
    const validPhones = ['+1234567890', '1234567890'];

    test.each(validPhones)("should validate contact with phone: %s", (phone) => {
      const { error } = validateContact({ name, surname, email, phone, birthdate });
      expect(error).toBeUndefined();
    });

    it("should validate contact without birthdate", () => {
        const { error } = validateContact({ name, surname, email, phone });
        expect(error).toBeUndefined();
    });
  });

  describe("tets an invalid name", () => {
    it("should return an error if name is missing", () => {

      const { error } = validateContact({ surname, email, phone, birthdate });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/name.*required/i);
    });

    it("Should return an error if name is too short", () => {
      name = 'Te';

      const { error } = validateContact({ name, surname, email, phone, birthdate });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/name.*3 characters/i);
    });

    it('should return an error if name is too long', () => {
      name = "J".repeat(51);

      const { error } = validateContact({ name, surname, email, phone, birthdate });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/name.*50 characters/i);
    });
  });

  describe("tets an invalid surname", () => {
    it("should return an error if surname is missing", () => {

      const { error } = validateContact({ name, email, phone, birthdate });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/surname.*required/i);
    });

    it("Should return an error if surname is too short", () => {
      surname = 'Su';

      const { error } = validateContact({ name, surname, email, phone, birthdate });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/surname.*3 characters/i);
    });

    it('should return an error if surname is too long', () => {
      surname = "J".repeat(51);

      const { error } = validateContact({ name, surname, email, phone, birthdate });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/surname.*50 characters/i);
    });
  });

  describe('test an invalid email', () => {
    it("should validate contact without email", () => {
      const { error } = validateContact({ name, surname, phone, birthdate });
      expect(error).toBeUndefined();
    });

    it("Should return an error if email is too short", () => {
      email = "e@gmail.com"

      const { error } = validateContact({ name, surname, email, phone, birthdate });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/email.*12 characters/i);
    });

    it('should return an error if email is too long', () => {
      email = "J".repeat(256);

      const { error } = validateContact({ name, surname, email, phone, birthdate });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/email.*255 characters/i);
    });

    it("should return an error if email is invalid", () => {
      email = 'not-an-email';

      const { error } = validateContact({ name, surname, email, phone, birthdate });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/email.*valid/i);
    });
  });

  describe("test an invalid phone", () => {
    it("should return an error if phone is missing", () => {

      const { error } = validateContact({ name, surname, email, birthdate });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/phone.*required/i);
    });

    it("should return an error if phone is too short", () => {
      phone = '3';

      const { error } = validateContact({ name, surname, email, phone, birthdate });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/phone.* valid/i);
    });

    it('should return an error if phone is too long', () => {
      phone = "+1234567890123457";

      const { error } = validateContact({ name, surname, email, phone, birthdate });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/phone.* valid/i);
    });

    it('should return an error if phone starts with 0', () => {
        phone = "+0123425";
  
        const { error } = validateContact({ name, surname, email, phone, birthdate });
        expect(error).toBeDefined();
        expect(error.details[0].message).toMatch(/phone.* valid/i);
    });

    it('should return an error if phone is non numeric', () => {
        phone = "+0123bb25";
  
        const { error } = validateContact({ name, surname, email, phone, birthdate });
        expect(error).toBeDefined();
        expect(error.details[0].message).toMatch(/phone.* valid/i);
    });
  });

  describe('test an invalid birthdate', () => {
    it("Should return an error if birthdate has not a valid format", () => {
      birthdate = "12/05/2002"

      const { error } = validateContact({ name, surname, email, phone, birthdate });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/birthdate.* format/i);
    });

    it("Should return an error if birthdate is not a valid Date", () => {
        birthdate = new Date();
  
        const { error } = validateContact({ name, surname, email, phone, birthdate });
        expect(error).toBeDefined();
        expect(error.details[0].message).toMatch(/birthdate.* at least one/i);
    });

    it("Should return an error if birthdate is not a parsable date ", () => {
        birthdate = 874373278; 
      
        const { error } = validateContact({ name, surname, email, phone, birthdate });
        expect(error).toBeDefined();
        expect(error.details[0].message).toMatch(/birthdate.* valid/i);
      });
  });
})


