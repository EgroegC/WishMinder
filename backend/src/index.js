require("dotenv").config();
require('express-async-errors');
require('./config/web_push')();
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('./config/logger')();
const app = express();

app.use(cookieParser());

require('./startup/cors')(app);
require('./startup/logging')();
require('./startup/routes')(app);
require('./config/jwt')();
require('./startup/prod')(app);
require('./startup/swagger')(app);

if (process.env.IS_TEST !== 'true') {
    require('./startup/db')();
}

const port = process.env.PORT || 3000;
const server = app.listen(port, () => logger.info(`Listening on port ${port}...`));

module.exports = server;