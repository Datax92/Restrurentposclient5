import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useMenuStore } from '../../store/useMenuStore';
import axiosInstance from '../../axios/axiosInstace';

describe('useMenuStore', () => {
    beforeEach(() => {
        useMenuStore.setState({
            isLoading: false,
            error: null,
            menu: [],
            category: [],
            paginationMenu: { totalItems: 0, totalPages: 0, currentPage: 1, limit: 10 },
            paginationCategory: { totalCategories: 0, totalPages: 0, currentPage: 1, limit: 10 }
        });
        vi.clearAllMocks();
    });

    // --- Categories ---

    it('should fetch all categories', async () => {
        const categories = [{ _id: 'c1', name: 'Drinks' }];
        const pagination = { totalCategories: 1, totalPages: 1, currentPage: 1, limit: 10 };
        axiosInstance.get.mockResolvedValue({ data: { categories, pagination } });

        await useMenuStore.getState().getAllCategories();

        expect(useMenuStore.getState().category).toEqual(categories);
        expect(useMenuStore.getState().paginationCategory).toEqual(pagination);
        expect(axiosInstance.get).toHaveBeenCalledWith('/menu/category?page=1&limit=10');
    });

    it('should create a category', async () => {
        const newCategory = { _id: 'c2', name: 'Desserts' };
        axiosInstance.post.mockResolvedValue({ data: { category: newCategory } });

        await useMenuStore.getState().createCategory({ name: 'Desserts' });

        expect(useMenuStore.getState().category).toContainEqual(newCategory);
    });

    it('should update a category', async () => {
        const initialCategory = { _id: 'c1', name: 'Drinks' };
        const updatedCategory = { _id: 'c1', name: 'Soft Drinks' };
        useMenuStore.setState({ category: [initialCategory] });
        axiosInstance.put.mockResolvedValue({ data: { category: updatedCategory } });

        await useMenuStore.getState().updateCategory('c1', { name: 'Soft Drinks' });

        expect(useMenuStore.getState().category[0].name).toBe('Soft Drinks');
    });

    it('should delete a category', async () => {
        const initialCategory = { _id: 'c1', name: 'Drinks' };
        useMenuStore.setState({ category: [initialCategory] });
        axiosInstance.delete.mockResolvedValue({});

        await useMenuStore.getState().deleteCategory('c1');

        expect(useMenuStore.getState().category).toHaveLength(0);
    });

    // --- Menu Items ---

    it('should fetch all menu items with filters', async () => {
        const menuItems = [{ _id: 'i1', name: 'Coffee', price: 5 }];
        const pagination = { totalItems: 1, totalPages: 1, currentPage: 1, limit: 10 };
        axiosInstance.get.mockResolvedValue({ data: { menuItems, pagination } });

        await useMenuStore.getState().getAllMenuItems(1, 10, 'cat1', 'search-term');

        expect(useMenuStore.getState().menu).toEqual(menuItems);
        expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('/menu/item?page=1&limit=10&category=cat1&search=search-term'));
    });

    it('should create a menu item', async () => {
        const newItem = { _id: 'i2', name: 'Tea', price: 3 };
        axiosInstance.post.mockResolvedValue({ data: { menuItem: newItem } });

        await useMenuStore.getState().createMenuItem({ name: 'Tea', price: 3 });

        expect(useMenuStore.getState().menu).toContainEqual(newItem);
    });

    it('should handle errors during API calls', async () => {
        const errorMsg = 'Network Error';
        axiosInstance.get.mockRejectedValue({
            response: { data: { message: errorMsg } }
        });

        await useMenuStore.getState().getAllCategories();

        expect(useMenuStore.getState().error).toBe(errorMsg);
        expect(useMenuStore.getState().isLoading).toBe(false);
    });
});
