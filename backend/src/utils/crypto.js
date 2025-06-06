const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY || Buffer.from(ENCRYPTION_KEY, 'base64').length !== 32) {
    throw new Error('Invalid or missing ENCRYPTION_KEY in .env');
}

function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = Buffer.from(ENCRYPTION_KEY, 'base64');

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(encrypted) {
    const [ivHex, tagHex, encryptedHex] = encrypted.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const encryptedData = Buffer.from(encryptedHex, 'hex');
    const key = Buffer.from(ENCRYPTION_KEY, 'base64');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
        decipher.update(encryptedData),
        decipher.final()
    ]);

    return decrypted.toString('utf8');
}

function hash(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}

module.exports = { encrypt, decrypt, hash };
