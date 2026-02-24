import axios from "axios";

const apiClient = axios.create({
    // Locally: NEXT_PUBLIC_API_URL=http://localhost:4000 (json-server)
    // Vercel: empty string → relative URL → hits Next.js API routes
    baseURL: process.env.NEXT_PUBLIC_API_URL || "",
    headers: {
        "Content-Type": "application/json",
    },
});

export default apiClient;
