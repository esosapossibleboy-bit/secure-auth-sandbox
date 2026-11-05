// src/tests/auth.test.js
const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('../routes/auth');
const secretRouter = require('../routes/secretData');
const User = require('../models/User');

// Mock User database layer to run rapid test cycles independently of live MongoDB networks
jest.mock('../models/User');

describe('🔑 Automated JWT Cookie Session Perimeter Authentication Testing Suite', () => {
    let app;

    beforeAll(() => {
        process.env.NODE_ENV = 'test';
        app = express();
        app.use(express.json());
        app.use(cookieParser());
        
        // Attach sandbox test route branches
        app.use('/api/auth', authRouter);
        app.use('/api/private', secretRouter);
    });

    it('should block unauthenticated intruders attempting to access the private dashboard', async () => {
        const response = await request(app).get('/api/private/dashboard');
        
        expect(response.status).toBe(401);
        expect(response.body.error).toContain('Missing required session cookie stamp');
    });

    it('should successfully pass user credential validations and issue an injection cookie', async () => {
        // Simulate database lookup behavior responses for valid credential queries
        User.findOne.mockResolvedValue({
            _id: 'mockUserId123',
            username: 'alice',
            comparePassword: async () => true // Hardcode passing verification
        });

        const response = await request(app)
            .post('/api/auth/login')
            .send({ username: 'alice', password: 'securePassword123' });

        expect(response.status).toBe(200);
        expect(response.body.message).toContain('Login verification successful');
        
        // 🔬 Verify an HttpOnly cookie named auth_token is issued inside headers
        const setCookieHeaders = response.headers['set-cookie'][0];
        expect(setCookieHeaders).toContain('auth_token=');
        expect(setCookieHeaders).toContain('HttpOnly');
    });
});
