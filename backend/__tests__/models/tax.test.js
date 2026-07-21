import { describe, it, expect } from 'vitest';
import Tax from '../../models/tax.model.js';

describe('Tax Model', () => {
    it('should create a tax successfully with valid data', async () => {
        const taxData = {
            name: 'VAT',
            rate: 15
        };
        const tax = new Tax(taxData);
        const savedTax = await tax.save();

        expect(savedTax._id).toBeDefined();
        expect(savedTax.name).toBe(taxData.name);
        expect(savedTax.rate).toBe(15);
        expect(savedTax.isActive).toBe(true);
    });

    it('should fail if name is missing', async () => {
        const tax = new Tax({ rate: 10 });
        await expect(tax.save()).rejects.toThrow(/Tax name is required/);
    });

    it('should fail if rate is missing', async () => {
        const tax = new Tax({ name: 'GST' });
        await expect(tax.save()).rejects.toThrow(/Tax rate is required/);
    });

    it('should fail if rate is negative', async () => {
        const tax = new Tax({ name: 'Negative Tax', rate: -1 });
        await expect(tax.save()).rejects.toThrow();
    });

    it('should allow toggling isActive', async () => {
        const tax = new Tax({ name: 'Inactive Tax', rate: 5, isActive: false });
        const savedTax = await tax.save();
        expect(savedTax.isActive).toBe(false);
    });
});
