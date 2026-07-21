import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import mongoose from 'mongoose';

describe('Backend Core API Configuration', () => {
    // We close the mongoose connection after testing so vitest can exit cleanly
    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should successfully ping the root API endpoint', async () => {
        const response = await request(app).get('/');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Welcome to the POS API');
    });

    it('should block cors requests from unallowed origins', async () => {
        const response = await request(app)
            .get('/')
            .set('Origin', 'http://malicious-site.com');
            
        // Assuming your cors configuration blocks it, throwing a 500 error because express default CORS throws Error
        expect(response.status).toBe(500); 
    });
});
