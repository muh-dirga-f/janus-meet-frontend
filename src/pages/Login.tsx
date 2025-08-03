import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
    const { login, loading, user } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/lobby'); // ganti sesuai halaman setelah login
        } catch (err: any) {
            alert(err?.response?.data?.message || 'Login gagal');
        }
    };

    if (user) return <p>Sudah login sebagai {user.name}</p>;

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: 'auto' }}>
            <h2>Login</h2>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', marginBottom: 10 }}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', marginBottom: 10 }}
            />

            <button type="submit" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Masuk...' : 'Login'}
            </button>

            <p style={{ marginTop: 10 }}>
                Belum punya akun? <Link to="/register">Daftar di sini</Link>
            </p>
        </form>
    );
}
