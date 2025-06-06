const crypto = require('crypto');
const { encrypt, decrypt } = require('../../utils/crypto');
const Contact = require('../../models/contact');

function hash(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}

function encryptContact(contact) {
    if (!contact) return null;

    const data = {
        ...contact,
        name: contact.name ? contact.name : undefined,
        surname: contact.surname ? contact.surname : undefined,
        phone: contact.phone ? encrypt(contact.phone) : undefined,
        phone_hash: contact.phone ? hash(contact.phone) : undefined,
        email: contact.email ? encrypt(contact.email) : undefined,
        email_hash: contact.email ? hash(contact.email) : undefined,
        birthdate: contact.birthdate ? contact.birthdate : undefined,
    };

    Object.keys(data).forEach((key) => {
        if (data[key] == null) delete data[key];
    });

    return new Contact(data);
}

function decryptContact(contact) {
    if (!contact) return null;

    const data = {
        ...contact,
        name: contact.name ? contact.name : undefined,
        surname: contact.surname ? contact.surname : undefined,
        phone: contact.phone ? decrypt(contact.phone) : undefined,
        email: contact.email ? decrypt(contact.email) : undefined,
        birthdate: contact.birthdate ? contact.birthdate : undefined,
    };

    Object.keys(data).forEach((key) => {
        if (data[key] == null) delete data[key];
    });

    return new Contact(data);
}

module.exports = {
    encryptContact,
    decryptContact,
    hash
};
