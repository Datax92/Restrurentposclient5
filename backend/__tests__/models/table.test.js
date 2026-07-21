import { describe, it, expect } from 'vitest';
import Table from '../../models/table.model.js';

describe('Table Model', () => {
    it('should create a table successfully with valid data', async () => {
        const tableData = {
            name: 'Table 1',
            capacity: 4,
            zone: 'Indoor'
        };
        const table = new Table(tableData);
        const savedTable = await table.save();

        expect(savedTable._id).toBeDefined();
        expect(savedTable.name).toBe(tableData.name);
        expect(savedTable.capacity).toBe(tableData.capacity);
        expect(savedTable.status).toBe('Available');
    });

    it('should fail if name is missing', async () => {
        const table = new Table({ capacity: 4 });
        await expect(table.save()).rejects.toThrow(/Table name is required/);
    });

    it('should fail if capacity is missing', async () => {
        const table = new Table({ name: 'Table 2' });
        await expect(table.save()).rejects.toThrow(/Capacity is required/);
    });

    it('should fail if capacity is less than 1', async () => {
        const table = new Table({ name: 'Table 3', capacity: 0 });
        await expect(table.save()).rejects.toThrow();
    });

    it('should enforce status enum validation', async () => {
        const table = new Table({
            name: 'Table 4',
            capacity: 2,
            status: 'InvalidStatus'
        });
        await expect(table.save()).rejects.toThrow(/enum/);
    });

    it('should handle reservation sub-documents', async () => {
        const reservation = {
            bookedBy: 'John Doe',
            contact: '123456789',
            guests: 4,
            date: new Date()
        };
        const table = new Table({
            name: 'Table 5',
            capacity: 6,
            reservation
        });
        const savedTable = await table.save();
        expect(savedTable.reservation.bookedBy).toBe(reservation.bookedBy);
        expect(savedTable.reservation.guests).toBe(4);
    });
});
