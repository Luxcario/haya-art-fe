import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Menangkap data katalog yang dikirim dari tombol "Pesan" di Home
    const catalog = location.state?.catalog;

    const [formData, setFormData] = useState({
        eventDate: '',
        location: '',
        note: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            alert('Silakan login terlebih dahulu!');
            navigate('/login');
        } else {
            setUser(JSON.parse(storedUser));
        }

        // Kalau user iseng ngetik URL /booking manual tanpa milih barang, lempar ke Home
        if (!catalog) {
            navigate('/');
        }
    }, [catalog, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/booking', {
                userId: user.id,       // ID yang pesan
                catalogId: catalog.id, // ID barang yang dipesan
                eventDate: formData.eventDate,
                location: formData.location,
                note: formData.note
            });

            alert('Hore! Pesanan berhasil dibuat. Kami akan segera menghubungi WhatsApp Anda.');
            navigate('/');
        } catch (err) {
            console.error(err);
            alert('Gagal membuat pesanan. Pastikan semua data terisi dengan benar.');
        } finally {
            setLoading(false);
        }
    };

    // Mencegah error kalau halaman dimuat sebelum data siap
    if (!catalog || !user) return null;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden">

                {/* Header Form */}
                <div className="bg-amber-600 p-6 text-white text-center">
                    <h2 className="text-2xl font-bold">Formulir Pemesanan</h2>
                    <p className="mt-2 opacity-90">Tema: <b>{catalog.themeName}</b></p>
                </div>

                {/* Isi Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tanggal Acara</label>
                        <input
                            type="date"
                            name="eventDate"
                            onChange={handleChange}
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Alamat Lengkap Lokasi</label>
                        <textarea
                            name="location"
                            rows="3"
                            onChange={handleChange}
                            placeholder="Contoh: Jl. Mawar No. 12, RT 01/RW 02, Gedung Serbaguna..."
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Catatan Tambahan (Opsional)</label>
                        <textarea
                            name="note"
                            rows="2"
                            onChange={handleChange}
                            placeholder="Contoh: Tolong warna bunganya dominan pink ya kak..."
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        ></textarea>
                    </div>

                    {/* Rincian Harga */}
                    <div className="bg-amber-50 p-4 rounded-md border border-amber-200 mt-4">
                        <p className="text-sm text-amber-800 flex justify-between">
                            <span>Total yang harus dibayar:</span>
                            <span className="font-bold text-lg">Rp {parseInt(catalog.price).toLocaleString('id-ID')}</span>
                        </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="w-1/3 rounded-md border border-gray-300 bg-white py-2 font-bold text-gray-700 hover:bg-gray-50 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-2/3 rounded-md bg-amber-600 py-2 font-bold text-white hover:bg-amber-700 transition disabled:bg-gray-400"
                        >
                            {loading ? 'Memproses...' : 'Kirim Pesanan'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default Booking;