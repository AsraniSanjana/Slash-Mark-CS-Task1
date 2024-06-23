// AES.js

const crypto = require('crypto');

const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text, encryptionKey, iv) {
    let ivBuffer;

    if (!iv) {
        ivBuffer = crypto.randomBytes(IV_LENGTH);
    } else {
        ivBuffer = Buffer.from(iv, 'hex');
    }

    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), ivBuffer);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    let result = ivBuffer.toString('hex') + ':' + encrypted;
    return result;
}

function decrypt(text, encryptionKey) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = textParts.join(':');

    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = { encrypt, decrypt };
