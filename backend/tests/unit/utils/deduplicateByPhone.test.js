const deduplicateByPhone = require('../../../src/utils/deduplicateByPhone');

describe('Utils - deduplicateByPhone', () => {

  it('should remove duplicate contacts based on user_id and phone', () => {
    const contacts = [
      { phone: '123' },
      { phone: '123' },
      { phone: '124' },
    ];

    const deduped = deduplicateByPhone(contacts);
    expect(deduped.length).toBe(2);
    expect(deduped[0]).toEqual({ phone: '123' });
    expect(deduped[1]).toEqual({ phone: '124' });
  });
});