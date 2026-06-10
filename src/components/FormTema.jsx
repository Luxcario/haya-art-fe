const FormTema = ({ show, onClose, formData, setFormData, onSubmit, isEdit, namaAcara }) => {
    if (!show) return null;

    // Fungsi untuk menambah baris variasi baru (ditambah field features)
    const tambahVariasi = () => {
        const newVariations = [
            ...(formData.variations || []),
            { lokasi: 'Rumahan', paket: 'Bronze', price: '', features: '' }
        ];
        setFormData({ ...formData, variations: newVariations });
    };

    const hapusVariasi = (index) => {
        const newVariations = formData.variations.filter((_, i) => i !== index);
        setFormData({ ...formData, variations: newVariations });
    };

    const updateVariasi = (index, field, value) => {
        const newVariations = [...formData.variations];
        newVariations[index][field] = value;
        setFormData({ ...formData, variations: newVariations });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all">

                <div className="bg-blue-600 p-5 flex justify-between items-center">
                    <h3 className="text-white text-lg font-bold flex items-center gap-2">
                        {isEdit ? 'Edit Tema Dekorasi' : `Tambah Tema untuk ${namaAcara}`}
                    </h3>
                    <button onClick={onClose} className="text-blue-200 hover:text-white transition text-xl font-bold">&times;</button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                    {/* Nama Tema */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Tema</label>
                        <input
                            type="text"
                            value={formData.themeName}
                            onChange={(e) => setFormData({ ...formData, themeName: e.target.value })}
                            placeholder="Misal: Rustic Gold"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50"
                        />
                    </div>

                    {/* Section Dinamis: Variasi Harga & Detail Paket */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <label className="block text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                            💰 Daftar Variasi Paket & Harga
                        </label>

                        <div className="space-y-4">
                            {formData.variations && formData.variations.map((v, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-blue-200 space-y-3 relative">
                                    {/* Tombol Hapus di Pojok Kanan Atas */}
                                    <button
                                        type="button"
                                        onClick={() => hapusVariasi(index)}
                                        className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition"
                                    >
                                        <span className="text-xs font-bold uppercase">Hapus</span>
                                    </button>

                                    {/* Baris 1: Pengaturan Dasar */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-400">Lokasi</label>
                                            <select
                                                value={v.lokasi}
                                                onChange={(e) => updateVariasi(index, 'lokasi', e.target.value)}
                                                className="w-full text-sm border-b-2 border-gray-200 focus:border-blue-500 outline-none py-1"
                                            >
                                                <option value="Rumahan">Rumahan</option>
                                                <option value="Gedung">Gedung</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-400">Nama Paket</label>
                                            <select
                                                value={v.paket}
                                                onChange={(e) => updateVariasi(index, 'paket', e.target.value)}
                                                className="w-full text-sm border-b-2 border-gray-200 focus:border-blue-500 outline-none py-1"
                                            >
                                                <option value="Bronze">Bronze</option>
                                                <option value="Silver">Silver</option>
                                                <option value="Gold">Gold</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-400">Harga (Rp)</label>
                                            <input
                                                type="number"
                                                value={v.price}
                                                onChange={(e) => updateVariasi(index, 'price', e.target.value)}
                                                placeholder="Contoh: 5000000"
                                                required
                                                className="w-full text-sm border-b-2 border-gray-200 focus:border-blue-500 outline-none py-1 font-semibold text-blue-600"
                                            />
                                        </div>
                                    </div>

                                    {/* Baris 2: Detail Isi Paket (Features) */}
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                                            📋 Detail Fasilitas Paket {v.paket} ({v.lokasi})
                                        </label>
                                        <textarea
                                            value={v.features || ''}
                                            onChange={(e) => updateVariasi(index, 'features', e.target.value)}
                                            placeholder="Tulis apa saja yang didapat user di paket ini (Contoh: Tenda 4x6, Kursi 50, Cooling Fan 1...)"
                                            rows="2"
                                            className="w-full text-xs border border-gray-100 rounded p-2 focus:ring-1 focus:ring-blue-400 outline-none transition bg-gray-50 resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={tambahVariasi}
                            className="mt-4 w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-bold shadow-sm"
                        >
                            + Tambah Variasi Paket Lainnya
                        </button>
                    </div>

                    {/* Deskripsi Utama */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Singkat Tema</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            rows="3"
                            placeholder="Ceritakan gambaran umum tema dekorasi ini..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50 resize-none"
                        ></textarea>
                    </div>

                    {/* Fasilitas Umum */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Fasilitas Dasar (Pasti Ada di Semua Paket)</label>
                        <textarea
                            value={formData.fasilitas}
                            onChange={(e) => setFormData({ ...formData, fasilitas: e.target.value })}
                            rows="2"
                            placeholder="Misal: Meja Akad, Karpet, Lighting Dasar"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50 resize-none"
                        ></textarea>
                    </div>

                    {/* Opsi Tambahan */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-gray-400 italic text-[10px]">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 not-italic">Opsi Make-up</label>
                            <textarea
                                value={formData.opsiMakeup}
                                onChange={(e) => setFormData({ ...formData, opsiMakeup: e.target.value })}
                                rows="2"
                                placeholder="Wardah (+1.5Jt), dll"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50 resize-none not-italic text-sm"
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 not-italic">Opsi Hiburan</label>
                            <textarea
                                value={formData.opsiHiburan}
                                onChange={(e) => setFormData({ ...formData, opsiHiburan: e.target.value })}
                                rows="2"
                                placeholder="Hadroh (+800Rb), dll"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50 resize-none not-italic text-sm"
                            ></textarea>
                        </div>
                    </div>

                    {/* Upload Foto */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Foto Tema</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => setFormData({ ...formData, images: e.target.files })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition cursor-pointer"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100 sticky bottom-0 bg-white pb-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-1/3 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="w-2/3 bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg active:scale-95"
                        >
                            {isEdit ? '💾 Simpan Perubahan' : '🚀 Simpan Tema & Paket'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default FormTema;