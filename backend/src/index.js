require("dotenv").config();
require('express-async-errors');
const error = require('./middleware/error');
const config = require('config');
const pool = require('./config/db');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const app = express();

require('./startup/logging')();

if (!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

pool.connect()
  .then(() => console.log("Connected to the database"))
  .catch(err => console.error("Database connection error:", err));

app.use(express.json());
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));