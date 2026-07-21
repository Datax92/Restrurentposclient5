import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '../../../pages/dashboard/Dashboard';
import { useAuthStore } from '../../../store/useAuthStore';

// Mock useAuthStore
vi.mock('../../../store/useAuthStore', () => ({
    useAuthStore: vi.fn()
}));

describe('Dashboard Page', () => {
    const mockLogout = vi.fn();

    beforeEach(() => {
        useAuthStore.mockReturnValue({
            authUser: { name: 'Admin User', role: 'admin' },
            logout: mockLogout
        });
        vi.clearAllMocks();
    });

    it('renders sidebar and navbar', () => {
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />}>
                        <Route index element={<div>Dashboard Content</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        // Check if Sidebar header (or Navbar) is there
        // Since they appear in both Sidebar and Navbar, we use getAllByText
        expect(screen.getAllByText(/Tasty/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Station/i).length).toBeGreaterThan(0);
        
        // Use getAllByText for Dashboard since it's in multiple places
        const dashboardElements = screen.getAllByText(/Dashboard/i);
        expect(dashboardElements.length).toBeGreaterThan(0);
    });

    it('collapses sidebar on toggle click', () => {
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Dashboard />
            </MemoryRouter>
        );

        const toggleBtn = screen.getByLabelText(/Collapse sidebar/i);
        fireEvent.click(toggleBtn);

        // Sidebar should have "w-20" class (or check if text is hidden)
        // Since we are using JSDOM, we can't easily check actual widths, 
        // but we can check the presence of classes if they are being applied.
        // Or check if the Expand label is now present.
        expect(screen.getByLabelText(/Expand sidebar/i)).toBeInTheDocument();
    });

    it('shows Admin Panel link only for admins', () => {
        // First test as admin (already setup in beforeEach)
        const { rerender } = render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Dashboard />
            </MemoryRouter>
        );
        expect(screen.getAllByText(/Admin Panel/i).length).toBeGreaterThan(0);

        // Rerender as waiter
        useAuthStore.mockReturnValue({
            authUser: { name: 'Staff User', role: 'waiter' },
            logout: mockLogout
        });

        rerender(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Dashboard />
            </MemoryRouter>
        );
        // The header says "Admin Panel" always, but the link is conditional
        // We check for the link specifically (which is a span in our sidebar)
        const adminLinks = screen.queryAllByText(/Admin Panel/i, { selector: 'span' });
        expect(adminLinks.length).toBe(0);
    });

    it('calls logout when logout button is clicked', () => {
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Dashboard />
            </MemoryRouter>
        );

        const logoutBtn = screen.getByText(/Logout/i);
        fireEvent.click(logoutBtn);

        expect(mockLogout).toHaveBeenCalled();
    });
});
