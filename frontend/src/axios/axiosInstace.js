import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL 
    ? `${import.meta.env.VITE_API_BASE_URL}/api`
    : (import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "https://tastystation-bg.vercel.app/api");

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
});

export default axiosInstance;