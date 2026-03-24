import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth.routes.js';

// Mock the User model and jwt
jest.mock('../models/User.js');
jest.mock('../utils/jwt.js', () => ({
  generateTokens: jest.fn(() => ({ accessToken: 'mockAccess', refreshToken: 'mockRefresh' })),
  setTokenCookies: jest.fn(),
  clearTokenCookies: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          // Missing other fields
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });

    it('should return 400 for invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          email: 'invalid-email',
          password: 'password123',
          role: 'adopter',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.errors[0].msg).toEqual('Please include a valid email');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 if email or password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
        });

      expect(res.statusCode).toEqual(400);
    });
  });
});
