import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Kirim data ke backend
            await api.post('/auth/register', formData);
            alert('Registrasi Berhasil! Silakan Login.');
            navigate('/login'); // Pindah ke halaman login
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Gagal mendaftar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Daftar Akun Haya Art</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                        <input
                            type="text"
                            name="name"
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            required
                        />
                    </div>

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
                        <label className="block text-sm font-medium text-gray-700">No. WhatsApp</label>
                        <input
                            type="text"
                            name="phone"
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
                        {loading ? 'Memproses...' : 'Daftar Sekarang'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Sudah punya akun?{' '}
                    <Link to="/login" className="font-medium text-amber-600 hover:underline">
                        Login disini
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;