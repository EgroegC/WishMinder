const { Pool } = require("pg");
const config = require("config");

module.exports = function(){
  if (!config.get("database.url")) {
    throw new Error("FATAL ERROR: DATABASE_URL is not set in .env file");
  }
  
  return new Pool({
    connectionString: config.get("database.url"),
  });
}