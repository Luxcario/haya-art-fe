import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [categories, setCategories] = useState([]); // Wadah untuk Acara
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/category');
                setCategories(response.data);
            } catch (error) {
                console.error("Gagal mengambil data kategori:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const handleLihatDetail = (katalogYangDipilih) => {
        navigate(`/theme/${katalogYangDipilih.id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Navbar */}
            <nav className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <h1 className="text-2xl font-bold text-amber-600 tracking-wide">Haya Art</h1>
                <div>
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-gray-700 hidden sm:inline">Halo, <b>{user.name}</b></span>

                            {user.role !== 'ADMIN' && (
                                <Link to="/my-orders" className="text-amber-600 font-medium hover:text-amber-700 transition">
                                    📦 Pesanan Saya
                                </Link>
                            )}

                            {user.role === 'ADMIN' && (
                                <Link to="/admin" className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition text-sm font-medium">
                                    ⚙️ Dashboard Admin
                                </Link>
                            )}

                            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition text-sm font-medium">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <Link to="/login" className="px-4 py-2 text-amber-600 border border-amber-600 rounded-md hover:bg-amber-50 transition font-medium">Masuk</Link>
                            <Link to="/register" className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition font-medium">Daftar</Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <div className="bg-amber-600 text-white py-20 px-6 text-center shadow-inner">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Wujudkan Dekorasi Impianmu</h2>
                <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                    Backdrop estetik untuk berbagai momen spesial. Harga terjangkau, hasil memukau.
                </p>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto p-8 min-h-[400px]">
                {loading ? (
                    <p className="text-center text-gray-500">Memuat data...</p>
                ) : !selectedCategory ? (
                    <>
                        <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Pilih Acara Anda</h3>

                        {categories.length === 0 ? (
                            <p className="text-center text-gray-500">Belum ada pilihan acara saat ini.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category)}
                                        className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer group border border-gray-100"
                                    >
                                        <div className="h-56 bg-gray-200 overflow-hidden relative">
                                            {category.imageUrl ? (
                                                <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-amber-800 bg-amber-100 font-bold text-xl">{category.name}</div>
                                            )}
                                            {/* Overlay gradien biar estetik */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                            <h4 className="absolute bottom-4 left-4 text-2xl font-bold text-white tracking-wide">{category.name}</h4>
                                        </div>
                                        <div className="p-5 text-center">
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.description || `Lihat berbagai tema dekorasi untuk acara ${category.name} Anda.`}</p>
                                            <button className="bg-gray-800 text-white px-6 py-2 rounded-full group-hover:bg-amber-600 transition text-sm font-medium w-full">
                                                Lihat {category.catalogs?.length || 0} Tema →
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-800">
                                Tema Dekorasi: <span className="text-amber-600">{selectedCategory.name}</span>
                            </h3>
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="text-gray-500 hover:text-amber-600 font-bold transition flex items-center gap-2 mt-4 md:mt-0">
                                <span>←</span> Kembali ke Pilihan Acara
                            </button>
                        </div>
                        {selectedCategory.catalogs.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                                <p className="text-gray-500 text-lg">Belum ada tema yang ditambahkan untuk acara ini.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {selectedCategory.catalogs.map((catalog) => (
                                    <div key={catalog.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col">
                                        <div className="h-48 bg-gray-200 overflow-hidden relative">
                                            {catalog.imageUrl ? (
                                                <img src={catalog.imageUrl} alt={catalog.themeName} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-amber-800 bg-amber-100 font-semibold">{catalog.themeName}</div>
                                            )}
                                        </div>
                                        <div className="p-5 flex flex-col flex-grow">
                                            <h4 className="text-xl font-bold text-gray-800">{catalog.themeName}</h4>
                                            <p className="text-gray-600 text-sm mt-2 line-clamp-2 flex-grow">{catalog.description}</p>
                                            <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-100">
                                                <span className="text-amber-600 font-bold text-lg">
                                                    Rp {
                                                        catalog.prices && catalog.prices.length > 0 ? Math.min(...catalog.prices.map(p => p.price)).toLocaleString('id-ID') : '0'
                                                    }
                                                </span>
                                                <button
                                                    onClick={() => handleLihatDetail(catalog)}
                                                    className="bg-amber-600 text-white px-5 py-2 rounded-lg hover:bg-amber-700 transition font-medium shadow-md"
                                                >
                                                    Lihat Detail
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;