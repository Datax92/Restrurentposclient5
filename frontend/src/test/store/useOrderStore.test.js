import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useOrderStore } from '../../store/useOrderStore';

// Mock the dependencies
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    }
}));

vi.mock('../../axios/axiosInstace', () => ({
    default: {
        post: vi.fn(),
        put: vi.fn(),
        get: vi.fn()
    }
}));

// Mock socket
const mockSocketOn = vi.fn();
const mockSocketOff = vi.fn();
vi.mock('../../config/socket.config', () => ({
    getSocket: () => ({
        on: mockSocketOn,
        off: mockSocketOff
    })
}));

describe('useOrderStore Cart Logic', () => {
    // Reset store before each test
    beforeEach(() => {
        useOrderStore.setState({ cart: [], lastOrder: null, stats: null, recentOrders: [] });
        vi.clearAllMocks();
    });

    it('should add a new item to the cart', () => {
        const item = { _id: '1', name: 'Burger', price: 10 };
        
        useOrderStore.getState().addToCart(item);
        
        const { cart } = useOrderStore.getState();
        expect(cart).toHaveLength(1);
        expect(cart[0].menuItem._id).toBe('1');
        expect(cart[0].quantity).toBe(1);
        expect(cart[0].price).toBe(10);
    });

    it('should increase quantity if item already exists in cart', () => {
        const item = { _id: '1', name: 'Burger', price: 10 };
        
        useOrderStore.getState().addToCart(item);
        useOrderStore.getState().addToCart(item);
        
        const { cart } = useOrderStore.getState();
        expect(cart).toHaveLength(1);
        expect(cart[0].quantity).toBe(2);
    });

    it('should decrease quantity when removing from cart', () => {
        const item = { _id: '1', name: 'Burger', price: 10 };
        
        useOrderStore.getState().addToCart(item); // Qty: 1
        useOrderStore.getState().addToCart(item); // Qty: 2
        
        useOrderStore.getState().removeFromCart('1');
        
        const { cart } = useOrderStore.getState();
        expect(cart).toHaveLength(1);
        expect(cart[0].quantity).toBe(1);
    });

    it('should completely remove item from cart if quantity reaches 0', () => {
        const item = { _id: '1', name: 'Burger', price: 10 };
        
        useOrderStore.getState().addToCart(item); // Qty: 1
        useOrderStore.getState().removeFromCart('1');
        
        const { cart } = useOrderStore.getState();
        expect(cart).toHaveLength(0);
    });

    it('should clear the entire cart on clearCart', () => {
        const item1 = { _id: '1', name: 'Burger', price: 10 };
        const item2 = { _id: '2', name: 'Fries', price: 5 };
        
        useOrderStore.getState().addToCart(item1);
        useOrderStore.getState().addToCart(item2);
        
        useOrderStore.getState().clearCart();
        
        const { cart } = useOrderStore.getState();
        expect(cart).toHaveLength(0);
    });
});
