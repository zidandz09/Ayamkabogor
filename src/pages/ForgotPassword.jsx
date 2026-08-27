import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
const FORGOT_PASSWORD_URL = `${API_BASE_URL}/forgot-password`;
const RESET_PASSWORD_URL = `${API_BASE_URL}/reset-password`;

function ForgotPasswordPage() {
    const navigate = useNavigate();

    // State
    const [step, setStep] = useState('email'); // 'email' | 'code' | 'newPassword' | 'success'
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Step 1: Request Reset Code
    const handleRequestReset = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validasi email
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Format email tidak valid');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(FORGOT_PASSWORD_URL, {
                email: email
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            setSuccessMessage('Kode reset password telah dikirim ke email Anda!');
            setStep('code');

        } catch (error) {
            console.error('Forgot password error:', error);

            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message;

                if (status === 404) {
                    setError('Email tidak terdaftar');
                } else if (status === 429) {
                    setError('Terlalu banyak percobaan. Coba lagi nanti.');
                } else {
                    setError(message || 'Gagal mengirim kode reset');
                }
            } else if (error.request) {
                setError('Tidak dapat terhubung ke server');
            } else {
                setError('Terjadi kesalahan: ' + error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify Code (Optional - bisa langsung ke step 3)
    const handleVerifyCode = (e) => {
        e.preventDefault();

        if (!resetCode || resetCode.length < 4) {
            setError('Kode reset harus diisi minimal 4 karakter');
            return;
        }

        setError('');
        setStep('newPassword');
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validasi password
        if (newPassword.length < 6) {
            setError('Password minimal 6 karakter');
            setIsLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Password tidak cocok');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(RESET_PASSWORD_URL, {
                email: email,
                token: resetCode, // atau 'code' tergantung backend
                password: newPassword,
                password_confirmation: confirmPassword
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            setSuccessMessage('Password berhasil direset!');
            setStep('success');

            // Auto redirect ke login setelah 3 detik
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error) {
            console.error('Reset password error:', error);

            if (error.response) {
                const message = error.response.data?.message;

                if (error.response.status === 400 || error.response.status === 422) {
                    setError(message || 'Kode reset tidak valid atau sudah expired');
                } else {
                    setError(message || 'Gagal reset password');
                }
            } else if (error.request) {
                setError('Tidak dapat terhubung ke server');
            } else {
                setError('Terjadi kesalahan: ' + error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-orange-100">

                {/* Back Button */}
                <button
                    onClick={() => step === 'email' ? navigate('/login') : setStep('email')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
                >
                    <ArrowLeft size={20} />
                    <span className="text-sm font-medium">Kembali</span>
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail size={32} className="text-orange-600" />
                    </div>
                    <h1 className="text-3xl font-black text-orange-800 mb-2">
                        {step === 'success' ? 'Berhasil!' : 'Lupa Password?'}
                    </h1>
                    <p className="text-gray-600 text-sm">
                        {step === 'email' && 'Masukkan email Anda untuk reset password'}
                        {step === 'code' && 'Masukkan kode yang dikirim ke email'}
                        {step === 'newPassword' && 'Buat password baru Anda'}
                        {step === 'success' && 'Password berhasil direset'}
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-shake">
                        <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {/* Success Alert */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                        <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-green-600 text-sm">{successMessage}</p>
                    </div>
                )}

                {/* Step 1: Email Form */}
                {step === 'email' && (
                    <form onSubmit={handleRequestReset} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError('');
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-gray-50"
                                placeholder="contoh@email.com"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 rounded-lg shadow-md text-lg font-bold text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 focus:ring-4 focus:ring-orange-300 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader size={20} className="animate-spin" />
                                    Mengirim...
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    Kirim Kode Reset
                                </>
                            )}
                        </button>
                    </form>
                )}

                {/* Step 2: Verify Code */}
                {step === 'code' && (
                    <form onSubmit={handleVerifyCode} className="space-y-6">
                        <div>
                            <label htmlFor="code" className="block text-sm font-bold text-gray-700 mb-2">
                                Kode Reset
                            </label>
                            <input
                                type="text"
                                id="code"
                                value={resetCode}
                                onChange={(e) => {
                                    setResetCode(e.target.value);
                                    setError('');
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-gray-50 text-center text-2xl tracking-widest font-mono"
                                placeholder="X X X X X X"
                                maxLength={6}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                Cek inbox atau folder spam email Anda
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 rounded-lg shadow-md text-lg font-bold text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                        >
                            Verifikasi Kode
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep('email')}
                            className="w-full text-sm text-gray-600 hover:text-gray-800 underline"
                        >
                            Tidak menerima kode? Kirim ulang
                        </button>
                    </form>
                )}

                {/* Step 3: New Password Form */}
                {step === 'newPassword' && (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-bold text-gray-700 mb-2">
                                Password Baru
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    setError('');
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-gray-50"
                                placeholder="Minimal 6 karakter"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-2">
                                Konfirmasi Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setError('');
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-gray-50"
                                placeholder="Ketik ulang password"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 rounded-lg shadow-md text-lg font-bold text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 focus:ring-4 focus:ring-orange-300 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader size={20} className="animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={20} />
                                    Reset Password
                                </>
                            )}
                        </button>
                    </form>
                )}

                {/* Step 4: Success */}
                {step === 'success' && (
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <CheckCircle size={40} className="text-green-600" />
                        </div>
                        <p className="text-gray-700 mb-6">
                            Password Anda berhasil direset!<br />
                            Anda akan diarahkan ke halaman login...
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="text-orange-600 hover:text-orange-800 font-bold underline"
                        >
                            Langsung ke Login
                        </button>
                    </div>
                )}

                {/* Info Box */}
                {step !== 'success' && (
                    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-700">
                            <strong>💡 Tips Keamanan:</strong><br />
                            • Gunakan password minimal 6 karakter<br />
                            • Kombinasikan huruf, angka, dan simbol<br />
                            • Jangan gunakan password yang sama dengan akun lain
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ForgotPasswordPage;