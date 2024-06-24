const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { encrypt, decrypt } = require('./AES');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const keyLengths = {
    '128': 16,
    '192': 24,
    '256': 32
};

// Endpoint for encryption
app.post('/encrypt', (req, res) => {
    const { text, encryptionKey, iv, keySize } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required.' });
    }
    if (!encryptionKey || encryptionKey.length !== keyLengths[keySize]) {
        return res.status(400).json({ error: `You have chosen AES-${keySize}. The encryption key length must be ${keyLengths[keySize]} bytes.` });
    }
    if (iv && iv.length !== 16) {
        return res.status(400).json({ error: 'For AES, IV length must be 16 bytes.' });
    }

    try {
        const encryptedText = encrypt(text, encryptionKey, iv, keySize);
        res.json({ encryptedText });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Encryption failed.' });
    }
});

// Endpoint for decryption
app.post('/decrypt', (req, res) => {
    const { text, encryptionKey, iv, keySize } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required.' });
    }
    if (!text.includes(':')) {
        return res.status(400).json({ error: 'For decryption, text must be in the format IV:ciphertext.' });
    }
    if (!encryptionKey || encryptionKey.length !== keyLengths[keySize]) {
        return res.status(400).json({ error: `You have chosen AES-${keySize}. The encryption key length must be ${keyLengths[keySize]} bytes.` });
    }
    if (!iv || iv.length !== 16) {
        return res.status(400).json({ error: 'For AES, IV length must be 16 bytes.' });
    }

    try {
        const decryptedText = decrypt(text, encryptionKey, iv, keySize);
        res.json({ decryptedText });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Decryption failed.' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
