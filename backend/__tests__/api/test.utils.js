import request from 'supertest';
import User from '../../models/user.model';

/**
 * Creates a test user and logs them in to get an authentication cookie.
 * @param {import('express').Application} app - The express app instance
 * @param {Object} userData - Optional user data override (defaults to admin)
 * @returns {Promise<{cookie: string[], user: Object}>}
 */
export async function getAuthCookie(app, userData = {}) {
    const defaultData = {
        name: 'Test Admin',
        email: `test-${Date.now()}@admin.com`,
        password: 'password123',
        role: 'admin'
    };
    
    const finalData = { ...defaultData, ...userData };
    
    // Create the user directly in the database to bypass registration logic if needed
    // or use the register endpoint. Direct creation is faster.
    const user = await User.create(finalData);

    // Login to get the cookie
    const response = await request(app)
        .post('/api/users/login')
        .send({
            email: finalData.email,
            password: finalData.password
        });

    const cookie = response.headers['set-cookie'];
    return { cookie, user };
}
