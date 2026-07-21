import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import KitchenOrderCard from '@/pages/dashboard/components/kitchen/KitchenOrderCard';
import { vi } from 'vitest';

describe('KitchenOrderCard UI Component', () => {
    const mockOrder = {
        _id: 'ord_12345',
        clientName: 'Jane Doe',
        orderId: 'TICKET-9999',
        orderType: 'Dine-in',
        createdAt: new Date().toISOString(),
        items: [
            { name: 'Margherita Pizza', quantity: 2, note: 'Extra cheese' },
            { name: 'Garlic Bread', quantity: 1 }
        ]
    };

    it('should render the client name and order ID correctly', () => {
        render(<KitchenOrderCard order={mockOrder} onUpdate={() => {}} nextStatus="Preparing" actionLabel="Accept" />);
        
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
        expect(screen.getByText('#9999')).toBeInTheDocument();
        expect(screen.getByText('Dine-in')).toBeInTheDocument();
    });

    it('should correctly render all item names and quantities', () => {
        render(<KitchenOrderCard order={mockOrder} onUpdate={() => {}} nextStatus="Preparing" actionLabel="Accept" />);
        
        expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('Extra cheese')).toBeInTheDocument(); // Checks note
        
        expect(screen.getByText('Garlic Bread')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should trigger the onUpdate callback correctly when the action button is clicked', () => {
        const mockUpdate = vi.fn();
        render(<KitchenOrderCard order={mockOrder} onUpdate={mockUpdate} nextStatus="Preparing" actionLabel="Accept" />);
        
        // Find the button (by actionLabel text)
        const button = screen.getByRole('button', { name: /Accept/i });
        fireEvent.click(button);
        
        // Ensure onUpdate was called with the correct ID and nextStatus
        expect(mockUpdate).toHaveBeenCalledTimes(1);
        expect(mockUpdate).toHaveBeenCalledWith('ord_12345', 'Preparing');
    });
});
