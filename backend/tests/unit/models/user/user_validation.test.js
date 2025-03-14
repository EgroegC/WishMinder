const validateUser = require("../../../../src/models/user/user_validation");

describe("validateUser for a valid user", () => {
    it("should return no error for a valid user", () => {
        const user = {
          name: "John Doe",
          email: "johndoe@example.com",
          password: "securePass123",
        };
    
        const { error } = validateUser(user);
        expect(error).toBeUndefined();
    });
});

describe("validateUser for invalid name", () => {
  it("should return an error if name is missing", () => {
    const user = {
      email: "johndoe@example.com",
      password: "securePass123",
    };

    const { error } = validateUser(user);
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/name.*required/i);
  });

  it("Should return an error if name is too short", () => {
    const user = {
        name: "Jo",
        email: "johndoe@example.com",
        password: "securePass123",
      };
  
      const { error } = validateUser(user);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/name.*3 characters/i);
  });

  it('should return an error if name is too long', () => {
    const longName = "J".repeat(51); 
    const user = { name: longName, email: "test@example.com", password: "password123" };
    const { error } = validateUser(user);
    expect(error).toBeDefined();
    expect(error.details[0].message).toMatch(/name.*50 characters/i);
  });
});

describe('validateUser for invalid email', () => {
    it("should return an error if email is missing", () => {
        const user = {
            name: "John Doe",
          password: "securePass123",
        };
    
        const { error } = validateUser(user);
        expect(error).toBeDefined();
        expect(error.details[0].message).toMatch(/email.*required/i);
      });
    
    it("Should return an error if email is too short", () => {
        const user = {
            name: "John Doe",
            email: "e@gmail.com",
            password: "securePass123",
          };
      
          const { error } = validateUser(user);
          expect(error).toBeDefined();
          expect(error.details[0].message).toMatch(/email.*12 characters/i);
    });
    
    it('should return an error if email is too long', () => {
        const longEmail = "J".repeat(256); 
        const user = { name: "John Doe", email: longEmail, password: "password123" };
        const { error } = validateUser(user);
        expect(error).toBeDefined();
        expect(error.details[0].message).toMatch(/email.*255 characters/i);
    });

    it("should return an error if email is invalid", () => {
        const user = {
          name: "John Doe",
          email: "not-an-email",
          password: "securePass123",
    };
    
        const { error } = validateUser(user);
        expect(error).toBeDefined();
        expect(error.details[0].message).toMatch(/email.*valid/i);
    });
});

describe("validateUser for invalid password", () => {
    it("should return an error if password is missing", () => {
        const user = {
            name: "John Doe",
            email: "johndoe@example.com"
        };
    
        const { error } = validateUser(user);
        expect(error).toBeDefined();
        expect(error.details[0].message).toMatch(/password.*required/i);
    });
    
    it("should return an error if password is too short", () => {
        const user = {
          name: "John Doe",
          email: "johndoe@example.com",
          password: "123",
        };
    
        const { error } = validateUser(user);
        expect(error).toBeDefined();
        expect(error.details[0].message).toMatch(/password.*5 characters/i);
    });
    
    it('should return an error if password is too long', () => {
        const longPassword = "J".repeat(256); 
        const user = { name: "John Doe", email: "johndoe@example.com", password: longPassword };
        const { error } = validateUser(user);
        expect(error).toBeDefined();
        expect(error.details[0].message).toMatch(/password.*255 characters/i);
    });
});
