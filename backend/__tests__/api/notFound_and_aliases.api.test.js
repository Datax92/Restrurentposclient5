import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../index.js';
import '../setup.db.js';

describe('404 Handling & Route Aliases API Tests', () => {
    it('should return structured JSON 404 for unmatched API route', async () => {
        const response = await request(app).get('/api/unmapped-endpoint-test-404');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body.message).toContain('Route not found: GET /api/unmapped-endpoint-test-404');
    });

    it('should return 401 Unauthorized for /api/tables (alias) instead of 404 Not Found without auth', async () => {
        const response = await request(app).get('/api/tables');
        // Requires authentication, so status should be 401 Unauthorized, NOT 404 Not Found!
        expect(response.status).toBe(401);
        expect(response.body.message).toContain('Unauthorized');
    });

    it('should return 200 OK for /api/categories (alias)', async () => {
        const response = await request(app).get('/api/categories');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('categories');
    });

    it('should return 200 OK for /api/items (alias)', async () => {
        const response = await request(app).get('/api/items');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('menuItems');
    });
});
