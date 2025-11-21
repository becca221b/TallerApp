import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../app';


describe('POST /api/auth/register', () => {
    
    it('should login and register an user', async () => {
        // 1. First, register a new user
        const registerResponse = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testlogin',
                name: 'Test Login',
                email: 'testlogin@example.com',
                password: 'testpass123',
                role: 'costurero'
            });
            
        expect(registerResponse.status).toBe(201);
        console.log('Registration successful:', registerResponse.body);
        
        // 2. Now try to login with the same credentials
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'testlogin',
                password: 'testpass123'
            });
            
        console.log('Login response:', {
            status: loginResponse.status,
            body: loginResponse.body
        });
        
        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body).toHaveProperty('token');
        expect(loginResponse.body).toHaveProperty('user');
        expect(loginResponse.body.user.username).toBe('testlogin');
    });
    
    it('should not login with invalid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'nonexistent',
                password: 'wrongpassword'
            });
            
        console.log('Invalid login response:', {
            status: response.status,
            body: response.body
        });
        
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toContain('Invalid credentials');
    });
});

