const pool = require('../config/db')();
const logger = require('../config/logger')();

module.exports = function(){
    pool.connect()
    .then(() => logger.info("Connected to the database"));
}
