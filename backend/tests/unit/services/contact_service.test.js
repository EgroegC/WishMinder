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
});

describe('ContactService - normalizeContacts', () => {
  const knownNames = ['Γιώργος'];
  const service = new ContactService(knownNames);

  it('should correct each contact\'s name, surname, and phone', () => {
    const contacts = [{
      name: 'Alex',
      surname: 'γιωργος',
      phone: '+30 697-123-4567',
      email: '  test@example.com  ',
      birthdate: '1990-01-01'
    }];

    const [corrected] = service.normalizeContacts(contacts);
    expect(corrected.name).toBe('Γιώργος');
    expect(corrected.surname).toBe('Alex');
    expect(corrected.phone).toBe('+306971234567');
    expect(corrected.email).toBe('test@example.com');
    expect(corrected.birthdate instanceof Date).toBe(true);
  });

  it('should return an object without email and birthdate', () => {
    const contacts = [{
      name: 'Alex',
      surname: 'γιωργος',
      phone: '+30 697-123-4567',
    }];

    const [corrected] = service.normalizeContacts(contacts);
    expect(corrected.name).toBe('Γιώργος');
    expect(corrected.surname).toBe('Alex');
    expect(corrected.phone).toBe('+306971234567');
    expect(corrected.email).toBeUndefined();
    expect(corrected.birthdate).toBeUndefined();
  });

  it('should return the same object if name and surname are undifined', () => {
    const contacts = [{
      phone: '+30 697-123-4567',
    }];

    const [corrected] = service.normalizeContacts(contacts);
    expect(corrected.name).toBeUndefined();
    expect(corrected.surname).toBeUndefined();
    expect(corrected.phone).toBe('+30 697-123-4567');
    expect(corrected.email).toBeUndefined();
    expect(corrected.birthdate).toBeUndefined();
  });

  it('should return the same object if phone is undifined', () => {
    const contacts = [{
      name: 'Alex',
      surname: 'γιωργος',
    }];

    const [corrected] = service.normalizeContacts(contacts);
    expect(corrected.name).toBe('Alex');
    expect(corrected.surname).toBe('γιωργος');
    expect(corrected.phone).toBeUndefined();
    expect(corrected.email).toBeUndefined();
    expect(corrected.birthdate).toBeUndefined();
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


