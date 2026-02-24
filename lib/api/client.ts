import axios from "axios";

const apiClient = axios.create({
    // Use relative path so it automatically uses current domain including Vercel
    baseURL: process.env.NEXT_PUBLIC_API_URL || "",
    headers: {
        "Content-Type": "application/json",
    },
});

export default apiClient;
