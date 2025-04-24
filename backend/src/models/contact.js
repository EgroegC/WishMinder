const pool = require('../config/db')();

class Contact {
    
  constructor({ id = null, user_id, name, surname, phone, email, birthdate }) {
    this.id = id;
    this.user_id = user_id;
    this.name = name;
    this.surname = surname;
    this.phone = phone; 
    this.email = email;
    this.birthdate = birthdate;
  }
  
  async save() {  
    const result = await pool.query(
      `INSERT INTO contacts (user_id, name, surname, phone, email, birthdate)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [this.user_id, this.name, this.surname, this.phone, this.email, this.birthdate]
      );
    
    this.id = result.rows[0].id;
    this.created_at = result.rows[0].created_at;
    
    return result.rows[0];
  }

  async update() {
    const result = await pool.query(
      `UPDATE contacts 
       SET name = $1, surname = $2, phone = $3, email = $4, birthdate = $5 
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [this.name, this.surname, this.phone, this.email, this.birthdate, this.id, this.user_id]
    );
  
    return result.rows[0];
  }
  

  static async findByPhoneNumber(user_id, phone) {
    const result = await pool.query('SELECT * FROM contacts WHERE phone = $1 AND user_id = $2', [phone, user_id]);
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

  static async getContactsWithBirthdayToday(user_id) {
    const result = await pool.query(`
      SELECT * FROM contacts 
      WHERE user_id = $1 
        AND EXTRACT(DAY FROM birthdate) = $2 
        AND EXTRACT(MONTH FROM birthdate) = $3
    `, [user_id, new Date().getDate(), new Date().getMonth() + 1]);
  
    return result.rows.map(row => new Contact(row));
  }
  
}

module.exports = Contact;