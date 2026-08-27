import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, LogIn, Loader } from 'lucide-react';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;
const LOGIN_URL = `${API_BASE_URL}/login`;

// Placeholder image
import loginImage from '../assets/ayam-kampung-bakar-kecap.jpeg';
function LoginPage() {
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // UI State
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    // Handle Login Submit
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validasi client-side
        if (!formData.email || !formData.password) {
            setError('Email dan password harus diisi');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(LOGIN_URL, {
                email: formData.email,
                password: formData.password
            }, {
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            });

            // ✅ AMBIL DATA SESUAI STRUKTUR JSON ANDA
            const data = response.data;
            const token = data.token;
            const isAdmin = data.is_admin; // Boolean (true/false)

            if (token) {
                // 1. Simpan Token
                localStorage.setItem('token', token);

                // 2. Simpan Remember Me
                if (rememberMe) {
                    localStorage.setItem('remembered_email', formData.email);
                } else {
                    localStorage.removeItem('remembered_email');
                }

                // 3. ✅ BUAT OBJEK USER UNTUK LOCALSTORAGE
                // Kita ubah boolean is_admin menjadi string 'role' 
                // agar cocok dengan logika ProtectedRoute yang sudah ada.
                const userPayload = {
                    name: 'User', // Placeholder karena login response tidak bawa nama (bisa ambil di /profile nanti)
                    role: isAdmin ? 'admin' : 'user',
                    is_admin: isAdmin
                };

                localStorage.setItem('user', JSON.stringify(userPayload));

                // 4. ✅ REDIRECT SESUAI ROLE
                if (isAdmin) {
                    // Jika Admin -> Dashboard
                    navigate('/admin-dashboard');
                } else {
                    // Jika User -> Profile (Gunakan href agar Navbar refresh state login)
                    window.location.href = '/';
                }

            } else {
                setError('Login berhasil, tetapi token tidak ditemukan.');
            }

        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message || error.response.data?.error;

                if (status === 401) setError('Email atau password salah');
                else if (status === 422) setError(message || 'Data tidak valid');
                else setError(message || 'Terjadi kesalahan saat login');
            } else if (error.request) {
                setError('Tidak dapat terhubung ke server.');
            } else {
                setError('Terjadi kesalahan: ' + error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Load remembered email & Redirect if already logged in
    React.useEffect(() => {
        const rememberedEmail = localStorage.getItem('remembered_email');
        if (rememberedEmail) {
            setFormData(prev => ({ ...prev, email: rememberedEmail }));
            setRememberMe(true);
        }

        const token = localStorage.getItem('token');
        if (token) {
            // Cek role yang tersimpan
            const userString = localStorage.getItem('user');
            if (userString) {
                const user = JSON.parse(userString);
                if (user.role === 'admin') navigate('/admin-dashboard');
                else navigate('/profile'); // Redirect ke profile jika user biasa
            }
        }
    }, [navigate]);

    return (
        <div className="flex h-screen bg-orange-50 font-sans">
            {/* Bagian Kiri (Gambar) */}
            <div className="hidden md:flex w-1/2 justify-center items-center bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/30 z-10"></div>
                <img src={loginImage} alt="Ayam Kabogor" className="object-cover w-full h-full" />
                <div className="absolute z-20 text-white text-center px-10">
                    <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Ayam Kabogor</h1>
                    <p className="text-xl font-light">Nikmati Kelezatan Autentik Khas Bogor</p>
                </div>
            </div>

            {/* Bagian Kanan (Form Login) */}
            <div className="w-full md:w-1/2 flex justify-center items-center p-8 bg-white md:bg-transparent">
                <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full text-center border border-orange-100">

                    <h2 className="text-4xl font-black text-orange-800 mb-2 italic tracking-wider">LOGIN</h2>
                    <p className="text-gray-500 mb-8 text-sm">Silakan masuk untuk melanjutkan</p>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-left animate-shake">
                            <p className="font-semibold">⚠️ {error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6 text-left">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50"
                                placeholder="contoh@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                />
                                <span className="text-gray-600">Ingat saya</span>
                            </label>
                            {/* Ganti href dengan Link jika halaman forgot password sudah ada */}
                            <span className="text-orange-600 hover:underline cursor-pointer">Lupa password?</span>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 rounded-lg shadow-md text-lg font-bold text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 focus:ring-4 focus:ring-orange-300 transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <><Loader size={20} className="animate-spin" /> Memproses...</>
                            ) : (
                                <><LogIn size={20} /> MASUK SEKARANG</>
                            )}
                        </button>
                    </form>

                    <div className="mt-4 text-sm text-gray-600">
                        <p>Belum punya akun? <a href="/register" className="font-bold text-orange-600 hover:underline">Daftar Disini</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;