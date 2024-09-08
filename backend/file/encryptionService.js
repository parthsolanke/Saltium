const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = process.env.SECRET_KEY;
const iv = crypto.randomBytes(16);

exports.encryptFile = async (buffer) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return { iv, encryptedData: encrypted };
};

exports.decryptFile = async (encryptedData, iv) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    return decrypted;
};
