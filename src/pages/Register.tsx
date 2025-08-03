import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            alert('Registrasi berhasil! Silakan login.');
            navigate('/'); // ⬅️ redirect ke login
        } catch (err: any) {
            alert(err?.response?.data?.message || 'Register gagal');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: 'auto' }}>
            <h2>Register</h2>

            <input
                type="text"
                placeholder="Nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', marginBottom: 10 }}
            />

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
                {loading ? 'Mendaftar...' : 'Register'}
            </button>

            <p style={{ marginTop: 10 }}>
                Sudah punya akun? <Link to="/">Login</Link>
            </p>
        </form>
    );
}
