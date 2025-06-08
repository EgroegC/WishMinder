require("dotenv").config();
const ContactNormalizer = require('../../../src/services/contact/contact_normalizer_service');

describe('ContactNormalizer', () => {
    const knownNames = ['Γιώργος'];
    let service;

    beforeEach(() => {
        service = new ContactNormalizer(knownNames);
    });


    describe('ContactNormalizer - normalizePhoneNumber', () => {
        service = new ContactNormalizer([]);

        it('should remove non-digit characters except + at start', () => {
            expect(service.normalizePhoneNumber('+30 697-123 4567')).toBe('+306971234567');
        });

        it('should trim whitespace and normalize format', () => {
            expect(service.normalizePhoneNumber(' 697 123-4567 ')).toBe('6971234567');
        });

        it('should preserve + if at the beginning', () => {
            expect(service.normalizePhoneNumber('+306971234567')).toBe('+306971234567');
        });
    });

    describe('ContactNormalizer - normalizeAndResolveNameOrder', () => {

        it('should correct a reversed name and surname', () => {
            const { name, surname } = service.normalizeAndResolveNameOrder('Alex', 'Γιώργος');
            expect(name).toBe('Γιώργος');
            expect(surname).toBe('Alex');
        });

        it('should return original name and surname if no match', () => {
            const { name, surname } = service.normalizeAndResolveNameOrder('John', 'Doe');
            expect(name).toBe('John');
            expect(surname).toBe('Doe');
        });

        it('should correct casing if name matches normalized', () => {
            const { name } = service.normalizeAndResolveNameOrder('γιωργος', 'Smith');
            expect(name).toBe('Γιώργος');
        });

        it('should correct casing if name matches normalized without surname', () => {
            const { name } = service.normalizeAndResolveNameOrder('γιωργος');
            expect(name).toBe('Γιώργος');
        });

        it('should correct casing if surname matches normalized without name and swap', () => {
            const { name } = service.normalizeAndResolveNameOrder(undefined, 'γιωργος');
            expect(name).toBe('Γιώργος');
        });
    });

    describe('ContactNormalizer - normalizeContact', () => {

        it('should normalize and resolve swapped name/surname', () => {
            const input = {
                name: 'Alex',
                surname: 'γιωργος',
                phone: '+30 697-123-4567',
                email: '  test@example.com  ',
                birthdate: '1990-01-01'
            };

            const result = service.normalizeContact(input);

            expect(result.name).toBe('Γιώργος');
            expect(result.surname).toBe('Alex');
            expect(result.phone).toBe('+306971234567');
            expect(result.email).toBe('test@example.com');
            expect(result.birthdate instanceof Date).toBe(true);
        });

        it('should keep name and surname unchanged if no known name matched', () => {
            const input = {
                name: 'Anna',
                surname: 'Smith',
                phone: '123-456-7890',
            };

            const result = service.normalizeContact(input);

            expect(result.name).toBe('Anna');
            expect(result.surname).toBe('Smith');
            expect(result.phone).toBe('1234567890');
        });

        it('should return input unchanged if name/surname or phone is missing', () => {
            const input1 = { phone: '123' };
            const input2 = { name: 'Alex' };

            expect(service.normalizeContact(input1)).toEqual(input1);
            expect(service.normalizeContact(input2)).toEqual(input2);
        });

        it('should skip empty email and birthdate', () => {
            const input = {
                name: 'Alex',
                surname: 'γιωργος',
                phone: '+30 697-123-4567',
                email: '  ',
            };

            const result = service.normalizeContact(input);

            expect(result.email).toBeUndefined();
            expect(result.birthdate).toBeUndefined();
        });

        describe('ContactNormalizer - normalizeContacts', () => {

            it('should apply normalizeContact to each item in array', () => {
                const contacts = [
                    {
                        name: 'Alex',
                        surname: 'γιωργος',
                        phone: '+30 697-123-4567',
                    },
                    {
                        name: 'Anna',
                        surname: 'Smith',
                        phone: '123-456-7890',
                    }
                ];

                const result = service.normalizeContacts(contacts);

                expect(result.length).toBe(2);
                expect(result[0].name).toBe('Γιώργος');
                expect(result[0].surname).toBe('Alex');
                expect(result[0].phone).toBe('+306971234567');

                expect(result[1].name).toBe('Anna');
                expect(result[1].surname).toBe('Smith');
                expect(result[1].phone).toBe('1234567890');
            });

            it('should return empty array if input is empty', () => {
                const result = service.normalizeContacts([]);
                expect(result).toEqual([]);
            });
        });

        it('Return contact as is if name and surname are missing', () => {
            const input = {
                name: '',
                surname: '',
                phone: '(123) 456-7890'
            };

            const result = service.normalizeContact(input);
            expect(result).toEqual(input);
        });
    });

    describe('ContactNormalizer - splitFullNameIfNeeded', () => {
        it('splits full name into name and surname if surname is missing and name has two parts', () => {
            const result = service.splitFullNameIfNeeded('John Doe', '');
            expect(result).toEqual({ name: 'John', surname: 'Doe' });
        });

        it('does not split if surname is already provided', () => {
            const result = service.splitFullNameIfNeeded('John', 'Doe');
            expect(result).toEqual({ name: 'John', surname: 'Doe' });
        });

        it('does not split if name has more than two parts', () => {
            const result = service.splitFullNameIfNeeded('John Michael Doe', '');
            expect(result).toEqual({ name: 'John Michael Doe', surname: '' });
        });

        it('does not split if name has only one part', () => {
            const result = service.splitFullNameIfNeeded('John', '');
            expect(result).toEqual({ name: 'John', surname: '' });
        });

        it('trims spaces before splitting', () => {
            const result = service.splitFullNameIfNeeded('  John   Doe  ', '');
            expect(result).toEqual({ name: 'John', surname: 'Doe' });
        });

        it('returns as is if name is null or undefined and surname is undefined', () => {
            expect(service.splitFullNameIfNeeded(null, '')).toEqual({ name: null, surname: '' });
            expect(service.splitFullNameIfNeeded(undefined, '')).toEqual({ name: undefined, surname: '' });
        });
    });
});