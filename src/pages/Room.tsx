import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

interface Message {
    id: string;
    text: string;
    ts: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export default function RoomPage() {
    const { id: roomId } = useParams();
    const { accessToken } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const socketRef = useRef<Socket | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!accessToken || !roomId) return;

        const baseUrl = import.meta.env.VITE_BASEURL;
        console.log('🔌 Connecting to WS:', baseUrl);

        const socket = io(baseUrl, {
            path: '/ws',
            auth: { token: accessToken },
        });

        socket.on('connect', () => {
            console.log('✅ Socket connected:', socket.id);
            socket.emit('join-room', { roomId });
        });

        socket.on('peer-joined', (peer: any) => {
            console.log('👥 Peer joined:', peer);
        });

        socket.on('chat-new', (msg: Message) => {
            console.log('💬 Received message:', msg);
            setMessages((prev) => [...prev, msg]); // ✅ penting: jangan hanya msg.text
        });

        socket.on('connect_error', (err) => {
            console.error('❌ Socket connection error:', err.message);
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
        };
    }, [accessToken, roomId]);

    const sendMessage = () => {
        if (input.trim() && socketRef.current) {
            console.log('📤 Sending message:', input);
            socketRef.current.emit('chat-send', { text: input });
            setInput('');
        }
    };

    if (!accessToken) {
        navigate('/');
        return null;
    }

    return (
        <div style={{ maxWidth: 600, margin: 'auto' }}>
            <h2>Room: {roomId}</h2>

            <div style={{ marginBottom: 20 }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ketik pesan..."
                    style={{ width: '80%', marginRight: 10 }}
                />
                <button onClick={sendMessage}>Kirim</button>
            </div>

            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {messages.map((msg) => (
                    <li key={msg.id}>
                        <strong>{msg.user.name}:</strong> {msg.text}
                    </li>
                ))}
            </ul>
        </div>
    );
}