import { describe, it, expect } from 'vitest';
import User from '../../models/user.model.js';
import mongoose from 'mongoose';

describe('User Model', () => {
    it('should create a user successfully with valid data', async () => {
        const userData = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'cashier'
        };
        const user = new User(userData);
        const savedUser = await user.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.name).toBe(userData.name);
        expect(savedUser.email).toBe(userData.email);
        expect(savedUser.role).toBe(userData.role);
        expect(savedUser.password).not.toBe(userData.password); // Should be hashed
    });

    it('should fail to create a user without required fields', async () => {
        const user = new User({ name: 'No Email' });
        await expect(user.save()).rejects.toThrow();
    });

    it('should fail to create a user with invalid email', async () => {
        const user = new User({
            name: 'Jane Doe',
            email: 'invalid-email',
            password: 'password123'
        });
        await expect(user.save()).rejects.toThrow(/valid email address/);
    });

    it('should hash the password before saving', async () => {
        const password = 'mySecretPassword';
        const user = new User({
            name: 'Hash Test',
            email: 'hash@test.com',
            password: password
        });
        await user.save();
        
        expect(user.password).not.toBe(password);
        const isMatch = await user.comparePassword(password);
        expect(isMatch).toBe(true);
    });

    it('should enforce role enum validation', async () => {
        const user = new User({
            name: 'Role Test',
            email: 'role@test.com',
            password: 'password123',
            role: 'invalid_role'
        });
        await expect(user.save()).rejects.toThrow(/enum/);
    });

    it('should fail to create a user with a duplicate email', async () => {
        const email = 'duplicate@test.com';
        await User.create({
            name: 'User 1',
            email: email,
            password: 'password123'
        });

        const user2 = new User({
            name: 'User 2',
            email: email,
            password: 'password456'
        });

        // Mongoose unique constraint might throw a MongoServerError (code 11000)
        await expect(user2.save()).rejects.toThrow();
    });
});
