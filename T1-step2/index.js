// index.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const { encrypt, decrypt } = require('./AES');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint for encryption
app.post('/encrypt', (req, res) => {
    const { text, encryptionKey, iv } = req.body;

    if (!text || !encryptionKey) {
        return res.status(400).json({ error: 'Missing required parameters.' });
    }
    try {
        const encryptedText = encrypt(text, encryptionKey, iv);
        res.json({ encryptedText });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Encryption failed.' });
    }
});

// Endpoint for decryption
app.post('/decrypt', (req, res) => {
    const { encryptedText, encryptionKey } = req.body;

    if (!encryptedText || !encryptionKey) {
        return res.status(400).json({ error: 'Missing required parameters.' });
    }
    try {
        const decryptedText = decrypt(encryptedText, encryptionKey);
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
