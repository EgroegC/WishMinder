const pool = require('../../config/db');

class User {
    
    constructor({ id = null, name, email, password }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
      }
  
    async save() {
      const result = await pool.query(
        `INSERT INTO users (name, email, password)
         VALUES ($1, $2, $3) RETURNING *`,
        [this.name, this.email, this.password]
      );
      
      this.id = result.rows[0].id;

      return result.rows[0]; 
    }
  
    static async findByEmail(email) {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length) {
        return new User(result.rows[0]); 
      }
      return null;
    }

    static async findById(id) {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      if (result.rows.length) {
        return new User(result.rows[0]); 
      }
      return null;
    }

    static async update(id, { name, email, password }) {
        const result = await pool.query(
          `UPDATE users
           SET name = $1, email = $2, password = $3
           WHERE id = $4 RETURNING *`, [name, email, password, id]
        );
        return result.rows[0];
      }
  
    static async delete(email) {
      const result = await pool.query('DELETE FROM users WHERE email = $1 RETURNING *', [email]);
      return result.rows[0];
    }
  }

module.exports = User;