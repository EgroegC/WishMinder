const pool = require('../../config/db')();
const deduplicateByPhone = require('../../utils/deduplicateByPhone');


class ContactImporter {
    constructor({ encryptContact, decryptContact, db }) {
        this.encryptContact = encryptContact;
        this.decryptContact = decryptContact;
    }

    async importContacts(contacts, userId) {
        const enrichedContacts = contacts.map(c => ({ ...c, user_id: userId }));

        const deduped = deduplicateByPhone(enrichedContacts);
        if (deduped.length === 0) return { inserted: [], updated: [] };

        const encryptedContacts = deduped.map(this.encryptContact);
        return await this.bulkInsertContacts(encryptedContacts);
    }

    async bulkInsertContacts(contacts) {
        const values = [];
        const placeholders = contacts.map((contact, i) => {
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
        }).join(', ');

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
            const decrypted = this.decryptContact(row);
            const summary = {};
            if (decrypted.name) summary.name = decrypted.name;
            if (decrypted.surname) summary.surname = decrypted.surname;

            (row.inserted ? inserted : updated).push(summary);
        }

        return { inserted, updated };
    }
}

module.exports = ContactImporter;
