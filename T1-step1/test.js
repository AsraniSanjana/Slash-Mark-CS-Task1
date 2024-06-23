const { encrypt, decrypt } = require('./DES');

const text = "This is a longer plaintext input to demonstrate partial encryption.";
const encryptedText = encrypt(text);
console.log('Encrypted:', encryptedText);

const decryptedText = decrypt(encryptedText);
console.log('Decrypted:', decryptedText);
