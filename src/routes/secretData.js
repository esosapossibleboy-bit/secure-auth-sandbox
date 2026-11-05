// src/routes/secretData.js
const express = require('express');
const router = express.Router();
const authVerify = require('../middleware/authVerify'); // 🛡️ Import our custom guard middleware!

// Attach our guard straight onto this path axis to defend the room!
router.get('/dashboard', authVerify, (req, res) => {
    res.status(200).json({
        message: "🔓 WELCOME TO THE INNER CRYPTOGRAPHIC SECURE DESK!",
        secretIntelligencePayload: "This confidential text data can only be viewed when holding a verified HTTP-Only session cookie token!",
        sessionIdentity: req.user // Echoes back user data parsed from the verified cookie
    });
});

module.exports = router;
