import { describe, it, expect } from 'vitest';
import Inventory from '../../models/inventory.model.js';

describe('Inventory Model', () => {
    it('should create a valid inventory item', async () => {
        const itemData = {
            name: 'Sugar',
            category: 'Raw Materials',
            quantity: 50,
            unit: 'kg',
            reorderLevel: 5
        };
        const item = new Inventory(itemData);
        const savedItem = await item.save();

        expect(savedItem._id).toBeDefined();
        expect(savedItem.name).toBe(itemData.name);
        expect(savedItem.quantity).toBe(itemData.quantity);
    });

    it('should fail if name is missing', async () => {
        const item = new Inventory({ category: 'Misc', quantity: 10 });
        await expect(item.save()).rejects.toThrow(/Item name is required/);
    });

    it('should fail if quantity is negative', async () => {
        const item = new Inventory({
            name: 'Salt',
            category: 'Raw Materials',
            quantity: -5
        });
        await expect(item.save()).rejects.toThrow();
    });

    it('should default quantity to 0 if not provided', async () => {
        const item = await new Inventory({
            name: 'Flour',
            category: 'Raw Materials'
        }).save();
        expect(item.quantity).toBe(0);
    });

    it('should default reorderLevel to 10', async () => {
        const item = await new Inventory({
            name: 'Milk',
            category: 'Raw Materials',
            quantity: 20,
            unit: 'liters'
        }).save();
        expect(item.reorderLevel).toBe(10);
    });
});
