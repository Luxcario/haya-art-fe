import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // State untuk Modal Detail
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    const fetchBookings = async () => {
        try {
            const response = await api.get('/booking');
            setBookings(response.data);
        } catch (error) {
            console.error("Gagal ambil data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'ADMIN') {
            alert("Akses Ditolak! Harus login dulu.");
            navigate('/');
            return;
        }
        fetchBookings();
    }, [navigate]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.put(`/booking/${id}/status`, { status: newStatus });
            fetchBookings();
        } catch (error) {
            console.error(error);
            alert('Gagal mengubah status pesanan!');
        }
    };

    const handleViewDetail = (booking) => {
        setSelectedBooking(booking);
        setShowDetail(true);
    };

    const [adminPhone, setAdminPhone] = useState("");
    const [isEditingWA, setIsEditingWA] = useState(false);
    useEffect(() => {
        const fetchSetting = async () => {
            const res = await api.get('/setting');
            setAdminPhone(res.data.adminPhone);
        };
        fetchSetting();
    }, []);

    const handleUpdateWA = async () => {
        try {
            await api.put('/setting', { adminPhone });
            alert("Nomer WA Admin telah terupdate!");
            setIsEditingWA(false);
        } catch (error) {
            console.error(error);
            alert("❌ Gagal mengupdate nomer");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header Admin */}
                <div className="bg-gray-800 p-6 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
                        <div className="mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">Nomor WhatsApp Admin</h3>
                                <p className="text-xs text-gray-500 mt-1">Nomor ini digunakan untuk menerima pesanan langsung dari pelanggan.</p>
                            </div>

                            <div>
                                {!isEditingWA ? (
                                    <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                                        <span className="font-bold text-lg text-gray-800 tracking-wide">
                                            +{adminPhone}
                                        </span>
                                        <button
                                            onClick={() => setIsEditingWA(true)}
                                            className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-md text-sm font-bold hover:bg-amber-200 transition"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 bg-amber-50 p-2 rounded-lg border border-amber-200">
                                        <span className="font-bold text-gray-500 pl-2">+</span>
                                        <input
                                            type="text"
                                            value={adminPhone}
                                            onChange={(e) => setAdminPhone(e.target.value)}
                                            placeholder="Contoh: 62812..."
                                            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none w-40 font-bold text-gray-800"
                                        />
                                        <button
                                            onClick={handleUpdateWA}
                                            className="bg-green-600 text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-green-700 transition shadow-sm"
                                        >
                                            Simpan
                                        </button>
                                        <button
                                            onClick={() => setIsEditingWA(false)}
                                            className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-sm font-bold hover:bg-gray-300 transition"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-2 flex gap-4">
                            <Link to="/admin-catalog" className="bg-amber-600 hover:bg-amber-700 px-3 py-1 rounded text-sm font-medium transition shadow-sm">
                                Kelola Katalog Acara
                            </Link>
                        </div>
                    </div>
                    <button onClick={() => navigate('/')} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm transition border border-gray-600">
                        Kembali ke Web
                    </button>
                </div>

                {/* Tabel Pesanan */}
                <div className="p-6 overflow-x-auto">
                    {loading ? (
                        <p className="text-center text-gray-500 my-10">Memuat data pesanan...</p>
                    ) : bookings.length === 0 ? (
                        <p className="text-center text-gray-500 my-10">Belum ada pesanan yang masuk.</p>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-700 border-b-2 border-gray-200">
                                    <th className="p-4 font-semibold">Tgl Masuk</th>
                                    <th className="p-4 font-semibold">Pemesan</th>
                                    <th className="p-4 font-semibold">Tema Dekorasi</th>
                                    <th className="p-4 font-semibold">Tgl Acara</th>
                                    <th className="p-4 font-semibold text-center">Status</th>
                                    <th className="p-4 font-semibold text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                        {/* Tgl Masuk Baru */}
                                        <td className="p-4 text-sm text-gray-600">
                                            {new Date(booking.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>

                                        {/* Info Pemesan */}
                                        <td className="p-4">
                                            <p className="font-bold text-gray-800">{booking.user.name}</p>
                                            <a href={`https://wa.me/${booking.user.phone}`} target="_blank" rel="noreferrer" className="text-xs text-green-600 hover:underline">
                                                📞 {booking.user.phone}
                                            </a>
                                        </td>

                                        {/* Tema */}
                                        <td className="p-4">
                                            <p className="text-amber-700 font-medium">{booking.catalog.themeName}</p>
                                            <p className="text-xs text-gray-500">
                                                Rp {(parseInt(booking.price) || 0).toLocaleString('id-ID')}</p>
                                        </td>

                                        {/* Tgl Acara */}
                                        <td className="p-4 text-sm font-medium text-blue-600">
                                            {new Date(booking.eventDate).toLocaleDateString('id-ID')}
                                        </td>

                                        {/* Ubah Status */}
                                        <td className="p-4 text-center">
                                            <select
                                                value={booking.status}
                                                onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                                className={`border rounded-md p-2 text-xs font-bold cursor-pointer outline-none w-full
                                                ${booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : ''}
                                                ${booking.status === 'VERIFIED' ? 'bg-blue-100 text-blue-700 border-blue-300' : ''}
                                                ${booking.status === 'WAITING_PAYMENT' ? 'bg-orange-100 text-orange-700 border-orange-300' : ''}
                                                ${booking.status === 'PAID' ? 'bg-green-100 text-green-700 border-green-300' : ''}
                                                ${booking.status === 'COMPLETED' ? 'bg-purple-100 text-purple-700 border-purple-300' : ''}
                                                ${booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700 border-red-300' : ''}`}>
                                                <option value="PENDING">PENDING</option>
                                                <option value="VERIFIED">VERIFIED</option>
                                                <option value="WAITING_PAYMENT">MINTA DP</option>
                                                <option value="PAID">DIBAYAR</option>
                                                <option value="COMPLETED">SELESAI</option>
                                                <option value="CANCELLED">BATAL</option>
                                            </select>
                                        </td>

                                        {/* Tombol View Detail Baru */}
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => handleViewDetail(booking)}
                                                className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-amber-100 hover:text-amber-700 font-bold transition text-xs border border-gray-200"
                                            >
                                                Detail
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>

            {showDetail && selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
                        <div className="bg-amber-600 p-5 text-white flex justify-between items-center">
                            <h3 className="text-lg font-bold">Detail Pesanan</h3>
                            <button onClick={() => setShowDetail(false)} className="text-2xl font-bold hover:text-gray-200">&times;</button>
                        </div>

                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-400 uppercase text-[10px] font-bold tracking-widest">Pelanggan</p>
                                    <p className="font-bold text-gray-800">{selectedBooking.user?.name}</p>
                                    <p className="text-gray-500">{selectedBooking.user?.phone}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 uppercase text-[10px] font-bold tracking-widest">Waktu Order Masuk</p>
                                    <p className="font-bold text-gray-800">
                                        {new Date(selectedBooking.createdAt).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div>
                                <p className="text-gray-400 uppercase text-[10px] font-bold tracking-widest">Tema & Paket Dekorasi</p>
                                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mt-1">
                                    <p className="font-bold text-amber-900">{selectedBooking.catalog?.themeName}</p>
                                    <p className="text-xs text-amber-700">Kategori: {selectedBooking.catalog?.category?.name}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-400 uppercase text-[10px] font-bold tracking-widest">Rencana Acara</p>
                                    <p className="font-bold text-blue-700">{new Date(selectedBooking.eventDate).toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 uppercase text-[10px] font-bold tracking-widest">Lokasi Pemasangan</p>
                                    <p className="text-gray-700 italic">"{selectedBooking.location}"</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <p className="text-gray-400 uppercase text-[10px] font-bold tracking-widest mb-1">Pilihan Paket Opsional & Catatan</p>
                                <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
                                    {selectedBooking.note || "- Tidak ada catatan -"}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 border-t flex justify-end">
                            <button
                                onClick={() => setShowDetail(false)}
                                className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-900 transition"
                            >
                                Tutup Detail
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;