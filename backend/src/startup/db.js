const pool = require('../config/db')();
const logger = require('../config/logger')();
const config = require("config");

module.exports = function () {
    pool.connect()
        .then(() => logger.info(`Connected to the ${config.get("database.name")} database`))
}
