import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OrderSummarySidebar from '@/pages/dashboard/components/OrderSummarySidebar';

describe('OrderSummarySidebar', () => {
    const mockOrder = {
        _id: 'o1',
        orderId: 'ORD-123456',
        status: 'Pending',
        table: { name: 'Table 5' },
        items: [
            { name: 'Burger', price: 15, quantity: 2, note: 'No onions' },
            { name: 'Fries', price: 5, quantity: 1 }
        ]
    };

    const mockOnClose = vi.fn();
    const mockOnUpdateStatus = vi.fn();

    it('renders empty state when no order is selected', () => {
        render(<OrderSummarySidebar order={null} />);
        expect(screen.getByText(/Terminal Waiting/i)).toBeInTheDocument();
    });

    it('renders order details correctly', () => {
        render(<OrderSummarySidebar order={mockOrder} onClose={mockOnClose} onUpdateStatus={mockOnUpdateStatus} />);
        
        expect(screen.getByText(/#123456/i)).toBeInTheDocument();
        expect(screen.getByText(/Table 5/i)).toBeInTheDocument();
        expect(screen.getByText(/Burger/i)).toBeInTheDocument();
        expect(screen.getByText(/Fries/i)).toBeInTheDocument();
        
        // Check totals (30 + 5 = 35; 10% tax = 3.5; total = 38.5)
        // Note: The component uses hardcoded 10% tax logic.
        expect(screen.getByText(/Rs 35/i)).toBeInTheDocument(); // Subtotal
        expect(screen.getByText(/Rs 38.5/i)).toBeInTheDocument(); // Total
    });

    it('shows the correct status progress', () => {
        render(<OrderSummarySidebar order={mockOrder} />);
        expect(screen.getByText(/Pending/i)).toBeInTheDocument();
    });

    it('calls onUpdateStatus when status action button is clicked', () => {
        render(<OrderSummarySidebar order={mockOrder} onUpdateStatus={mockOnUpdateStatus} />);
        
        const actionButton = screen.getByText(/Start Preparing/i);
        fireEvent.click(actionButton);
        
        expect(mockOnUpdateStatus).toHaveBeenCalledWith('o1', 'Preparing');
    });

    it('calls onClose when close button is clicked', () => {
        render(<OrderSummarySidebar order={mockOrder} onClose={mockOnClose} />);
        
        const closeButton = screen.getAllByRole('button')[0]; // The X button
        fireEvent.click(closeButton);
        
        expect(mockOnClose).toHaveBeenCalled();
    });
});
