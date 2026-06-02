import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/auth/login', formData);

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            alert('Login Berhasil! Selamat Datang.');
            navigate('/');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Email atau Password Salah!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Masuk ke Haya Art</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-amber-600 px-4 py-2 font-bold text-white transition hover:bg-amber-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Memproses...' : 'Masuk'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Belum punya akun?{' '}
                    <Link to="/register" className="font-medium text-amber-600 hover:underline">
                        Daftar disini
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;