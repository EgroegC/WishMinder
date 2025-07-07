require("dotenv").config();
const pool = require('../src/config/db')();

module.exports = async () => {
    if (!pool.ended) {
        await pool.end();
    }
};