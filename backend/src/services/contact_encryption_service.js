const { encrypt, hash, decrypt } = require('../utils/crypto');
const Contact = require('../models/contact');

function encryptContact(contact) {
    if (!contact) return null;

    return new Contact({
        ...contact,
        name: contact.name,
        surname: contact.surname,
        phone: contact.phone ? encrypt(contact.phone) : null,
        phone_hash: hash(contact.phone),
        email: contact.email ? encrypt(contact.email) : null,
        email_hash: hash(contact.email),
        birthdate: contact.birthdate,
    });
}

function decryptContact(contact) {
    if (!contact) return null;

    return new Contact({
        ...contact,
        name: contact.name,
        surname: contact.surname,
        phone: contact.phone ? decrypt(contact.phone) : null,
        email: contact.email ? decrypt(contact.email) : null,
        birthdate: contact.birthdate,
    });
}

module.exports = {
    encryptContact,
    decryptContact,
};
