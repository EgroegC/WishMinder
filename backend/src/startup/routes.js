const express = require('express');
const error = require('../middleware/error');
const users = require('../routes/users');
const auth = require('../routes/auth');
const contacts = require('../routes/contacts');
const namedays = require('../routes/namedays');
const {router: webpush} = require('../routes/web_push');

module.exports = function(app){
    app.use(express.json());
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/contacts', contacts);
    app.use('/api/namedays', namedays);
    app.use('/api/', webpush);
    app.use(error);
}