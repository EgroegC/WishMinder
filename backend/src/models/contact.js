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

      static async findByPhoneNumber(phone) {
        const result = await pool.query('SELECT * FROM contacts WHERE phone = $1', [phone]);
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
  }

module.exports = Contact;