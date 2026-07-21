import { describe, it, expect } from 'vitest';
import Discount from '../../models/discount.model.js';

describe('Discount Model', () => {
    it('should create a percentage discount successfully', async () => {
        const discountData = {
            name: 'SUMMER_SALES',
            type: 'Percentage',
            value: 15
        };
        const discount = new Discount(discountData);
        const savedDiscount = await discount.save();

        expect(savedDiscount._id).toBeDefined();
        expect(savedDiscount.name).toBe(discountData.name);
        expect(savedDiscount.type).toBe('Percentage');
        expect(savedDiscount.value).toBe(15);
        expect(savedDiscount.isActive).toBe(true);
    });

    it('should create a fixed amount discount successully', async () => {
        const discountData = {
            name: 'FLAT_50',
            type: 'Fixed Amount',
            value: 50
        };
        const discount = new Discount(discountData);
        const savedDiscount = await discount.save();

        expect(savedDiscount._id).toBeDefined();
        expect(savedDiscount.type).toBe('Fixed Amount');
        expect(savedDiscount.value).toBe(50);
    });

    it('should fail if type is invalid (not in enum)', async () => {
        const discount = new Discount({
            name: 'INVALID_TYPE',
            type: 'InvalidType',
            value: 10
        });
        await expect(discount.save()).rejects.toThrow(/enum/);
    });

    it('should fail if value is negative', async () => {
        const discount = new Discount({
            name: 'NEGATIVE_VAL',
            type: 'Percentage',
            value: -5
        });
        await expect(discount.save()).rejects.toThrow();
    });

    it('should fail if name is missing', async () => {
        const discount = new Discount({ type: 'Percentage', value: 10 });
        await expect(discount.save()).rejects.toThrow(/Discount name is required/);
    });

    it('should handle optional start and end dates', async () => {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        const discount = new Discount({
            name: 'FLASH_DEAL',
            type: 'Fixed Amount',
            value: 10,
            startDate,
            endDate
        });
        const savedDiscount = await discount.save();
        expect(savedDiscount.startDate.toISOString()).toBe(startDate.toISOString());
        expect(savedDiscount.endDate.toISOString()).toBe(endDate.toISOString());
    });
});
