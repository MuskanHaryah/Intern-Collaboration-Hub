import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import authRoutes from '../../routes/auth.js';
import User from '../../models/User.js';

// Mock the User model
jest.unstable_mockModule('../../models/User.js', () => ({
  default: {
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  },
}));

// Mock JWT
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: jest.fn(() => 'mock-token'),
    verify: jest.fn(() => ({ id: 'user-id' })),
  },
}));

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  
  // Error handler
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      status: 'error',
      message: err.message,
    });
  });
  
  return app;
};

describe('Auth Routes', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        _id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'intern',
        toJSON: function() {
          return {
            _id: this._id,
            name: this.name,
            email: this.email,
            role: this.role,
          };
        },
      };

      User.findOne.mockResolvedValue(null); // User doesn't exist
      User.create.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Test123!',
          role: 'intern',
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.token).toBe('mock-token');
    });

    it('should reject registration with existing email', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com' });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Test123!',
          role: 'intern',
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          // Missing email and password
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user with valid credentials', async () => {
      const mockUser = {
        _id: 'user-id',
        email: 'test@example.com',
        password: 'hashedPassword',
        comparePassword: jest.fn().mockResolvedValue(true),
        toJSON: function() {
          return {
            _id: this._id,
            email: this.email,
          };
        },
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test123!',
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.token).toBe('mock-token');
    });

    it('should reject login with invalid email', async () => {
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'Test123!',
        });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
    });

    it('should reject login with invalid password', async () => {
      const mockUser = {
        email: 'test@example.com',
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
    });
  });
});
