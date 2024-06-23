// AES.js

const crypto = require('crypto');

const IV_LENGTH = 16; // AES-256-CBC IV length is 16 bytes

function encrypt(text, encryptionKey, iv) {
    let ivBuffer;

    // Ensure IV is 16 ASCII characters
    if (iv) {
        if (iv.length !== 16) {
            throw new Error('IV must be 16 ASCII characters long.');
        }
        ivBuffer = Buffer.from(iv, 'ascii');
    } else {
        ivBuffer = crypto.randomBytes(IV_LENGTH);
    }

    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), ivBuffer);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    console.log("hi sanj, ivbuffer is " + ivBuffer + " iv is "+ iv)
    console.log("ivbuffer.tostring hex is " + ivBuffer.toString('hex')  + " ivbuffer.tostring ascii is " + ivBuffer.toString('ascii') )
    return ivBuffer.toString('ascii') + ':' + encrypted.toString('hex');
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
