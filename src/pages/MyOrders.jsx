import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const MyOrders = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert("Silakan login terlebih dahulu untuk melihat pesanan Anda.");
            navigate('/login');
            return;
        }

        const fetchMyOrders = async () => {
            try {
                const response = await api.get(`/booking/user/${user.id}`);
                setBookings(response.data);
            } catch (error) {
                console.error("Gagal mengambil pesanan:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyOrders();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">📦 Pesanan Saya</h2>
                    <Link to="/" className="text-amber-600 hover:underline font-medium">← Kembali ke Katalog</Link>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500 mt-10">Mencari data pesanan...</p>
                ) : bookings.length === 0 ? (
                    <div className="text-center bg-white p-10 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 mb-4">Kamu belum punya pesanan apa-apa nih.</p>
                        <Link to="/" className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700">Mulai Pesan Sekarang</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition">

                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {booking.catalog?.themeName || "Tema Dekorasi"}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">Dipesan pada: {new Date(booking.createdAt).toLocaleDateString('id-ID')}</p>
                                </div>

                                <div className="bg-amber-50 p-3 rounded-lg text-sm w-full md:w-auto">
                                    <p className="text-gray-700">📅 Acara: <span className="font-semibold">{new Date(booking.eventDate).toLocaleDateString('id-ID')}</span></p>
                                    <p className="text-gray-700 mt-1">📍 Lokasi: <span className="font-semibold">{booking.location}</span></p>
                                </div>

                                <div className="text-right w-full md:w-auto">
                                    <p className="text-lg font-bold text-amber-600">
                                        Rp {(parseInt(booking.price) || 0).toLocaleString('id-ID')}
                                    </p>

                                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold
                                    ${booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : ''}
                                    ${booking.status === 'VERIFIED' ? 'bg-blue-100 text-blue-700' : ''}
                                    ${booking.status === 'WAITING_PAYMENT' ? 'bg-orange-100 text-orange-700' : ''}
                                    ${booking.status === 'PAID' ? 'bg-green-100 text-green-700' : ''}
                                    ${booking.status === 'COMPLETED' ? 'bg-purple-100 text-purple-700' : ''}
                                    ${booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : ''}`}>
                                        Status: {booking.status ? booking.status.replace('_', ' ') : 'PENDING'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default MyOrders;