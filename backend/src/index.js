const pool = require('./config/db');
const users = require('./routes/users');
const express = require('express');
const app = express();

pool.connect()
  .then(() => console.log("Connected to the database"))
  .catch(err => console.error("Database connection error:", err));

app.use(express.json());
app.use('/api/users', users);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));