import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../index';
import { Category, MenuItem } from '../../models/menu.model';
import { getAuthCookie } from './test.utils';

describe('Menu & Category API', () => {
    let adminCookie;

    beforeEach(async () => {
        const auth = await getAuthCookie(app, { role: 'admin' });
        adminCookie = auth.cookie;
    });

    describe('Categories', () => {
        it('should allow admin to create a category', async () => {
            const res = await request(app)
                .post('/api/menu/category')
                .set('Cookie', adminCookie)
                .send({
                    name: 'Test Category',
                    description: 'Test Category Description'
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.category.name).toBe('Test Category');
        });

        it('should list all categories', async () => {
            await Category.create({ name: 'Cat 1', description: 'Desc 1' });
            await Category.create({ name: 'Cat 2', description: 'Desc 2' });

            const res = await request(app).get('/api/menu/category');

            expect(res.status).toBe(200);
            expect(res.body.categories).toHaveLength(2);
        });

        it('should update a category', async () => {
            const cat = await Category.create({ name: 'Old Name', description: 'Old Desc' });

            const res = await request(app)
                .put(`/api/menu/category/${cat._id}`)
                .set('Cookie', adminCookie)
                .send({ name: 'New Name' });

            expect(res.status).toBe(200);
            expect(res.body.category.name).toBe('New Name');
        });

        it('should delete a category if it has no items', async () => {
            const cat = await Category.create({ name: 'Delete Me', description: 'Desc' });

            const res = await request(app)
                .delete(`/api/menu/category/${cat._id}`)
                .set('Cookie', adminCookie);

            expect(res.status).toBe(200);
            expect(res.body.message).toMatch(/deleted/);
        });
    });

    describe('Menu Items', () => {
        let categoryId;

        beforeEach(async () => {
            const cat = await Category.create({ name: 'Food', description: 'Foodstuff' });
            categoryId = cat._id;
        });

        it('should allow admin to create a menu item', async () => {
            const res = await request(app)
                .post('/api/menu/item')
                .set('Cookie', adminCookie)
                .send({
                    name: 'Burger',
                    description: 'Juicy Burger',
                    price: 10,
                    category: categoryId,
                    isVeg: false,
                    spiceLevel: 'mild'
                });

            expect(res.status).toBe(201);
            expect(res.body.menuItem.name).toBe('Burger');
            expect(res.body.menuItem.category).toBe(categoryId.toString());
        });

        it('should search for menu items', async () => {
            await MenuItem.create({ name: 'Pizza', price: 12, category: categoryId });
            await MenuItem.create({ name: 'Pasta', price: 8, category: categoryId });

            const res = await request(app).get('/api/menu/item?search=Pizza');

            expect(res.status).toBe(200);
            expect(res.body.menuItems).toHaveLength(1);
            expect(res.body.menuItems[0].name).toBe('Pizza');
        });

        it('should filter items by category', async () => {
            const otherCat = await Category.create({ name: 'Drinks', description: 'Beverages' });
            await MenuItem.create({ name: 'Coke', price: 2, category: otherCat._id });
            await MenuItem.create({ name: 'Fries', price: 3, category: categoryId });

            const res = await request(app).get(`/api/menu/item?category=${categoryId}`);

            expect(res.status).toBe(200);
            expect(res.body.menuItems).toHaveLength(1);
            expect(res.body.menuItems[0].name).toBe('Fries');
        });

        it('should update a menu item', async () => {
            const item = await MenuItem.create({ name: 'Old Item', price: 5, category: categoryId });

            const res = await request(app)
                .put(`/api/menu/item/${item._id}`)
                .set('Cookie', adminCookie)
                .send({ price: 10 });

            expect(res.status).toBe(200);
            expect(res.body.menuItem.price).toBe(10);
        });

        it('should delete a menu item', async () => {
            const item = await MenuItem.create({ name: 'Delete Item', price: 5, category: categoryId });

            const res = await request(app)
                .delete(`/api/menu/item/${item._id}`)
                .set('Cookie', adminCookie);

            expect(res.status).toBe(200);
            expect(res.body.message).toMatch(/deleted/);
        });
    });
});
