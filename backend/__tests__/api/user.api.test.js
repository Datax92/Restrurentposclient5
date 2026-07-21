import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../index';
import User from '../../models/user.model';
import { getAuthCookie } from './test.utils';

describe('User & Staff API', () => {
    describe('Authentication', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/users/register')
                .send({
                    name: 'New User',
                    email: 'newuser@test.com',
                    password: 'password123',
                    role: 'client'
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.user.email).toBe('newuser@test.com');
            expect(res.headers['set-cookie']).toBeDefined();
        });

        it('should login an existing user', async () => {
            const password = 'password123';
            const user = await User.create({
                name: 'Login User',
                email: 'login@test.com',
                password: password
            });

            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: user.email,
                    password: password
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.headers['set-cookie']).toBeDefined();
        });

        it('should return 401 for invalid login', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'wrong@test.com',
                    password: 'wrongpassword'
                });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should get current user profile when logged in', async () => {
            const { cookie, user } = await getAuthCookie(app);

            const res = await request(app)
                .get('/api/users/me')
                .set('Cookie', cookie);

            expect(res.status).toBe(200);
            expect(res.body._id).toBe(user._id.toString());
            expect(res.body.email).toBe(user.email);
        });

        it('should logout correctly', async () => {
            const { cookie } = await getAuthCookie(app);

            const res = await request(app)
                .post('/api/users/logout')
                .set('Cookie', cookie);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            // Check if cookie is cleared (has 'Max-Age=0' or similar)
            expect(res.headers['set-cookie'][0]).toMatch(/token=;/);
        });
    });

    describe('Staff Management (Admin Only)', () => {
        let adminCookie;

        beforeEach(async () => {
            const auth = await getAuthCookie(app, { role: 'admin' });
            adminCookie = auth.cookie;
        });

        it('should allow admin to get all staff', async () => {
            const res = await request(app)
                .get('/api/users/staff')
                .set('Cookie', adminCookie);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.staff)).toBe(true);
        });

        it('should allow admin to create new staff member', async () => {
            const res = await request(app)
                .post('/api/users/staff')
                .set('Cookie', adminCookie)
                .send({
                    name: 'New Staff',
                    email: 'staff@test.com',
                    password: 'password123',
                    role: 'cashier',
                    designation: 'Front Desk'
                });

            expect(res.status).toBe(201);
            expect(res.body.user.role).toBe('cashier');
        });

        it('should block non-admin from creating staff', async () => {
            const { cookie } = await getAuthCookie(app, { role: 'cashier', email: 'cashier@test.com' });
            
            const res = await request(app)
                .post('/api/users/staff')
                .set('Cookie', cookie)
                .send({ name: 'Hack Attack' });

            expect(res.status).toBe(403);
        });

        it('should allow admin to update staff status', async () => {
            const staff = await User.create({
                name: 'Active Staff',
                email: 'active@test.com',
                password: 'password123',
                role: 'waiter'
            });

            const res = await request(app)
                .patch(`/api/users/staff/${staff._id}/status`)
                .set('Cookie', adminCookie);

            expect(res.status).toBe(200);
            expect(res.body.isActive).toBe(false); // Default was true
        });

        it('should allow admin to delete staff', async () => {
            const staff = await User.create({
                name: 'Delete Me',
                email: 'delete@test.com',
                password: 'password123',
                role: 'kitchen'
            });

            const res = await request(app)
                .delete(`/api/users/staff/${staff._id}`)
                .set('Cookie', adminCookie);

            expect(res.status).toBe(200);
            expect(res.body.message).toMatch(/deleted/);
            
            const checkUser = await User.findById(staff._id);
            expect(checkUser).toBeNull();
        });
    });
});
