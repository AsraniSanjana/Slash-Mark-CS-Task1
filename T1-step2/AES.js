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


function decrypt(encryptedText, encryptionKey, iv) {
    let ivBuffer;

    // Ensure IV is 16 ASCII characters
    if (iv) {
        if (iv.length !== 16) {
            throw new Error('IV must be 16 ASCII characters long.');
        }
        ivBuffer = Buffer.from(iv, 'ascii');
    } else {
        throw new Error('IV is required for decryption.');
    }

    let textParts = encryptedText.split(':');
    let ivFromText = Buffer.from(textParts.shift(), 'ascii');
    if (!ivBuffer.equals(ivFromText)) {
        throw new Error('IV mismatch.');
    }

    let encryptedData = textParts.join(':');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), ivBuffer);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = { encrypt, decrypt };


console.log(decrypt("1234567890123456:a4965fb520031b0081688590f9046a71", "1234567890abcdef1234567890abcdef", "1234567890123456"));
