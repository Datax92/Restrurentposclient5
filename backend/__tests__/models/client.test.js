import { describe, it, expect } from 'vitest';
import Client from '../../models/client.model.js';

describe('Client Model', () => {
    it('should create a client successfully with valid data', async () => {
        const clientData = {
            name: 'Test Client',
            phone: '1234567890',
            email: 'client@test.com',
            preferences: 'Loves spicy food'
        };
        const client = new Client(clientData);
        const savedClient = await client.save();

        expect(savedClient._id).toBeDefined();
        expect(savedClient.name).toBe(clientData.name);
        expect(savedClient.phone).toBe(clientData.phone);
        expect(savedClient.totalSpent).toBe(0);
    });

    it('should fail if name is missing', async () => {
        const client = new Client({ phone: '1234567890' });
        await expect(client.save()).rejects.toThrow(/Client name is required/);
    });

    it('should fail if phone is missing', async () => {
        const client = new Client({ name: 'Test Client' });
        await expect(client.save()).rejects.toThrow(/Phone number is required/);
    });

    it('should handle address sub-documents', async () => {
        const client = new Client({
            name: 'Address Test',
            phone: '0000000000',
            address: {
                street: '123 Test St',
                city: 'Test City',
                zip: '12345'
            }
        });
        const savedClient = await client.save();
        expect(savedClient.address.city).toBe('Test City');
    });

    it('should allow multiple bookings', async () => {
        const client = new Client({
            name: 'Booking Test',
            phone: '9876543210',
            bookings: [
                { date: new Date(), guests: 4, status: 'Confirmed' },
                { date: new Date(), guests: 2, status: 'Completed' }
            ]
        });
        const savedClient = await client.save();
        expect(savedClient.bookings).toHaveLength(2);
        expect(savedClient.bookings[0].status).toBe('Confirmed');
    });
});
