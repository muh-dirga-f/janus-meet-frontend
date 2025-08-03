import { create } from 'zustand';
import axios from 'axios';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    fetchMe: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    loading: false,

    login: async (email, password) => {
        set({ loading: true });
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
                { email, password },
                { withCredentials: true }, // ⬅️ penting agar cookie refreshToken dikirim
            );
            set({
                user: res.data.user,
                accessToken: res.data.accessToken,
                loading: false,
            });
        } catch (err) {
            set({ loading: false });
            throw err;
        }
    },

    register: async (name, email, password) => {
        set({ loading: true });
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
                { name, email, password },
                { withCredentials: true }
            );
            set({ loading: false });
        } catch (err) {
            set({ loading: false });
            throw err;
        }
    },

    logout: () => {
        set({ user: null, accessToken: null });
    },

    fetchMe: async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${useAuth.getState().accessToken}`,
                },
                withCredentials: true,
            });
            set({ user: res.data.user });
        } catch {
            // attempt refresh token
            try {
                const refreshRes = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
                    {},
                    { withCredentials: true },
                );
                set({ accessToken: refreshRes.data.accessToken });

                // re-fetch
                const retry = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${refreshRes.data.accessToken}`,
                    },
                });
                set({ user: retry.data.user });
            } catch (err) {
                set({ user: null, accessToken: null });
            }
        }
    },
}));
