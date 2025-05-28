const normalizeGreek = require('../utils/normalizeGreekNames');
const pool = require('../config/db')();

class ContactService {
  constructor(knownGreekNames) {
    this.normalizedMap = new Map();
    knownGreekNames.forEach((name) => {
      this.normalizedMap.set(normalizeGreek(name), name);
    });
  }

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
  

  async importContacts(contacts, userId) {
    const corrected = contacts.map((c) => {
      const { name, surname } = this.correctNameAndSurname(c.name, c.surname);
      return {
        user_id: userId,
        name,
        surname,
        phone: c.phone,
        email: c.email || null,
        birthdate: c.birthdate ? new Date(c.birthdate) : null,
      };
    });

    if (corrected.length === 0) return [];

    this.bulkInsertContacts(corrected);
   
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
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }
}

module.exports = ContactService;
