const { Pool } = require("pg");
const config = require("config");

const dbConfig = config.get("database");

module.exports = function () {
  if (!process.env.DATABASE_PASSWORD) {
    throw new Error("FATAL ERROR: DATABASE_PASSWORD is not set in .env file");
  }

  const isProduction = process.env.NODE_ENV === 'production';

  return new Pool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: process.env.DATABASE_PASSWORD,
    database: dbConfig.name,
    ssl: isProduction ? { rejectUnauthorized: false } : false
  });
}