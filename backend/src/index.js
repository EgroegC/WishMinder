require("dotenv").config();
require('express-async-errors');
const express = require('express');
const logger = require('./config/logger')();
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./config/jwt')();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => logger.info(`Listening on port ${port}...`));

module.exports = server;