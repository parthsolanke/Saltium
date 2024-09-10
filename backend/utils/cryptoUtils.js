// utils/cryptoUtils.js
const crypto = require('crypto');
const env = require('../config/env');
const algorithm = 'aes-256-cbc';

const deriveKey = (password, salt) => {
    return crypto.scryptSync(password, salt, 32);
};

encryptFile = (buffer) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const key = deriveKey(env.secretKey, salt);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

    const saltBuffer = Buffer.from(salt, 'hex');
    const bufferToSave = Buffer.concat([saltBuffer, iv, encrypted]);

    return bufferToSave;
};

decryptFile = (buffer) => {
    const salt = buffer.slice(0, 16).toString('hex');
    const iv = buffer.slice(16, 32);
    const encryptedData = buffer.slice(32);

    const key = deriveKey(env.secretKey, salt);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

    return decrypted;
};

module.exports = {
    encryptFile,
    decryptFile,
}
