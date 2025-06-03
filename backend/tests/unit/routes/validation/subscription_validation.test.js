const { validatePushSubscription } = require('../../../../src/routes/validation/subscription_validation');

describe('validate_subscription', () => {
  let endpoint, expirationTime, keys;

  beforeEach(() => {
    endpoint = 'https://example.com/push';
    expirationTime = null;
    keys = {
      p256dh: 'someKey',
      auth: 'someAuth'
    };
  });

  describe("valid subscription", () => {
    it("should return no error for a valid subscription", () => {
      const { error } = validatePushSubscription({ endpoint, expirationTime, keys });
      expect(error).toBeUndefined();
    });

    it("should work without expirationTime", () => {
      const { error } = validatePushSubscription({ endpoint, keys });
      expect(error).toBeUndefined();
    });
  });

  describe("invalid endpoint", () => {
    it("should return an error if endpoint is missing", () => {
      const { error } = validatePushSubscription({ expirationTime, keys });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/endpoint.*required/i);
    });

    it("should return an error if endpoint is not a URI", () => {
      endpoint = "not-a-uri";
      const { error } = validatePushSubscription({ endpoint, expirationTime, keys });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/endpoint.*uri/i);
    });
  });

  describe("invalid keys", () => {
    it("should return an error if keys is missing", () => {
      const { error } = validatePushSubscription({ endpoint, expirationTime });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/keys.*required/i);
    });

    it("should return an error if p256dh is missing", () => {
      delete keys.p256dh;
      const { error } = validatePushSubscription({ endpoint, expirationTime, keys });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/p256dh.*required/i);
    });

    it("should return an error if auth is missing", () => {
      delete keys.auth;
      const { error } = validatePushSubscription({ endpoint, expirationTime, keys });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/auth.*required/i);
    });

    it("should return an error if p256dh is not a string", () => {
      keys.p256dh = 12345;
      const { error } = validatePushSubscription({ endpoint, expirationTime, keys });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/p256dh.*string/i);
    });

    it("should return an error if p256dh is an empty string", () => {
      keys.p256dh = "";
      const { error } = validatePushSubscription({ endpoint, expirationTime, keys });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/p256dh.*not allowed to be empty/i);
    });

    it("should return an error if auth is not a string", () => {
      keys.auth = { token: "abc" };
      const { error } = validatePushSubscription({ endpoint, expirationTime, keys });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/auth.*string/i);
    });

    it("should return an error if auth is an empty string", () => {
      keys.auth = "";
      const { error } = validatePushSubscription({ endpoint, expirationTime, keys });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/auth.*not allowed to be empty/i);
    });
  });
});
