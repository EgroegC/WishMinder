const pool = require('../config/db')();
const normalizeName = require('../utils/normalizeName');
const { encryptContact, decryptContact } = require('../services/contact_encryption_service');


class ContactService {
  constructor(knownNames) {
    this.normalizedMap = new Map();
    knownNames.forEach((name) => {
      this.normalizedMap.set(normalizeName(name), name);
    });
  }

  normalizePhoneNumber = (phone) => {
    return phone.trim().replace(/(?!^\+)[^\d]/g, '');
  };

  normalizeAndResolveNameOrder(name, surname) {
    const normName = normalizeName(name || "");
    const normSurname = normalizeName(surname || "");

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

  normalizeContacts(contacts) {
    return contacts.map((c) => {
      return this.normalizeContact(c);
    });
  }

  normalizeContact(c) {
    const hasNameOrSurname = !!(c.name || c.surname);
    const hasPhone = !!c.phone;

    if (!hasNameOrSurname || !hasPhone) return c;

    const { name, surname } = this.normalizeAndResolveNameOrder(c.name, c.surname);

    const corrected = {
      phone: this.normalizePhoneNumber(c.phone),
    };

    if (name) corrected.name = name;
    if (surname) corrected.surname = surname;

    if (c.email?.trim()) {
      corrected.email = c.email.trim();
    }

    if (c.birthdate) {
      corrected.birthdate = new Date(c.birthdate);
    }

    return corrected;
  }

  async importContacts(corrected, userId) {
    const deduped = this.deduplicateByUserAndPhone(corrected);
    if (deduped.length === 0) return { inserted: [], updated: [] };

    const contacts = deduped.map(contact =>
      encryptContact({
        user_id: userId,
        ...contact,
      })
    );

    return await this.bulkInsertContacts(contacts);
  }

  async bulkInsertContacts(contacts) {
    const values = [];
    const placeholders = contacts
      .map((contact, i) => {
        const base = i * 8;
        values.push(
          contact.user_id,
          contact.name,
          contact.surname,
          contact.phone,
          contact.phone_hash,
          contact.email,
          contact.email_hash,
          contact.birthdate
        );
        return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8})`;
      })
      .join(', ');

    const query = `
      INSERT INTO contacts (user_id, name, surname, phone, phone_hash, email, email_hash, birthdate)
      VALUES ${placeholders}
      ON CONFLICT (user_id, phone_hash) DO UPDATE SET
        name = EXCLUDED.name,
        surname = EXCLUDED.surname,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        email_hash = EXCLUDED.email_hash,
        birthdate = EXCLUDED.birthdate
      RETURNING *, (xmax = 0) AS inserted;
    `;

    const result = await pool.query(query, values);

    const inserted = [];
    const updated = [];

    for (const row of result.rows) {
      const decrypted = decryptContact(row);
      const serialized = decrypted.serialize?.();
      if (row.inserted) inserted.push(serialized);
      else updated.push(serialized);
    }

    return {
      inserted: inserted.filter(Boolean),
      updated: updated.filter(Boolean)
    };
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
