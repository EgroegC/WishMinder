const { validateNotificationPayload } = require('../../../../src/routes/validation/subscription_validation');

describe('validate_notification_payload', () => {
  let title, body, data;

  beforeEach(() => {
    title = "New Notification";
    body = "You have a new message.";
    data = {
      url: "https://example.com/view"
    };
  });

  describe("valid payload", () => {
    it("should return no error for a valid payload", () => {
      const { error } = validateNotificationPayload({ title, body, data });
      expect(error).toBeUndefined();
    });
  });

  describe("invalid title", () => {
    it("should return an error if title is missing", () => {
      const { error } = validateNotificationPayload({ body, data });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/title.*required/i);
    });

    it("should return an error if title is too long", () => {
      title = "A".repeat(101);
      const { error } = validateNotificationPayload({ title, body, data });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/title.*100 characters/i);
    });
  });

  describe("invalid body", () => {
    it("should return an error if body is missing", () => {
      const { error } = validateNotificationPayload({ title, data });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/body.*required/i);
    });

    it("should return an error if body is too long", () => {
      body = "B".repeat(501);
      const { error } = validateNotificationPayload({ title, body, data });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/body.*500 characters/i);
    });
  });

  describe("invalid data", () => {
    it("should return an error if data is missing", () => {
      const { error } = validateNotificationPayload({ title, body });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/data.*required/i);
    });

    it("should return an error if url is missing in data", () => {
      delete data.url;
      const { error } = validateNotificationPayload({ title, body, data });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/url.*required/i);
    });

    it("should return an error if url is not a valid URI", () => {
      data.url = "invalid-url";
      const { error } = validateNotificationPayload({ title, body, data });
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/url.*uri/i);
    });
  });
});
