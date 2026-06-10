import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FormAcara from '../../components/FormAcara';
import FormTema from '../../components/FormTema';
import { useAdminCatalog } from '../../hooks/useAdminCatalog';

const AdminCatalog = () => {
    const navigate = useNavigate();

    const {
        dataAcara, loading,
        createAcara, removeAcara,
        createTema, updateTema, removeTema
    } = useAdminCatalog();

    // STATE UNTUK UI (Tampilan)
    const [acaraAktif, setAcaraAktif] = useState(null);
    const [showFormAcara, setShowFormAcara] = useState(false);
    const [formAcara, setFormAcara] = useState({ name: '', image: null });
    const [showFormTema, setShowFormTema] = useState(false);
    const [editTemaId, setEditTemaId] = useState(null);
    const initialFormTema = {
        themeName: '', description: '', images: null, fasilitas: '', opsiMakeup: '', opsiHiburan: '', variations: [{
            lokasi: 'Rumahan', paket: 'Bronze', price: '', features: ''
        }]
    };

    const [formTema, setFormTema] = useState(initialFormTema);

    useEffect(() => {
        if (acaraAktif && dataAcara.length > 0) {
            const updatedAcara = dataAcara.find(a => a.id === acaraAktif.id);
            if (updatedAcara) setAcaraAktif(updatedAcara);
        }
    }, [dataAcara, acaraAktif]);

    // Handler acara
    const handleSimpanAcara = async (e) => {
        e.preventDefault();
        try {
            await createAcara(formAcara);
            alert("Acara berhasil ditambahkan!");
            setShowFormAcara(false);
        } catch (error) {
            alert("Gagal menyimpan acara!");
        }
    };

    const handleHapusAcara = async (id) => {
        if (!window.confirm("FORCE DELETE: Yakin ingin menghapus acara ini beserta isinya?")) return;
        try {
            await removeAcara(id);
            setAcaraAktif(null);
        } catch (error) {
            alert("Gagal menghapus acara.");
        }
    };

    // Handler Tema
    const handleBukaFormTema = (tema = null) => {
        if (tema) {
            setEditTemaId(tema.id);
            setFormTema({
                themeName: tema.themeName, description: tema.description, images: null, fasilitas: tema.fasilitas,
                opsiMakeup: tema.opsiMakeup, opsiHiburan: tema.opsiHiburan, variations: tema.prices.map(p => ({
                    lokasi: p.lokasi, paket: p.paket, price: p.price, features: p.features || ''
                }))
            });
        } else {
            setEditTemaId(null);
            setFormTema(initialFormTema);
        }
        setShowFormTema(true);
    };

    const handleSimpanTema = async (e) => {
        e.preventDefault();

        if (!acaraAktif?.id) {
            alert("Pilih kategori acara terlebih dahulu!");
            return;
        }

        if (!formTema.variations || formTema.variations.length === 0) {
            alert("Minimal harus ada satu variasi harga!");
            return;
        }

        const isAnyEmpty = formTema.variations.some(v => v.price === '' || v.price === null);
        if (isAnyEmpty) {
            alert("Semua nominal harga variasi harus diisi!");
            return;
        }

        try {
            const rawPayload = { ...formTema, categoryId: acaraAktif.id };

            delete rawPayload.price;
            delete rawPayload.lokasi;

            const payload = {
                ...rawPayload,
                variations: JSON.stringify(formTema.variations)
            };

            if (editTemaId) {
                await updateTema(editTemaId, payload);
                alert("Tema & Paket berhasil diperbarui!");
            } else {
                await createTema(payload);
                alert("Tema & Paket baru berhasil ditambahkan!");
            }

            setShowFormTema(false);
        } catch (error) {
            console.error("Detail Error Simpan:", error.response?.data || error);
            const pesanError = error.response?.data?.message || "Pastikan semua input benar.";
            alert(`❌ Gagal menyimpan tema! ${pesanError}`);
        }
    };

    const handleHapusTema = async (id) => {
        if (!window.confirm("Yakin ingin menghapus tema ini?")) return;
        try {
            await removeTema(id);
        } catch (error) {
            alert("Gagal menghapus.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden relative">

                {/* HEADER */}
                <div className="bg-gray-800 p-6 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {acaraAktif ? `Tema Acara: ${acaraAktif.name}` : 'Kelola Katalog Acara'}
                        </h1>
                        <div className="text-sm text-gray-400 mt-2 flex gap-4">
                            {acaraAktif ? (
                                <button onClick={() => setAcaraAktif(null)} className="hover:text-white transition">← Kembali ke Daftar Acara</button>
                            ) : (
                                <Link to="/admin" className="hover:text-white transition">← Kembali ke Dashboard</Link>
                            )}
                        </div>
                    </div>

                    {!acaraAktif ? (
                        <button onClick={() => { setFormAcara({ name: '', image: null }); setShowFormAcara(true); }} className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded text-sm font-bold transition shadow-md">
                            + Tambah Acara Baru
                        </button>
                    ) : (
                        <button onClick={() => handleBukaFormTema()} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-bold transition shadow-md">
                            + Tambah Tema Dekorasi
                        </button>
                    )}
                </div>

                {!acaraAktif && (
                    <div className="p-6 overflow-x-auto">
                        {loading ? <p className="text-center text-gray-500 my-10">Memuat data...</p> :
                            dataAcara.length === 0 ? <p className="text-center text-gray-500 my-10">Belum ada acara.</p> : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-700 border-b-2 border-gray-200">
                                            <th className="p-4 font-semibold w-24">Cover</th>
                                            <th className="p-4 font-semibold">Nama Acara</th>
                                            <th className="p-4 font-semibold text-center">Jumlah Tema</th>
                                            <th className="p-4 font-semibold text-center w-64">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataAcara.map((acara) => (
                                            <tr key={acara.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="p-4">
                                                    {acara.imageUrl ? <img src={acara.imageUrl} alt="acara" className="w-16 h-16 object-cover rounded shadow-sm" /> : <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Pic</div>}
                                                </td>
                                                <td className="p-4 font-bold text-gray-800 text-lg">{acara.name}</td>
                                                <td className="p-4 text-center font-bold text-amber-600">{acara.catalogs?.length || 0} Tema</td>
                                                <td className="p-4 flex gap-2 justify-center">
                                                    <button onClick={() => setAcaraAktif(acara)} className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-900 font-medium w-full">⚙️ Kelola Tema</button>
                                                    <button onClick={() => handleHapusAcara(acara.id)} className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 font-bold">X</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                    </div>
                )}

                {acaraAktif && (
                    <div className="p-6 overflow-x-auto bg-amber-50 min-h-[400px]">
                        {acaraAktif.catalogs.length === 0 ? (
                            <p className="text-center text-gray-500 my-10">Belum ada tema untuk {acaraAktif.name}.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {acaraAktif.catalogs.map((tema) => (
                                    <div key={tema.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                                        <div className="h-40 bg-gray-200">
                                            {tema.imageUrl ? <img src={tema.imageUrl} alt="tema" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Tanpa Foto</div>}
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-bold text-lg text-gray-800">{tema.themeName}</h4>
                                            <p className="text-amber-600 font-bold mb-2">
                                                {tema.prices && tema.prices.length > 0 ? `Rp ${Math.min(...tema.prices.map(p => p.price)).toLocaleString('id-ID')}` : 'Harga belum diatur'}
                                            </p>
                                            <p className="text-gray-600 text-sm line-clamp-2 mb-4">{tema.description}</p>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleBukaFormTema(tema)} className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded text-sm hover:bg-blue-100 w-1/2">Edit</button>
                                                <button onClick={() => handleHapusTema(tema.id)} className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded text-sm hover:bg-red-100 w-1/2">Hapus</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <FormAcara
                    show={showFormAcara}
                    onClose={() => setShowFormAcara(false)}
                    formData={formAcara}
                    setFormData={setFormAcara}
                    onSubmit={handleSimpanAcara}
                />

                <FormTema
                    show={showFormTema}
                    onClose={() => setShowFormTema(false)}
                    formData={formTema}
                    setFormData={setFormTema}
                    onSubmit={handleSimpanTema}
                    isEdit={!!editTemaId}
                    namaAcara={acaraAktif?.name}
                />

            </div>
        </div>
    );
};

export default AdminCatalog;