require("dotenv").config();
const { closePool } = require('../src/config/db');

module.exports = async () => {
    await closePool();
};