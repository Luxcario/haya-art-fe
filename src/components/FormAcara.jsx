const FormAcara = ({ show, onClose, formData, setFormData, onSubmit }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">

                {/* Header Form */}
                <div className="bg-gray-900 p-5 flex justify-between items-center">
                    <h3 className="text-white text-lg font-bold flex items-center gap-2">
                        Tambah Acara (Kategori)
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition text-xl font-bold">&times;</button>
                </div>

                {/* Body Form */}
                <form onSubmit={onSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Acara</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Misal: Pernikahan, Ulang Tahun"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-gray-50"
                        />
                    </div>

                    {/* 👇 INI BAGIAN YANG SUDAH BERUBAH JADI UPLOAD FILE 👇 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Foto Cover (Opsional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 transition cursor-pointer"
                        />
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-1/3 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="w-2/3 bg-amber-600 text-white py-2.5 rounded-lg font-bold hover:bg-amber-700 transition shadow-md"
                        >
                            Simpan Acara
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default FormAcara;