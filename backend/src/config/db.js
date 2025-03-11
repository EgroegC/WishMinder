const { Pool } = require("pg");
const config = require("config");

if (!config.get("database.url")) {
  throw new Error("FATAL ERROR: DATABASE_URL is not set in .env file");
}

const pool = new Pool({
  connectionString: config.get("database.url"),
});

module.exports = pool;
