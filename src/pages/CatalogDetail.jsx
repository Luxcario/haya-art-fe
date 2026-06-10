import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CatalogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [catalog, setCatalog] = useState(null);
    const [loading, setLoading] = useState(true);

    // Multi-Step Form
    const [step, setStep] = useState(1);
    const [lokasi, setLokasi] = useState("");
    const [kelas, setKelas] = useState("");

    // Form Pemesanan
    const [formData, setFormData] = useState({ eventDate: '', location: '', note: '' });
    const [user, setUser] = useState(null);
    const [mainImage, setMainImage] = useState("");

    const [isMakeupChecked, setIsMakeupChecked] = useState(false);
    const [isHiburanChecked, setIsHiburanChecked] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        const fetchDetail = async () => {
            try {
                const response = await api.get(`/catalog/${id}`);
                setCatalog(response.data);
                if (response.data.imageUrl) setMainImage(response.data.imageUrl);
            } catch (error) {
                console.error("Gagal mengambil detail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const paketAktif = catalog?.prices?.find(
        (p) => p.lokasi === lokasi && p.paket === kelas
    );

    const getFinalPrice = () => {
        if (!paketAktif) return 0;
        return parseInt(paketAktif.price) || 0;
    };

    const handlePesan = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Silakan Login terlebih dahulu untuk memesan!");
            navigate('/login');
            return;
        }

        try {
            const settingRes = await api.get('/setting');
            const activeAdminPhone = settingRes.data.adminPhone;

            let detailMua = "";
            if (isMakeupChecked) {
                const selectedMuaElement = document.querySelector('input[name="mua"]:checked');
                detailMua = selectedMuaElement ? ` (${selectedMuaElement.value})` : "";
            }

            let layananTambahanText = "";
            if (isMakeupChecked) layananTambahanText += `• Include Vendor Make-up (MUA)${detailMua}\n`;
            if (isHiburanChecked) layananTambahanText += `• Include Hiburan & Musik\n`;
            if (!isMakeupChecked && !isHiburanChecked) layananTambahanText += `• Tanpa layanan tambahan\n`;

            const gabunganNote = `[Paket: ${lokasi} - Kelas ${kelas}] \n${formData.note}`;
            const payload = {
                catalogId: catalog.id,
                userId: user.id,
                eventDate: new Date(formData.eventDate).toISOString(),
                location: formData.location,
                note: gabunganNote,
                totalPrice: getFinalPrice()
            };

            await api.post('/booking', payload);

            const waMessage =
                `Halo Haya Art!

                Saya ingin memesan dekorasi dengan detail berikut:

                *Kategori Acara:* ${catalog.category?.name || 'Spesial'}
                - *Tema Dekorasi:* ${catalog.themeName}
                - *Jenis Lokasi:* ${lokasi}
                - *Kelas Paket:* ${kelas}

                *Rencana Acara*
                - *Tanggal:* ${formData.eventDate}
                - *Lokasi Lengkap:* ${formData.location}

                *Layanan Tambahan:*
                ${layananTambahanText}
                *Catatan Khusus:*
                "${formData.note || '-'}"

                *Total Estimasi:* Rp ${getFinalPrice().toLocaleString('id-ID')}

                Mohon segera dikonfirmasi dan dicek jadwalnya ya, terima kasih! 🙏`;

            const waUrl = `https://wa.me/${activeAdminPhone}?text=${encodeURIComponent(waMessage)}`;

            alert("Pesanan berhasil dicatat! Mengalihkan ke WhatsApp...");

            window.location.href = waUrl;

        } catch (error) {
            console.error("Error saat memesan:", error);
            alert("Gagal membuat pesanan. Silakan coba lagi.");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-amber-600 font-bold text-xl">Memuat Detail Tema...</div>;
    if (!catalog) return <div className="text-center mt-20 text-xl">Tema tidak ditemukan.</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            <div className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
                    <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-amber-600 font-bold flex items-center gap-2 transition">
                        <span>←</span> Kembali
                    </button>
                    <h2 className="font-bold text-gray-800 hidden sm:block">Detail Dekorasi</h2>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-6">

                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-full h-80 md:h-[450px] bg-gray-200 rounded-xl overflow-hidden relative transition-all duration-500">
                            {mainImage ? (
                                <img src={mainImage} alt="Foto Utama" className="w-full h-full object-cover transition-opacity duration-300" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">Tidak ada foto</div>
                            )}
                            <div className="absolute top-4 left-4 bg-amber-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow">
                                {catalog.category?.name || 'Spesial'}
                            </div>
                        </div>

                        {catalog.gallery && (
                            <div className="grid grid-cols-4 md:grid-cols-5 gap-3 mt-3">
                                <div onClick={() => setMainImage(catalog.imageUrl)} className={`h-20 md:h-24 bg-gray-200 rounded-lg overflow-hidden border-2 cursor-pointer transition ${mainImage === catalog.imageUrl ? 'border-amber-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                                    <img src={catalog.imageUrl} alt="cover" className="w-full h-full object-cover" />
                                </div>
                                {catalog.gallery.split(',').map((img, index) => (
                                    img.trim() && (
                                        <div key={index} onClick={() => setMainImage(img.trim())} className={`h-20 md:h-24 bg-gray-200 rounded-lg overflow-hidden border-2 cursor-pointer transition ${mainImage === img.trim() ? 'border-amber-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                                            <img src={img.trim()} alt={`gallery-${index}`} className="w-full h-full object-cover" />
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Judul & Deskripsi Utama */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{catalog.themeName}</h1>
                        <p className="text-gray-600 leading-relaxed">{catalog.description}</p>
                    </div>

                    {step === 3 && (
                        <div className="animate-fade-in space-y-6">
                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800">
                                <p className="font-bold"> Pilihan Anda: Dekorasi {lokasi} - Paket {kelas}</p>
                                <p className="text-sm opacity-90">Berikut adalah fasilitas dan layanan tambahan untuk paket yang Anda pilih.</p>
                            </div>

                            {paketAktif && paketAktif.features && (
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 bg-gradient-to-r from-blue-50/30 to-white">
                                    <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center gap-2"> Fasilitas Khusus Paket {kelas}</h3>
                                    <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed bg-white p-4 rounded-xl border border-blue-100">
                                        {paketAktif.features}
                                    </p>
                                </div>
                            )}

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">Yang Pasti Kamu Dapatkan (Fasilitas Umum)</h3>
                                {catalog.fasilitas ? (
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600">
                                        {catalog.fasilitas.split(',').map((item, index) => (
                                            item.trim() && <li key={index} className="flex items-center gap-2">✅ {item.trim()}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 italic">Data fasilitas belum diisi oleh Admin.</p>
                                )}
                            </div>

                            {(catalog.opsiMakeup || catalog.opsiHiburan) && (
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">Layanan Tambahan (Opsional)</h3>
                                    <div className="space-y-5">
                                        {catalog.opsiMakeup && (
                                            <div className={`p-5 border rounded-xl transition-all duration-300 ${isMakeupChecked ? 'border-blue-400 bg-blue-50 shadow-sm' : 'border-gray-200 bg-gray-50'}`}>
                                                <label className="flex items-center gap-3 font-bold text-gray-800 cursor-pointer mb-3">
                                                    <input type="checkbox" checked={isMakeupChecked} onChange={(e) => setIsMakeupChecked(e.target.checked)} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" />
                                                    Tambah Vendor Make-up (MUA)
                                                </label>
                                                <div className={`pl-8 space-y-3 transition-opacity duration-300 ${isMakeupChecked ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                                                    {catalog.opsiMakeup.split(',').map((item, index) => (
                                                        item.trim() && (
                                                            <label key={index} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                                                                <input type="radio" name="mua" disabled={!isMakeupChecked} className="w-4 h-4 text-blue-600 focus:ring-blue-500" value={item.trim()} />
                                                                <span><b>{item.trim()}</b></span>
                                                            </label>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {catalog.opsiHiburan && (
                                            <div className={`p-5 border rounded-xl transition-all duration-300 ${isHiburanChecked ? 'border-purple-400 bg-purple-50 shadow-sm' : 'border-gray-200 bg-gray-50'}`}>
                                                <label className="flex items-center gap-3 font-bold text-gray-800 cursor-pointer mb-3">
                                                    <input type="checkbox" checked={isHiburanChecked} onChange={(e) => setIsHiburanChecked(e.target.checked)} className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 cursor-pointer" />
                                                    🎵 Tambah Hiburan & Musik
                                                </label>
                                                <div className={`pl-8 space-y-3 transition-opacity duration-300 ${isHiburanChecked ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                                                    {catalog.opsiHiburan.split(',').map((item, index) => (
                                                        item.trim() && (
                                                            <label key={index} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                                                                <input type="checkbox" disabled={!isHiburanChecked} className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" value={item.trim()} />
                                                                <span><b>{item.trim()}</b></span>
                                                            </label>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="relative">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-24 transition-all duration-500">

                        <div className="flex gap-2 mb-6">
                            <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-amber-600' : 'bg-gray-200'}`}></div>
                            <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-amber-600' : 'bg-gray-200'}`}></div>
                            <div className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-amber-600' : 'bg-gray-200'}`}></div>
                        </div>

                        {step === 1 && (
                            <div className="animate-fade-in">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">1. Pilih Lokasi Acara</h3>
                                <p className="text-sm text-gray-500 mb-6">Sesuaikan dekorasi dengan lokasi acaramu.</p>
                                <div className="space-y-4">
                                    <button
                                        onClick={() => { setLokasi('Rumahan'); setStep(2); }}
                                        className="w-full text-left p-4 border-2 border-gray-200 hover:border-amber-500 hover:bg-amber-50 rounded-xl transition group"
                                    >
                                        <div className="font-bold text-lg text-gray-800 group-hover:text-amber-700">Acara Rumahan</div>
                                        <div className="text-sm text-gray-500">Desain disesuaikan dengan luas area rumah.</div>
                                    </button>
                                    <button
                                        onClick={() => { setLokasi('Gedung'); setStep(2); }}
                                        className="w-full text-left p-4 border-2 border-gray-200 hover:border-amber-500 hover:bg-amber-50 rounded-xl transition group"
                                    >
                                        <div className="font-bold text-lg text-gray-800 group-hover:text-amber-700">Acara Gedung</div>
                                        <div className="text-sm text-gray-500">Lebih megah untuk menyiasati ruangan besar.</div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-fade-in">
                                <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-amber-600 mb-4 font-bold flex items-center gap-1">← Kembali ke Lokasi</button>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">2. Pilih Kelas Paket</h3>
                                <p className="text-sm text-gray-500 mb-6">Pilih paket untuk dekorasi <span className="font-bold text-amber-600">{lokasi}</span>.</p>
                                <div className="space-y-3">
                                    <button onClick={() => { setKelas('Bronze'); setStep(3); }} className="w-full text-left p-4 border-2 border-gray-200 hover:border-amber-500 hover:bg-amber-50 rounded-xl transition flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-gray-800">Paket Bronze</div>
                                            <div className="text-xs text-gray-500">Standar & Elegan</div>
                                        </div>
                                    </button>
                                    <button onClick={() => { setKelas('Silver'); setStep(3); }} className="w-full text-left p-4 border-2 border-gray-200 hover:border-amber-500 hover:bg-amber-50 rounded-xl transition flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-gray-800">Paket Silver</div>
                                            <div className="text-xs text-gray-500">Ekstra Bunga Segar</div>
                                        </div>
                                    </button>
                                    <button onClick={() => { setKelas('Gold'); setStep(3); }} className="w-full text-left p-4 border-2 border-gray-200 hover:border-amber-500 hover:bg-amber-50 rounded-xl transition flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-gray-800">Paket Gold</div>
                                            <div className="text-xs text-gray-500">Premium & Mewah</div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-fade-in">
                                <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-amber-600 mb-4 font-bold flex items-center gap-1">← Ganti Paket</button>

                                <div className="bg-gray-900 text-white p-4 rounded-xl mb-6 text-center shadow-inner">
                                    <p className="text-sm text-gray-400">Total Estimasi Harga</p>
                                    <p className="text-2xl font-bold text-amber-400">
                                        {getFinalPrice() > 0 ? `Rp ${getFinalPrice().toLocaleString('id-ID')}` : 'Paket Tidak Tersedia'}
                                    </p>
                                </div>

                                <form onSubmit={handlePesan} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Acara</label>
                                        <input type="date" required value={formData.eventDate} onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Lokasi Lengkap</label>
                                        <textarea required rows="2" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none resize-none"></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Catatan (Pilihan Vendor dll)</label>
                                        <textarea rows="2" value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none resize-none"></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={getFinalPrice() === 0}
                                        className={`w-full py-3 rounded-lg font-bold text-lg transition shadow-md mt-4 text-white ${getFinalPrice() > 0 ? 'bg-amber-600 hover:bg-amber-700 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'}`}
                                    >
                                        Pesan Sekarang
                                    </button>
                                </form>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
};

export default CatalogDetail;