import React from 'react';
import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

/**
 * Global Mock for Axios Instance
 */
vi.mock('../axios/axiosInstace', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    }
}));

/**
 * Global Mock for Sonner (Toast)
 */
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    }
}));

/**
 * Global Mock for Socket.io Configuration
 */
const mockSocketOn = vi.fn();
const mockSocketOff = vi.fn();
const mockSocketEmit = vi.fn();

vi.mock('../config/socket.config', () => ({
    getSocket: vi.fn().mockReturnValue({
        on: mockSocketOn,
        off: mockSocketOff,
        emit: mockSocketEmit
    }),
    initSocket: vi.fn()
}));

/**
 * Global Mock for Lucide Icons
 * This keeps test snapshots and rendered outputs clean.
 */
vi.mock('lucide-react', async () => {
    const original = await vi.importActual('lucide-react');
    return {
        ...original,
        __esModule: true,
        ...Object.keys(original).reduce((acc, name) => {
            acc[name] = (props) => <div data-testid={`icon-${name}`} {...props} />;
            return acc;
        }, {}),
    };
});

/**
 * Common Browser API Mocks
 */
class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}
window.ResizeObserver = ResizeObserver;

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

/**
 * Global Mock for Framer Motion
 * Disables animations for faster and more deterministic tests.
 */
vi.mock('framer-motion', () => ({
    motion: new Proxy({}, {
        get: (target, key) => {
            return ({ children, ...props }) => {
                // Remove framer-motion specific props that might cause React warnings on plain divs
                const { initial: _i, animate: _a, exit: _e, transition: _t, ...validProps } = props;
                return React.createElement(key, validProps, children);
            };
        }
    }),
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// Reset all mocks before each test to ensure test isolation
beforeEach(() => {
    vi.clearAllMocks();
});
