const { Pool, types } = require("pg");
const config = require("config");

types.setTypeParser(1082, (val) => val);

const dbConfig = config.get("database");

module.exports = function () {
  if (!process.env.DATABASE_PASSWORD) {
    throw new Error("FATAL ERROR: DATABASE_PASSWORD is not set in .env file");
  }

  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && !process.env.DATABASE_USER) {
    throw new Error("FATAL ERROR: DATABASE_USER is not set in .env file");
  }

  return new Pool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: isProduction ? process.env.DATABASE_USER : dbConfig.user,
    password: process.env.DATABASE_PASSWORD,
    database: dbConfig.name,
    ssl: isProduction ? { rejectUnauthorized: false } : false
  });
};
