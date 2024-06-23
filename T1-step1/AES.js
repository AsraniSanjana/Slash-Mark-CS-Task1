'use strict';

const crypto = require('crypto');
require('dotenv').config(); // Load .env file

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text) {
  console.log("Original text:", text);

  let iv = crypto.randomBytes(IV_LENGTH);
  console.log("Generated IV:", iv.toString('hex'));

  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  console.log("Partial encrypted text:", encrypted.toString('hex'));

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  console.log("Final encrypted text:", encrypted.toString('hex'));

  let result = iv.toString('hex') + ':' + encrypted.toString('hex');
  console.log("Final encrypted result:", result);

  return result;
}

function decrypt(text) {
  console.log("Encrypted input:", text);

  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  console.log("Extracted IV:", iv.toString('hex'));

  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  console.log("Extracted encrypted text:", encryptedText.toString('hex'));

  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  console.log("Partial decrypted text:", decrypted.toString());

  decrypted = Buffer.concat([decrypted, decipher.final()]);
  console.log("Final decrypted text:", decrypted.toString());

  return decrypted.toString();
}

module.exports = { decrypt, encrypt };
