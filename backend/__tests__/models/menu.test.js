import { describe, it, expect } from 'vitest';
import { Category, MenuItem } from '../../models/menu.model.js';
import mongoose from 'mongoose';

describe('Menu Models', () => {
    describe('Category Model', () => {
        it('should create a valid category', async () => {
            const categoryData = {
                name: 'Beverages',
                description: 'Drinks and juices'
            };
            const category = new Category(categoryData);
            const savedCategory = await category.save();
            expect(savedCategory._id).toBeDefined();
            expect(savedCategory.name).toBe(categoryData.name);
        });

        it('should fail if name is missing', async () => {
            const category = new Category({ description: 'No Name' });
            await expect(category.save()).rejects.toThrow(/Category name is required/);
        });
    });

    describe('MenuItem Model', () => {
        it('should create a valid menu item linked to a category', async () => {
            const category = await new Category({ name: 'Fast Food' }).save();
            
            const itemData = {
                name: 'Burger',
                price: 150,
                category: category._id,
                spiceLevel: 'medium'
            };
            const item = new MenuItem(itemData);
            const savedItem = await item.save();
            expect(savedItem._id).toBeDefined();
            expect(savedItem.name).toBe(itemData.name);
            expect(savedItem.category).toEqual(category._id);
        });

        it('should fail if price is negative', async () => {
            const category = await new Category({ name: 'Desserts' }).save();
            const item = new MenuItem({
                name: 'Cake',
                price: -10,
                category: category._id
            });
            await expect(item.save()).rejects.toThrow();
        });

        it('should fail if category is missing', async () => {
            const item = new MenuItem({
                name: 'Pizza',
                price: 450
            });
            await expect(item.save()).rejects.toThrow(/Category is required/);
        });
    });
});
