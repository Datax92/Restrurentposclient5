import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../index';
import Client from '../../models/client.model';
import Order from '../../models/order.model';
import { getAuthCookie } from './test.utils';

describe('Client API', () => {
    let adminCookie;
    let clientId;

    beforeEach(async () => {
        const auth = await getAuthCookie(app, { role: 'admin' });
        adminCookie = auth.cookie;

        const client = await Client.create({
            name: 'John Customer',
            phone: '5551234',
            email: 'john@customer.com'
        });
        clientId = client._id;
    });

    it('should allow admin to list all clients', async () => {
        const res = await request(app)
            .get('/api/clients')
            .set('Cookie', adminCookie);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.clients).toHaveLength(1);
        expect(res.body.clients[0].name).toBe('John Customer');
    });

    it('should get detailed client history including orders', async () => {
        // Create a fake order for this client
        const order = await Order.create({
            orderId: 'ORD-HIST-1',
            type: 'Takeaway',
            items: [{ 
                menuItem: new mongoose.Types.ObjectId(), 
                name: 'Test', 
                price: 10, 
                quantity: 1 
            }],
            totalAmount: 10,
            client: clientId,
            clientName: 'John Customer',
            clientPhone: '5551234'
        });

        await Client.findByIdAndUpdate(clientId, { $push: { orders: order._id } });

        const res = await request(app)
            .get(`/api/clients/${clientId}/history`)
            .set('Cookie', adminCookie);

        expect(res.status).toBe(200);
        expect(res.body.client.orders).toHaveLength(1);
        expect(res.body.client.orders[0].orderId).toBe('ORD-HIST-1');
    });

    it('should return 404 for non-existent client history', async () => {
        const fakeId = '65f1a2b3c4d5e6f7a8b9c0d1';
        const res = await request(app)
            .get(`/api/clients/${fakeId}/history`)
            .set('Cookie', adminCookie);

        expect(res.status).toBe(404);
    });

    it('should allow admin to delete a client record', async () => {
        const res = await request(app)
            .delete(`/api/clients/${clientId}`)
            .set('Cookie', adminCookie);

        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/deleted/);

        const checkClient = await Client.findById(clientId);
        expect(checkClient).toBeNull();
    });

    it('should block unauthorized access to client data', async () => {
        const res = await request(app).get('/api/clients');
        expect(res.status).toBe(401); // No token
    });
});
