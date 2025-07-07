const { Pool, types } = require("pg");
const config = require("config");

types.setTypeParser(1082, (val) => val);

let pool;

function createPool() {
  if (!process.env.DATABASE_PASSWORD) {
    throw new Error("FATAL ERROR: DATABASE_PASSWORD is not set in .env file");
  }

  const dbConfig = config.get("database");
  const isProduction = process.env.NODE_ENV === "production";

  return new Pool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: isProduction ? process.env.DATABASE_USER : dbConfig.user,
    password: process.env.DATABASE_PASSWORD,
    database: dbConfig.name,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  });
}

module.exports = {
  getPool: () => {
    if (!pool) {
      pool = createPool();
    }
    return pool;
  },
  closePool: async () => {
    if (pool && !pool.ended) {
      await pool.end();
    }
  },
};
