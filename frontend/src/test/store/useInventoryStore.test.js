import { describe, it, expect, beforeEach } from 'vitest';
import { useInventoryStore } from '../../store/useInventoryStore';

describe('useInventoryStore', () => {
    beforeEach(() => {
        // Clear state before each run if possible
        useInventoryStore.setState({
            items: [],
            stats: { totalItems: 0, lowStockCount: 0, totalValue: 0, outOfStockCount: 0 },
            isLoading: false,
            error: null,
            pagination: { page: 1, limit: 10, total: 0, pages: 0 },
            categories: [],
        });
    });

    it('should initialize with empty inventory configurations', () => {
        const state = useInventoryStore.getState();
        expect(state.items).toEqual([]);
        expect(state.isLoading).toBe(false);
        expect(typeof state.fetchInventory).toBe('function');
    });

    it('should correctly mutate optimistic loading state', () => {
        useInventoryStore.setState({ isLoading: true });
        expect(useInventoryStore.getState().isLoading).toBe(true);
    });
});
