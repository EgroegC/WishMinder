const pool = require('../config/db')();

class Contact {

  constructor({ id = null, user_id, name, surname, phone, email = null, birthdate = null, phone_hash = null, email_hash = null }) {
    if (!user_id) throw new Error('user_id is required');
    if (!phone) throw new Error('phone is required');
    if (!name && !surname) throw new Error('At least one of name or surname is required');


    this.id = id;
    this.user_id = user_id;
    this.name = name;
    this.surname = surname;
    this.phone = phone;
    this.email = email;
    this.birthdate = birthdate;
    this.phone_hash = phone_hash;
    this.email_hash = email_hash;
  }

  serialize() {
    const { phone_hash, email_hash, ...publicFields } = this;
    return publicFields;
  }

  async save() {
    const result = await pool.query(
      `INSERT INTO contacts (user_id, name, surname, phone, phone_hash, email, email_hash, birthdate)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        this.user_id, this.name, this.surname, this.phone,
        this.phone_hash, this.email, this.email_hash, this.birthdate
      ]
    );

    this.id = result.rows[0].id;
    this.created_at = result.rows[0].created_at;
    return result.rows[0];
  }

  async update() {
    const result = await pool.query(
      `UPDATE contacts 
       SET name = $1, surname = $2, phone = $3, phone_hash = $4, email = $5, email_hash = $6, birthdate = $7 
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
      [
        this.name, this.surname, this.phone, this.phone_hash, this.email,
        this.email_hash, this.birthdate, this.id, this.user_id
      ]
    );

    return result.rows[0];
  }

  static async findByPhoneHash(user_id, phoneHash) {
    const result = await pool.query(
      `SELECT * FROM contacts WHERE user_id = $1 AND phone_hash = $2`,
      [user_id, phoneHash]
    );
    if (result.rows.length) {
      return new Contact(result.rows[0]);
    }
    return null;
  }

  static async getAllContacts(user_id) {
    const result = await pool.query(
      `SELECT * FROM contacts WHERE user_id = $1 ORDER BY name ASC`,
      [user_id]
    );
    return result.rows;
  }

  static async deleteContact(contact_id, user_id) {
    const result = await pool.query(
      `DELETE FROM contacts WHERE id = $1 AND user_id = $2 RETURNING *`,
      [contact_id, user_id]
    );
    return result.rows[0];
  }
}

module.exports = Contact;