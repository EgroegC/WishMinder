const validateDate = require('../../../../src/routes/validation/namedays_validation');

describe('validateDate', () => {
    it('should validate a correct date format YYYY-MM-DD', () => {
        const { error } = validateDate({ date: '2025-06-16' });
        expect(error).toBeUndefined();
    });

    it('should return error for incorrect date format (MM-DD-YYYY)', () => {
        const { error } = validateDate({ date: '06-16-2025' });
        expect(error).toBeDefined();
        expect(error.details[0].message).toBe('Date must be in YYYY-MM-DD format.');
    });

    it('should return error for missing date', () => {
        const { error } = validateDate({});
        expect(error).toBeDefined();
        expect(error.details[0].message).toMatch(/required/);
    });

    it('should return error for malformed date (letters)', () => {
        const { error } = validateDate({ date: 'not-a-date' });
        expect(error).toBeDefined();
        expect(error.details[0].message).toBe('Date must be in YYYY-MM-DD format.');
    });
});
