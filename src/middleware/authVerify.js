// src/middleware/authVerify.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_noise_123!';

module.exports = function(req, res, next) {
    // 🍪 Read the secure cookie packet straight out of the incoming browser cookie tray
    const token = req.cookies?.auth_token;

    if (!token) {
        return res.status(401).json({ 
            error: "Access Intercepted: Missing required session cookie stamp. Authentication required." 
        });
    }

    try {
        // 🔬 Verify signature integrity using our high-entropy secret seed key
        const decryptedPayload = jwt.verify(token, JWT_SECRET);
        
        // Append user identities into the request block so private paths downstream can use them
        req.user = decryptedPayload;
        
        next(); // Authorization checks clear! Wave them through the perimeter gates!
    } catch (err) {
        return res.status(401).json({ 
            error: "Access Denied: Invalid or expired session authentication signature.",
            details: err.message 
        });
    }
};
