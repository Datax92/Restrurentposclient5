import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../index';
import { MenuItem, Category } from '../../models/menu.model';
import Client from '../../models/client.model';
import Order from '../../models/order.model';
import { getAuthCookie } from './test.utils';

describe('Order API', () => {
    let adminCookie;
    let menuItemId;
    let clientId;

    beforeEach(async () => {
        const auth = await getAuthCookie(app, { role: 'admin' });
        adminCookie = auth.cookie;

        // Setup prerequisites
        const cat = await Category.create({ name: 'Food', description: 'Foodstuff' });
        const item = await MenuItem.create({ 
            name: 'Burger', 
            price: 15, 
            category: cat._id 
        });
        menuItemId = item._id;

        const client = await Client.create({ 
            name: 'Test Client', 
            phone: '1234567890' 
        });
        clientId = client._id;
    });

    it('should create a new order and update client history', async () => {
        const res = await request(app)
            .post('/api/orders')
            .set('Cookie', adminCookie)
            .send({
                type: 'Dine-in',
                paymentMethod: 'Cash',
                clientId: clientId,
                clientPhone: '1234567890',
                items: [
                    { menuItem: menuItemId, quantity: 2 }
                ]
            });

        console.log('DEBUG ORDER 400 AGAIN:', res.status, JSON.stringify(res.body, null, 2));
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.order.totalAmount).toBe(30); // 15 * 2
        expect(res.body.order.clientName).toBe('Test Client');

        // Verify client was updated
        const updatedClient = await Client.findById(clientId);
        expect(updatedClient.totalSpent).toBe(30);
        expect(updatedClient.orders).toHaveLength(1);
    });

    it('should fail to create order without items', async () => {
        const res = await request(app)
            .post('/api/orders')
            .set('Cookie', adminCookie)
            .send({
                type: 'Takeaway',
                clientId: clientId,
                items: []
            });

        expect(res.status).toBe(400);
    });

    it('should list all orders with pagination', async () => {
        // Create a dummy order
        await Order.create({
            orderId: 'ORD-1',
            type: 'Takeaway',
            items: [{ menuItem: menuItemId, name: 'Burger', price: 15, quantity: 1 }],
            totalAmount: 15,
            client: clientId,
            clientName: 'Test Client',
            clientPhone: '1234567890'
        });

        const res = await request(app)
            .get('/api/orders')
            .set('Cookie', adminCookie);

        expect(res.status).toBe(200);
        expect(res.body.orders).toHaveLength(1);
        expect(res.body.pagination.totalOrders).toBe(1);
    });

    it('should update order status', async () => {
        const order = await Order.create({
            orderId: 'ORD-2',
            type: 'Dine-in',
            items: [{ menuItem: menuItemId, name: 'Burger', price: 15, quantity: 1 }],
            totalAmount: 15,
            client: clientId,
            clientName: 'Test Client',
            clientPhone: '1234567890',
            status: 'Pending'
        });

        const res = await request(app)
            .patch(`/api/orders/${order._id}/status`)
            .set('Cookie', adminCookie)
            .send({ status: 'Preparing' });

        expect(res.status).toBe(200);
        expect(res.body.order.status).toBe('Preparing');
    });

    it('should get order analytics/stats', async () => {
        await Order.create({
            orderId: 'ORD-3',
            type: 'Dine-in',
            items: [{ menuItem: menuItemId, name: 'Burger', price: 15, quantity: 1 }],
            totalAmount: 15,
            client: clientId,
            clientName: 'Test Client',
            clientPhone: '1234567890',
            status: 'Completed'
        });

        const res = await request(app)
            .get('/api/orders/stats')
            .set('Cookie', adminCookie);

        expect(res.status).toBe(200);
        expect(res.body.stats.totalRevenue).toBe(15);
        expect(res.body.recentOrders).toHaveLength(1);
    });
});
