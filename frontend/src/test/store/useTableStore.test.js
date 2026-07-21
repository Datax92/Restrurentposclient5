import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTableStore } from '../../store/useTableStore';
import axiosInstance from '../../axios/axiosInstace';

describe('useTableStore', () => {
    beforeEach(() => {
        useTableStore.setState({
            tables: [],
            isLoading: false,
            error: null
        });
        vi.clearAllMocks();
    });

    it('should fetch all tables', async () => {
        const tables = [{ _id: 't1', tableNumber: '1', status: 'Available' }];
        axiosInstance.get.mockResolvedValue({ data: { tables } });

        await useTableStore.getState().getTables();

        expect(useTableStore.getState().tables).toEqual(tables);
        expect(axiosInstance.get).toHaveBeenCalledWith('/table');
    });

    it('should create a table', async () => {
        const newTable = { _id: 't2', tableNumber: '2', capacity: 4 };
        axiosInstance.post.mockResolvedValue({ data: { table: newTable } });

        const result = await useTableStore.getState().createTable({ tableNumber: '2' });

        expect(result.success).toBe(true);
        expect(useTableStore.getState().tables).toContainEqual(newTable);
    });

    it('should update a table', async () => {
        const initialTable = { _id: 't1', tableNumber: '1' };
        const updatedTable = { _id: 't1', tableNumber: '1-Updated' };
        useTableStore.setState({ tables: [initialTable] });
        axiosInstance.put.mockResolvedValue({ data: { table: updatedTable } });

        const result = await useTableStore.getState().updateTable('t1', { tableNumber: '1-Updated' });

        expect(result.success).toBe(true);
        expect(useTableStore.getState().tables[0].tableNumber).toBe('1-Updated');
    });

    it('should reserve a table', async () => {
        const table = { _id: 't1', status: 'Available' };
        const reservedTable = { _id: 't1', status: 'Reserved' };
        useTableStore.setState({ tables: [table] });
        axiosInstance.post.mockResolvedValue({ data: { table: reservedTable } });

        const result = await useTableStore.getState().reserveTable('t1', { customerName: 'John' });

        expect(result.success).toBe(true);
        expect(useTableStore.getState().tables[0].status).toBe('Reserved');
        expect(axiosInstance.post).toHaveBeenCalledWith('/table/t1/reserve', { customerName: 'John' });
    });

    it('should cancel a reservation', async () => {
        const table = { _id: 't1', status: 'Reserved' };
        const availableTable = { _id: 't1', status: 'Available' };
        useTableStore.setState({ tables: [table] });
        axiosInstance.post.mockResolvedValue({ data: { table: availableTable } });

        const result = await useTableStore.getState().cancelReservation('t1');

        expect(result.success).toBe(true);
        expect(useTableStore.getState().tables[0].status).toBe('Available');
        expect(axiosInstance.post).toHaveBeenCalledWith('/table/t1/cancel-reservation');
    });

    it('should handle API errors', async () => {
        const errorMsg = 'Table already exists';
        axiosInstance.post.mockRejectedValue({
            response: { data: { message: errorMsg } }
        });

        const result = await useTableStore.getState().createTable({ tableNumber: '1' });

        expect(result.success).toBe(false);
        expect(result.message).toBe(errorMsg);
        expect(useTableStore.getState().error).toBe(errorMsg);
    });
});
