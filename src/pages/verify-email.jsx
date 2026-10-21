import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Ambil variabel environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Inisialisasi aman (hanya jika URL tersedia)
const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const VerifyEmail = () => {
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Cek jika Supabase client gagal terinisialisasi
        if (!supabase) {
            setStatus('error');
            setErrorMessage('Konfigurasi Supabase belum terpasang di Vercel Environment Variables.');
            return;
        }

        let authListenerSubscription = null;

        const handleEmailVerification = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) throw error;

                if (session) {
                    setStatus('success');
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
                        if (event === 'SIGNED_IN' || session) {
                            setStatus('success');
                            setTimeout(() => {
                                navigate('/login');
                            }, 3000);
                        }
                    });

                    authListenerSubscription = authListener.subscription;
                }
            } catch (err) {
                setStatus('error');
                setErrorMessage(err.message || 'Token verifikasi tidak valid atau telah kadaluwarsa.');
            }
        };

        handleEmailVerification();

        return () => {
            if (authListenerSubscription) {
                authListenerSubscription.unsubscribe();
            }
        };
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
                        <p className="text-gray-600 text-sm mb-4">Akun Haya Art Anda sudah aktif. Anda akan diarahkan ke halaman login...</p>
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