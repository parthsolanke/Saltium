const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.SECRET_KEY, 'salt', 32);

exports.encryptFile = (buffer) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return { iv, encryptedData: encrypted };
};

exports.decryptFile = (encryptedData, iv) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    return decrypted;
};
