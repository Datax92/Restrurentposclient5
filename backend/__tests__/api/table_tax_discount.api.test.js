import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../index';
import Table from '../../models/table.model';
import Tax from '../../models/tax.model';
import Discount from '../../models/discount.model';
import { getAuthCookie } from './test.utils';

describe('Admin Configuration API (Tables, Taxes, Discounts)', () => {
    let adminCookie;

    beforeEach(async () => {
        const auth = await getAuthCookie(app, { role: 'admin' });
        adminCookie = auth.cookie;
    });

    describe('Tables API', () => {
        it('should allow admin to create a table', async () => {
            const res = await request(app)
                .post('/api/table')
                .set('Cookie', adminCookie)
                .send({ name: 'T1', zone: 'Indoor', capacity: 4 });

            expect(res.status).toBe(201);
            expect(res.body.table.name).toBe('T1');
        });

        it('should list all tables', async () => {
            await Table.create({ name: 'T2', capacity: 2 });
            const res = await request(app).get('/api/table').set('Cookie', adminCookie);
            expect(res.status).toBe(200);
            expect(res.body.tables).toHaveLength(1);
        });

        it('should reserve a table', async () => {
            const table = await Table.create({ name: 'T3', capacity: 6 });
            const res = await request(app)
                .post(`/api/table/${table._id}/reserve`)
                .set('Cookie', adminCookie)
                .send({
                    bookedBy: 'Jane Doe',
                    contact: '999888777',
                    guests: 4,
                    date: new Date()
                });

            expect(res.status).toBe(200);
            expect(res.body.table.status).toBe('Reserved');
        });
    });

    describe('Taxes API', () => {
        it('should allow admin to create a tax', async () => {
            const res = await request(app)
                .post('/api/tax')
                .set('Cookie', adminCookie)
                .send({ name: 'Service Tax', rate: 5 });

            expect(res.status).toBe(201);
            expect(res.body.tax.name).toBe('Service Tax');
        });

        it('should delete a tax', async () => {
            const tax = await Tax.create({ name: 'Old Tax', rate: 2 });
            const res = await request(app)
                .delete(`/api/tax/${tax._id}`)
                .set('Cookie', adminCookie);

            expect(res.status).toBe(200);
            const check = await Tax.findById(tax._id);
            expect(check).toBeNull();
        });
    });

    describe('Discounts API', () => {
        it('should allow admin to create a discount', async () => {
            const res = await request(app)
                .post('/api/discount')
                .set('Cookie', adminCookie)
                .send({
                    name: 'WINTER20',
                    type: 'Percentage',
                    value: 20
                });

            expect(res.status).toBe(201);
            expect(res.body.discount.name).toBe('WINTER20');
        });

        it('should update a discount', async () => {
            const discount = await Discount.create({ name: 'Promo', type: 'Fixed Amount', value: 10 });
            const res = await request(app)
                .put(`/api/discount/${discount._id}`)
                .set('Cookie', adminCookie)
                .send({ value: 15 });

            expect(res.status).toBe(200);
            expect(res.body.discount.value).toBe(15);
        });
    });
});
