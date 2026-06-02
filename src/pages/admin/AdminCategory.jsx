import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const AdminCategory = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // State untuk Form Pop-up
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', imageUrl: '' });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'ADMIN') {
            alert("Akses Ditolak! Khusus Admin.");
            navigate('/');
            return;
        }
        fetchCategories();
    }, [navigate]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/category');
            setCategories(response.data);
        } catch (error) {
            console.error("Gagal ambil data kategori:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBukaFormTambah = () => {
        setFormData({ name: '', description: '', imageUrl: '' });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/category', formData);
            alert("Kategori acara berhasil ditambahkan!");
            setShowForm(false);
            fetchCategories();
        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan kategori!");
        }
    };

    const handleHapus = async (id) => {
        const yakin = window.confirm("Yakin ingin menghapus kategori ini? SEMUA TEMA di dalamnya akan ikut terhapus!");
        if (!yakin) return;

        try {
            await api.delete(`/category/${id}`);
            alert("Kategori berhasil dihapus!");
            fetchCategories();
        } catch (error) {
            console.error(error);
            alert("Gagal menghapus kategori.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden relative">

                {/* Header Admin */}
                <div className="bg-gray-800 p-6 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Kelola Kategori Acara</h1>
                        <div className="text-sm text-gray-400 mt-2 flex gap-4">
                            <Link to="/admin" className="hover:text-white transition">← Kembali ke Dashboard</Link>
                        </div>
                    </div>
                    <button
                        onClick={handleBukaFormTambah}
                        className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded text-sm font-bold transition shadow-md"
                    >
                        + Tambah Kategori Baru
                    </button>
                </div>

                {/* Tabel Kategori */}
                <div className="p-6 overflow-x-auto">
                    {loading ? (
                        <p className="text-center text-gray-500 my-10">Memuat data kategori...</p>
                    ) : categories.length === 0 ? (
                        <p className="text-center text-gray-500 my-10">Belum ada kategori acara. Silakan tambah baru!</p>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-700 border-b-2 border-gray-200">
                                    <th className="p-4 font-semibold w-24">Foto</th>
                                    <th className="p-4 font-semibold">Nama Kategori</th>
                                    <th className="p-4 font-semibold w-1/2">Deskripsi</th>
                                    <th className="p-4 font-semibold text-center w-40">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat) => (
                                    <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                        <td className="p-4">
                                            {cat.imageUrl ? (
                                                <img src={cat.imageUrl} alt="kategori" className="w-16 h-16 object-cover rounded shadow-sm" />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500 text-center">No Pic</div>
                                            )}
                                        </td>
                                        <td className="p-4 font-bold text-gray-800">{cat.name}</td>
                                        <td className="p-4 text-sm text-gray-600">{cat.description}</td>
                                        <td className="p-4 flex gap-2 justify-center">
                                            <button
                                                onClick={() => handleHapus(cat.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* MODAL FORM TAMBAH */}
                {showForm && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="bg-amber-600 p-4 text-white font-bold flex justify-between">
                                <h3>✨ Tambah Kategori Acara</h3>
                                <button onClick={() => setShowForm(false)} className="hover:text-gray-200">X</button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nama Acara (Misal: Pernikahan)</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full border rounded p-2 focus:ring-amber-500 focus:border-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Deskripsi Singkat</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="mt-1 w-full border rounded p-2 focus:ring-amber-500 focus:border-amber-500"></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Link Foto Cover (URL) - Opsional</label>
                                    <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 w-full border rounded p-2 focus:ring-amber-500 focus:border-amber-500" placeholder="https://..." />
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <button type="button" onClick={() => setShowForm(false)} className="w-1/3 bg-gray-200 text-gray-800 py-2 rounded font-bold hover:bg-gray-300">Batal</button>
                                    <button type="submit" className="w-2/3 bg-amber-600 text-white py-2 rounded font-bold hover:bg-amber-700">Simpan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminCategory;