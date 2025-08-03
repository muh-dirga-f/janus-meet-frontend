import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url: string) =>
    axios.get(url, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    }).then((res) => res.data);

export function useRooms() {
    const { data, error, mutate, isLoading } = useSWR(
        `${import.meta.env.VITE_BACKEND_URL}/rooms`,
        fetcher
    );

    const createRoom = async (title?: string) => {
        const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/rooms`,
            { title },
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            }
        );
        mutate(); // refresh list
        return res.data;
    };

    return {
        rooms: data,
        error,
        isLoading,
        createRoom,
        refreshRooms: mutate,
    };
}
