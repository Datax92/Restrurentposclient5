import { create } from "zustand";
import axiosInstance from "../axios/axiosInstace";


export const useTableStore = create((set) => ({
    tables: [],
    isLoading: false,
    error: null,

    getTables: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/table");
            set({ tables: response.data.tables, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || "Error fetching tables", isLoading: false });
        }
    },

    createTable: async (tableData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post("/table", tableData);
            set((state) => ({
                tables: [...state.tables, response.data.table],
                isLoading: false,
            }));
            return { success: true };
        } catch (error) {
            set({ error: error.response?.data?.message || "Error creating table", isLoading: false });
            return { success: false, message: error.response?.data?.message };
        }
    },

    updateTable: async (id, tableData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.put(`/table/${id}`, tableData);
            set((state) => ({
                tables: state.tables.map((t) => (t._id === id ? response.data.table : t)),
                isLoading: false,
            }));
            return { success: true };
        } catch (error) {
            set({ error: error.response?.data?.message || "Error updating table", isLoading: false });
            return { success: false, message: error.response?.data?.message };
        }
    },

    deleteTable: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.delete(`/table/${id}`);
            set((state) => ({
                tables: state.tables.filter((t) => t._id !== id),
                isLoading: false,
            }));
            return { success: true };
        } catch (error) {
            set({ error: error.response?.data?.message || "Error deleting table", isLoading: false });
            return { success: false, message: error.response?.data?.message };
        }
    },

    reserveTable: async (id, reservationData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post(`/table/${id}/reserve`, reservationData);
            set((state) => ({
                tables: state.tables.map((t) => (t._id === id ? response.data.table : t)),
                isLoading: false,
            }));
            return { success: true };
        } catch (error) {
            set({ error: error.response?.data?.message || "Error reserving table", isLoading: false });
            return { success: false, message: error.response?.data?.message };
        }
    },

    cancelReservation: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post(`/table/${id}/cancel-reservation`);
            set((state) => ({
                tables: state.tables.map((t) => (t._id === id ? response.data.table : t)),
                isLoading: false,
            }));
            return { success: true };
        } catch (error) {
            set({ error: error.response?.data?.message || "Error canceling reservation", isLoading: false });
            return { success: false, message: error.response?.data?.message };
        }
    },
}));
