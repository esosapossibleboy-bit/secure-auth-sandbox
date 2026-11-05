// src/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_noise_123!';

router.use(express.json());

// ⚡ NEW AUTH CHECK GATE: Verifies session cookies automatically upon browser reloads
router.get('/me', (req, res) => {
    const token = req.cookies?.auth_token;

    if (!token) {
        return res.status(401).json({ authenticated: false, error: "No active session cookie." });
    }

    try {
        const verifiedPayload = jwt.verify(token, JWT_SECRET);
        return res.status(200).json({
            authenticated: true,
            user: { username: verifiedPayload.username }
        });
    } catch (err) {
        return res.status(401).json({ authenticated: false, error: "Expired or invalid token." });
    }
});

// 📤 DESK GATE 1: Account Registration & Password Salting
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password || !username.trim() || !password.trim()) {
        return res.status(400).json({ error: "Missing required credential parameters." });
    }
    try {
        const normalizedName = username.trim().toLowerCase();
        const existingUser = await User.findOne({ username: normalizedName });
        if (existingUser) {
            return res.status(400).json({ error: "Handle name tag already claimed." });
        }
        const newUser = new User({ username: normalizedName, password: password.trim() });
        await newUser.save();
        res.status(201).json({ message: "🔒 Identity account secured and generated successfully!" });
    } catch (err) {
        res.status(400).json({ error: "Registration Rejected", details: err.message });
    }
});

// 📤 DESK GATE 2: Login and Secure Cookie Injection
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Missing identity credentials inputs." });
    }
    try {
        const normalizedName = username.trim().toLowerCase();
        const user = await User.findOne({ username: normalizedName });
        if (!user || !(await user.comparePassword(password.trim()))) {
            return res.status(401).json({ error: "Access Denied: Invalid credential profiles." });
        }

        const tokenToken = jwt.sign(
            { userId: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('auth_token', tokenToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000
        });

        res.status(200).json({
            message: "🔒 Login verification successful. Session token locked in browser cookie engine.",
            user: { username: user.username }
        });
    } catch (err) {
        res.status(500).json({ error: "Internal Auth Desk Error", details: err.message });
    }
});

// 📤 DESK GATE 3: Session Logout
router.post('/logout', (req, res) => {
    res.clearCookie('auth_token');
    res.status(200).json({ message: "Session closed. Security cookie wiped cleanly." });
});

module.exports = router;
