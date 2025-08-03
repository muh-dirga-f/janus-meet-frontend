// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true, // penting untuk kirim cookie
});

export default api;
