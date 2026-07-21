import { describe, it, expect, beforeEach } from 'vitest';
import { useThemeStore } from '../../store/useThemeStore';

describe('useThemeStore', () => {
    beforeEach(() => {
        // Clear the store state before each test
        const store = useThemeStore.getState();
        store.setTheme('system'); // reset to default
    });

    it('should initialize with "system" theme by default', () => {
        const { theme } = useThemeStore.getState();
        expect(theme).toBe('system');
    });

    it('should correctly set the theme to "dark"', () => {
        useThemeStore.getState().setTheme('dark');
        const { theme } = useThemeStore.getState();
        expect(theme).toBe('dark');
    });

    it('should correctly set the theme to "light"', () => {
        useThemeStore.getState().setTheme('light');
        const { theme } = useThemeStore.getState();
        expect(theme).toBe('light');
    });
});
