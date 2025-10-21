import request from 'supertest';
import { describe, it, expect, beforeEach, vi, beforeAll, afterAll } from 'vitest';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from '../routes/auth.routes';
import { UserModel } from '../models/UserModel';
import { UserRepository } from '../repositories/UserRepository';
import { RegisterUser } from '@/domain/use-cases/register-user';
import { LoginUser } from '@/domain/use-cases/login-user';
import { AuthController } from '../controllers/auth-controller';

// Mock the UserRepository
vi.mock('../repositories/UserRepository');

const app = express();
app.use(express.json());
app.use(authRoutes);

// Clear mongoose models before each test
const clearModels = () => {
  const modelNames = Object.keys(mongoose.connection.models);
  for (const modelName of modelNames) {
    delete (mongoose.connection.models as any)[modelName];
  }
};

describe('Auth Routes', () => {
  beforeAll(async () => {
    // Connect to the in-memory database
    await mongoose.connect('mongodb://localhost:27017/testdb');
  });

  afterAll(async () => {
    // Close the database connection after all tests
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear all mocks and models before each test
    vi.clearAllMocks();
    clearModels();
    
    // Clear the database
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        password: 'Test@1234',
        role: 'employee'
      };

      const response = await request(app)
        .post('/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Usuario registrado exitosamente');
      expect(response.body.user).toHaveProperty('username', userData.username);
      expect(response.body.user).toHaveProperty('role', userData.role);
      expect(response.body.user).not.toHaveProperty('password');
      expect(response.body.user).not.toHaveProperty('passwordHash');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/register')
        .send({ username: 'incomplete' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 if username is already taken', async () => {
      // First registration
      await request(app)
        .post('/register')
        .send({
          username: 'existinguser',
          password: 'Test@1234',
          role: 'employee'
        });

      // Try to register with same username
      const response = await request(app)
        .post('/register')
        .send({
          username: 'existinguser',
          password: 'Test@1234',
          role: 'employee'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /login', () => {
    const testUser = {
      username: 'testuser',
      password: 'Test@1234',
      role: 'employee'
    };

    beforeEach(async () => {
      // Register a test user before login tests
      await request(app)
        .post('/register')
        .send(testUser);
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          username: testUser.username,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login exitoso');
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 with invalid password', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          username: testUser.username,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 with non-existent username', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          username: 'nonexistent',
          password: 'anypassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });
});
