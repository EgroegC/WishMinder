const express = require('express');
const error = require('../middleware/error');
const users = require('../routes/users');
const auth = require('../routes/auth');
const contacts = require('../routes/contacts');
const namedays = require('../routes/namedays');
const webpush = require('../routes/web_push');
const todays_celebrations = require('../routes/todays_celebrations');
const messages = require('../routes/messages');
const health_check = require('../routes/health_check');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/contacts', contacts);
    app.use('/api/namedays', namedays);
    app.use('/api/notification', webpush);
    app.use('/api/celebrations/today', todays_celebrations);
    app.use('/api/messages', messages);
    app.use('/api/health', health_check);
    app.use(error);
}