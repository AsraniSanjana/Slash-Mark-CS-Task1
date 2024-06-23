'use strict';

const crypto = require('crypto');
require('dotenv').config(); // Load .env file

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY_DES; // Must be 24 bytes (192 bits) in hexadecimal
const IV_LENGTH = 8; // For DES, this is 8 bytes

function encrypt(text) {
  console.log("Original text:", text);

  let iv = crypto.randomBytes(IV_LENGTH);
  console.log("Generated IV:", iv.toString('hex'));

  // Convert ENCRYPTION_KEY from hexadecimal string to Buffer
  let keyBuffer = Buffer.from(ENCRYPTION_KEY, 'hex');

  // Create cipher using Triple DES (3DES) in CBC mode
  let cipher = crypto.createCipheriv('des-ede3-cbc', keyBuffer, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  console.log("Encrypted text (partial):", encrypted);

  encrypted += cipher.final('hex');
  console.log("Encrypted text (final):", encrypted);

  let result = iv.toString('hex') + ':' + encrypted;
  console.log("Final encrypted result:", result);

  return result;
}

function decrypt(text) {
  console.log("Encrypted input:", text);

  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  console.log("Extracted IV:", iv.toString('hex'));

  let encryptedText = textParts.join(':');
  console.log("Extracted encrypted text:", encryptedText);

  // Convert ENCRYPTION_KEY from hexadecimal string to Buffer
  let keyBuffer = Buffer.from(ENCRYPTION_KEY, 'hex');

  // Create decipher using Triple DES (3DES) in CBC mode
  let decipher = crypto.createDecipheriv('des-ede3-cbc', keyBuffer, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  console.log("Decrypted text (partial):", decrypted);

  decrypted += decipher.final('utf8');
  console.log("Decrypted text (final):", decrypted);

  return decrypted;
}

module.exports = { decrypt, encrypt };
