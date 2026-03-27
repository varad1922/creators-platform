import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app.js';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
});

afterEach(async () => {
    if (mongoose.connection.readyState !== 0) {
        await User.deleteMany({});
    }
});

afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
    }
});

describe('Auth Routes', () => {
    const testUser = {
        name: 'Test Tester',
        email: 'test@example.com',
        password: 'password123'
    };

    describe('POST /api/auth/register', () => {
        test('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('email', testUser.email);
        });

        test('should fail registration with existing email', async () => {
            // Register once
            await request(app).post('/api/auth/register').send(testUser);

            // Register again
            const res = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(res.status).toBe(400);
        });

        test('should fail registration with missing fields', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ email: 'missing-rest@example.com' });

            expect(res.status).toBe(400);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Register a user before each login test
            await request(app).post('/api/auth/register').send(testUser);
        });

        test('should login with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        test('should fail login with wrong password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                });

            expect(res.status).toBe(401);
        });
    });
});
