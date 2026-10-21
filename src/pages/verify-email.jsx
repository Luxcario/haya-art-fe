import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase Client
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const VerifyEmail = () => {
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Supabase otomatis menangani token dari URL hash (#access_token=...) saat komponen dimuat
        const handleEmailVerification = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) throw error;

                if (session) {
                    setStatus('success');
                    // Redirect otomatis ke halaman login setelah 3 detik
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    // Jika tidak ada sesi otomatis, dengarkan perubahan Auth State
                    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
                        if (event === 'SIGNED_IN' || session) {
                            setStatus('success');
                            setTimeout(() => {
                                navigate('/login');
                            }, 3000);
                        }
                    });

                    return () => {
                        authListener.subscription.unsubscribe();
                    };
                }
            } catch (err) {
                setStatus('error');
                setErrorMessage(err.message || 'Token verifikasi tidak valid atau telah kadaluwarsa.');
            }
        };

        handleEmailVerification();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                {status === 'verifying' && (
                    <div>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Memverifikasi Email...</h2>
                        <p className="text-gray-600 text-sm">Mohon tunggu sebentar, kami sedang mengonfirmasi akun Anda.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div>
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                            ✓
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Email Berhasil Diverifikasi!</h2>
                        <p className="text-gray-600 text-sm mb-4">Akun Haya Art Anda sudah aktif. Anda akan diarahakan ke halaman login...</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                        >
                            Login Sekarang
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div>
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                            ✕
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Verifikasi Gagal</h2>
                        <p className="text-gray-600 text-sm mb-4">{errorMessage}</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg transition"
                        >
                            Kembali ke Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;