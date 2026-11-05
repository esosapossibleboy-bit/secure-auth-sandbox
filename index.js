// index.js
require('dotenv').config();

const express = require('express');
const http = require('http');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// Grab our verified routing desk modules!
const authRouter = require('./src/routes/auth');
const secretRouter = require('./src/routes/secretData');

const app = express();
const PORT = process.env.PORT || 3020; 

// 🛡️ Content Security Policy (CSP) Security Armor
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", "http://localhost:3020"], // Connect streams strictly to our auth port
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            frameAncestors: ["'none'"]
        },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true
}));

app.use(cors({
    origin: 'http://localhost:5173', // 🎨 Targets our upcoming dedicated auth UI website portal
    credentials: true,               // 🚨 CRITICAL: Allows the browser to pass cookies back and forth across origins!
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(cookieParser()); // 🍪 Middleware: Unpacks incoming cookie envelopes so our guards can read them

// Connect Sandbox Route Branches
app.use('/api/auth', authRouter);
app.use('/api/private', secretRouter);

// Base health verification endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: "online", secure: true, service: "Armored Cookie Session Authorization Core" });
});

// ☁️ CONNECT TO CLOUD DB: Bind seamlessly to your Atlas Cluster database instance
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('☁️ MongoDB Atlas Engine Connected: User Account Table Initialized!'))
        .catch((err) => console.error('💥 Database initialization fault:', err.message));
}

const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
    console.log(`\n🗝️ ==================================================`);
    console.log(`🚀 AUTH FORTRESS SERVER ALIVE ON PORT ${PORT}!`);
    console.log(`🗝️ ==================================================`);
});

module.exports = app;
