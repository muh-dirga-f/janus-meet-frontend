// src/pages/Lobby.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRooms } from '../hooks/useRooms';

export default function LobbyPage() {
    const { rooms, isLoading, createRoom } = useRooms();
    const [title, setTitle] = useState('');
    const navigate = useNavigate();
    //check if user is logged in, if not redirect to login
    if (!localStorage.getItem('accessToken')) {
        navigate('/');
        return null;
    }

    const handleCreate = async () => {
        try {
            const newRoom = await createRoom(title);
            navigate(`/room/${newRoom.id}`);
        } catch (err: any) {
            console.error('Gagal membuat room:', err.response?.data || err.message);
            alert(err.response?.data?.message || 'Gagal membuat room');
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: 'auto' }}>
            <h2>Lobby</h2>

            <div style={{ marginBottom: 20 }}>
                <input
                    type="text"
                    placeholder="Judul room"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <button onClick={handleCreate}>Buat Room</button>
            </div>

            <h3>Daftar Room</h3>
            {isLoading && <p>Loading...</p>}
            <ul>
                {rooms?.map((room: any) => (
                    <li key={room.id}>
                        <button onClick={() => navigate(`/room/${room.id}`)}>
                            {room.title || 'Tanpa Judul'} – {room.id}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
