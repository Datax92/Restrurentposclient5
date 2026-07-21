import { describe, it, expect } from 'vitest';
import Order from '../../models/order.model.js';
import { Category, MenuItem } from '../../models/menu.model.js';
import Client from '../../models/client.model.js';
import mongoose from 'mongoose';

describe('Order Model', () => {
    it('should create a valid dine-in order', async () => {
        // Prepare dependencies
        const category = await new Category({ name: 'Drinks' }).save();
        const item = await new MenuItem({
            name: 'Coke',
            price: 50,
            category: category._id
        }).save();
        
        const client = await new Client({
            name: 'Guest 1',
            phone: '1234567890'
        }).save();

        const orderData = {
            orderId: 'ORD-TEST-1',
            type: 'Dine-in',
            status: 'Pending',
            client: client._id,
            totalAmount: 50,
            items: [{
                menuItem: item._id,
                name: 'Coke',
                price: 50,
                quantity: 1
            }]
        };

        const order = new Order(orderData);
        const savedOrder = await order.save();

        expect(savedOrder._id).toBeDefined();
        expect(savedOrder.type).toBe('Dine-in');
        expect(savedOrder.status).toBe('Pending');
        expect(savedOrder.items.length).toBe(1);
        expect(savedOrder.items[0].name).toBe('Coke');
    });

    it('should fail if totalAmount is negative', async () => {
        const order = new Order({
            type: 'Takeaway',
            totalAmount: -100
        });
        await expect(order.save()).rejects.toThrow();
    });

    it('should fail if order type is invalid', async () => {
        const order = new Order({
            type: 'Delivery', // Not in enum
            totalAmount: 100
        });
        await expect(order.save()).rejects.toThrow(/enum/);
    });

    it('should fail if items are missing quantity', async () => {
        const order = new Order({
            type: 'Takeaway',
            items: [{ menuItem: new mongoose.Types.ObjectId(), name: 'Fail', price: 10 }]
        });
        await expect(order.save()).rejects.toThrow();
    });
});
