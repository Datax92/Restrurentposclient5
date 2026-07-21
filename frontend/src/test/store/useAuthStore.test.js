import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../../store/useAuthStore';
import axiosInstance from '../../axios/axiosInstace';
import { toast } from 'sonner';

describe('useAuthStore', () => {
    beforeEach(() => {
        // Reset store state before each test
        useAuthStore.setState({
            authUser: null,
            isLoading: false,
            isCheckingAuth: false,
            isLoggingIn: false,
            isSigningUp: false
        });
        vi.clearAllMocks();
    });

    it('should check auth successfully', async () => {
        const userData = { _id: '1', name: 'Admin', role: 'admin' };
        axiosInstance.get.mockResolvedValue({ data: userData });

        await useAuthStore.getState().checkAuth();

        expect(useAuthStore.getState().authUser).toEqual(userData);
        expect(useAuthStore.getState().isCheckingAuth).toBe(false);
        expect(axiosInstance.get).toHaveBeenCalledWith('/users/me');
    });

    it('should handle check auth failure', async () => {
        axiosInstance.get.mockRejectedValue(new Error('Unauthorized'));

        await useAuthStore.getState().checkAuth();

        expect(useAuthStore.getState().authUser).toBeNull();
        expect(useAuthStore.getState().isCheckingAuth).toBe(false);
    });

    it('should login successfully', async () => {
        const credentials = { email: 'admin@test.com', password: 'password' };
        const userData = { _id: '1', name: 'Admin', role: 'admin' };
        axiosInstance.post.mockResolvedValue({ data: { user: userData } });

        await useAuthStore.getState().login(credentials);

        expect(useAuthStore.getState().authUser).toEqual(userData);
        expect(toast.success).toHaveBeenCalledWith('User Logged In');
        expect(axiosInstance.post).toHaveBeenCalledWith('/users/login', credentials);
    });

    it('should handle login failure', async () => {
        const errorMsg = 'Invalid Credentials';
        axiosInstance.post.mockRejectedValue({
            response: { data: { message: errorMsg } }
        });

        await useAuthStore.getState().login({ email: 'wrong@test.com' });

        expect(useAuthStore.getState().authUser).toBeNull();
        expect(toast.error).toHaveBeenCalledWith(errorMsg);
    });

    it('should signup successfully', async () => {
        const formData = { name: 'Staff', email: 'staff@test.com', password: 'password' };
        const userData = { _id: '2', name: 'Staff', role: 'waiter' };
        axiosInstance.post.mockResolvedValue({ data: userData });

        await useAuthStore.getState().signup(formData);

        expect(useAuthStore.getState().authUser).toEqual(userData);
        expect(toast.success).toHaveBeenCalledWith('User Signed Up');
        expect(axiosInstance.post).toHaveBeenCalledWith('/users/register', formData);
    });

    it('should logout successfully', async () => {
        axiosInstance.post.mockResolvedValue({});
        useAuthStore.setState({ authUser: { name: 'Admin' } });

        await useAuthStore.getState().logout();

        expect(useAuthStore.getState().authUser).toBeNull();
        expect(toast.success).toHaveBeenCalledWith('Logged out successfully');
        expect(axiosInstance.post).toHaveBeenCalledWith('/users/logout');
    });
});
