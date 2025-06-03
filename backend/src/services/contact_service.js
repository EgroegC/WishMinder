const normalizeGreek = require('../utils/normalizeGreekNames');
const pool = require('../config/db')();

class ContactService {
  constructor(knownGreekNames) {
    this.normalizedMap = new Map();
    knownGreekNames.forEach((name) => {
      this.normalizedMap.set(normalizeGreek(name), name);
    });
  }

  normalizePhoneNumber = (phone) => {
    return phone.trim().replace(/(?!^\+)[^\d]/g, '');
  };

  correctNameAndSurname(name, surname) {
    const normName = normalizeGreek(name);
    const normSurname = normalizeGreek(surname);

    const nameMatch = this.normalizedMap.get(normName);
    const reverseNameMatch = this.normalizedMap.get(normSurname);

    const isSwapped = !nameMatch && reverseNameMatch

    if (isSwapped) {
      return {
        name: reverseNameMatch,
        surname: name,
      };
    }

    return {
      name: nameMatch || name,
      surname: surname,
    };
  }

  correctContacts(contacts) {
    return contacts.map((c) => {
      if (!c.name || !c.surname || !c.phone)
        return c;

      const phone = this.normalizePhoneNumber(c.phone);
      const { name, surname } = this.correctNameAndSurname(c.name, c.surname);

      const corrected = {
        name,
        surname,
        phone,
      };

      if (c.email && c.email.trim()) {
        corrected.email = c.email.trim();
      }

      if (c.birthdate) {
        const date = new Date(c.birthdate);
        corrected.birthdate = date;
      }

      return corrected;
    });
  }

  async importContacts(corrected, userId) {
    const deduped = this.deduplicateByUserAndPhone(corrected);
    if (deduped.length === 0) return { inserted: [], updated: [] };

    const contacts = deduped.map(contact => ({
      user_id: userId,
      ...contact,
    }));

    return await this.bulkInsertContacts(contacts);
  }

  async bulkInsertContacts(contacts) {
    const values = [];
    const placeholders = contacts
      .map((contact, i) => {
        const baseIndex = i * 6;
        values.push(
          contact.user_id,
          contact.name,
          contact.surname,
          contact.phone,
          contact.email,
          contact.birthdate
        );
        return `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6})`;
      })
      .join(', ');

    const query = `
      INSERT INTO contacts (user_id, name, surname, phone, email, birthdate)
      VALUES ${placeholders}
      ON CONFLICT (user_id, phone) DO UPDATE SET
        name = EXCLUDED.name,
        surname = EXCLUDED.surname,
        email = EXCLUDED.email,
        birthdate = EXCLUDED.birthdate
      RETURNING *, (xmax = 0) AS inserted;
    `;

    const result = await pool.query(query, values);

    const inserted = result.rows.filter(row => row.inserted).map(({ name, surname }) => ({ name, surname }));
    const updated = result.rows.filter(row => !row.inserted).map(({ name, surname }) => ({ name, surname }));

    return { inserted, updated };
  }

  deduplicateByUserAndPhone = (contacts) => {
    const seen = new Set();
    return contacts.filter(contact => {
      const key = `${contact.user_id}-${contact.phone}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

}

module.exports = ContactService;
