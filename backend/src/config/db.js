const { Pool } = require("pg");
require("dotenv").config({ path: __dirname + "/../../.env" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("Connected to the database"))
  .catch(err => console.error("Database connection error:", err));

module.exports = pool;
