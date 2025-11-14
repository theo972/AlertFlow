import axios from "axios";

let TOKEN: string | null = null;

export function setAuthToken(token: string | null) {
    TOKEN = token;
}

export const api = axios.create({baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use((config) => {
    if (TOKEN) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${TOKEN}`;
    }
    return config;
});
