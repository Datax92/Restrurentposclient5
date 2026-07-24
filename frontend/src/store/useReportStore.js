import { create } from "zustand";
import axiosInstance from "../axios/axiosInstace";

const buildParams = (filter, startDate, endDate) => {
    if (startDate && endDate) {
        return `startDate=${startDate}&endDate=${endDate}`;
    }
    return `filter=${filter}`;
};

const useReportStore = create((set) => ({
    salesData:      [],
    cashierData:    [],
    topItemsData:   [],
    ordersData:     [],
    profitLossData: { totalRevenue: 0, totalCost: 0, profit: 0, orderCount: 0 },
    isLoading: false,
    error: null,

    fetchSalesReports: async (filter = "daily", startDate, endDate) => {
        set({ isLoading: true });
        try {
            const params = buildParams(filter, startDate, endDate);
            const response = await axiosInstance.get(`/reports/sales?${params}`);
            set({ salesData: response.data.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchCashierCollections: async (filter = "daily", startDate, endDate) => {
        set({ isLoading: true });
        try {
            const params = buildParams(filter, startDate, endDate);
            const response = await axiosInstance.get(`/reports/cashier-collections?${params}`);
            set({ cashierData: response.data.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchTopSellingItems: async (filter = "daily", startDate, endDate, limit = 10) => {
        set({ isLoading: true });
        try {
            const params = buildParams(filter, startDate, endDate);
            const response = await axiosInstance.get(`/reports/top-selling?${params}&limit=${limit}`);
            set({ topItemsData: response.data.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchProfitLoss: async (filter = "monthly", startDate, endDate) => {
        set({ isLoading: true });
        try {
            const params = buildParams(filter, startDate, endDate);
            const response = await axiosInstance.get(`/reports/profit-loss?${params}`);
            set({ profitLossData: response.data.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchOrdersReport: async (filter = "monthly", startDate, endDate) => {
        set({ isLoading: true });
        try {
            const params = buildParams(filter, startDate, endDate);
            const response = await axiosInstance.get(`/reports/orders?${params}`);
            set({ ordersData: response.data.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },
}));

export default useReportStore;
