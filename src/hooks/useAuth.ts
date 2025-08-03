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
    accessToken: localStorage.getItem('accessToken'),
    loading: false,

    login: async (email, password) => {
        set({ loading: true });
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
                { email, password },
                { withCredentials: true }
            );
            localStorage.setItem('accessToken', res.data.accessToken);
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
        localStorage.removeItem('accessToken');
        set({ user: null, accessToken: null });
    },

    fetchMe: async () => {
        try {
            const token = useAuth.getState().accessToken;
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            set({ user: res.data.user });
        } catch {
            try {
                const refreshRes = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                const newToken = refreshRes.data.accessToken;
                localStorage.setItem('accessToken', newToken);
                set({ accessToken: newToken });

                const retry = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${newToken}`,
                    },
                });
                set({ user: retry.data.user });
            } catch (err) {
                localStorage.removeItem('accessToken');
                set({ user: null, accessToken: null });
            }
        }
    },
}));
