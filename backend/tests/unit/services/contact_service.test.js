require("dotenv").config();
const ContactService = require('../../../src/services/contact_service');

describe('ContactService - normalizePhoneNumber', () => {
  const service = new ContactService([]);

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

describe('ContactService - normalizeAndResolveNameOrder', () => {
  const knownNames = ['Γιώργος'];
  const service = new ContactService(knownNames);

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

describe('ContactService - normalizeContact', () => {
  const knownNames = ['Γιώργος'];
  let service;

  beforeEach(() => {
    service = new ContactService(knownNames);
  });

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

  describe('ContactService - normalizeContacts', () => {
    const knownNames = ['Γιώργος'];
    let service;

    beforeEach(() => {
      service = new ContactService(knownNames);
    });

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


describe('ContactService - deduplicateByUserAndPhone', () => {
  const service = new ContactService([]);

  it('should remove duplicate contacts based on user_id and phone', () => {
    const contacts = [
      { user_id: 1, phone: '123' },
      { user_id: 1, phone: '123' },
      { user_id: 2, phone: '123' },
    ];

    const deduped = service.deduplicateByUserAndPhone(contacts);
    expect(deduped.length).toBe(2);
    expect(deduped[0]).toEqual({ user_id: 1, phone: '123' });
    expect(deduped[1]).toEqual({ user_id: 2, phone: '123' });
  });
});


