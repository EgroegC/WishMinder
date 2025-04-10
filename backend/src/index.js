require("dotenv").config();
require('express-async-errors');
require('./config/web_push_config')();
const express = require('express');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const logger = require('./config/logger')();
const app = express();

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true 
}));

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./config/jwt')();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => logger.info(`Listening on port ${port}...`));

module.exports = server;