import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../index';
import Inventory from '../../models/inventory.model';
import { getAuthCookie } from './test.utils';

describe('Inventory API', () => {
    let adminCookie;

    beforeEach(async () => {
        const auth = await getAuthCookie(app, { role: 'admin' });
        adminCookie = auth.cookie;
    });

    it('should allow admin to add a stock item', async () => {
        const res = await request(app)
            .post('/api/inventory')
            .set('Cookie', adminCookie)
            .send({
                name: 'Napkins',
                category: 'Supplies',
                quantity: 500,
                unit: 'pcs',
                reorderLevel: 100,
                costPerUnit: 0.05
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Napkins');
    });

    it('should list all inventory items', async () => {
        await Inventory.create({ name: 'Straws', category: 'Supplies', quantity: 1000, unit: 'pcs' });
        await Inventory.create({ name: 'Cups', category: 'Supplies', quantity: 200, unit: 'pcs' });

        const res = await request(app)
            .get('/api/inventory')
            .set('Cookie', adminCookie);

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(2);
    });

    it('should update stock quantity and lastRestocked date', async () => {
        const item = await Inventory.create({ name: 'Milk', category: 'Food', quantity: 5, unit: 'liters' });

        const res = await request(app)
            .put(`/api/inventory/${item._id}`)
            .set('Cookie', adminCookie)
            .send({ quantity: 10 });

        expect(res.status).toBe(200);
        expect(res.body.data.quantity).toBe(10);
        expect(res.body.data.lastRestocked).toBeDefined();
    });

    it('should delete a stock item', async () => {
        const item = await Inventory.create({ name: 'Expired Item', category: 'Food', quantity: 0, unit: 'kg' });

        const res = await request(app)
            .delete(`/api/inventory/${item._id}`)
            .set('Cookie', adminCookie);

        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/deleted/);

        const checkItem = await Inventory.findById(item._id);
        expect(checkItem).toBeNull();
    });

    it('should generate stock reports', async () => {
        await Inventory.create({ name: 'Item Alpha', category: 'C', quantity: 10, reorderLevel: 20, costPerUnit: 5 }); // Low stock
        await Inventory.create({ name: 'Item Beta', category: 'C', quantity: 100, reorderLevel: 50, costPerUnit: 2 }); // OK

        const res = await request(app)
            .get('/api/inventory/reports')
            .set('Cookie', adminCookie);

        expect(res.status).toBe(200);
        expect(res.body.data.lowStockCount).toBe(1);
        expect(res.body.data.totalValue).toBe((10 * 5) + (100 * 2)); // 50 + 200 = 250
    });
});
