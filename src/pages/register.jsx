import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axions from 'axios';


// Gunakan gambar yang sama atau beda dengan login, bebas.
// Untuk preview saya pakai placeholder. Di laptop, ganti dengan import gambar lokalmu.
import registerImage from "../assets/ayam-kampung-bakar-kecap.jpeg";
const API_BASE = import.meta.env.VITE_API_URL
const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validasi Sederhana
        if (formData.password !== formData.confirmPassword) {
            alert("Password tidak sama!");
            return;
        }

        const postData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            address: formData.address,
            phone_number: formData.phone_number,
        }

        const res = await axions.post(`${API_BASE}/register`, postData);

        if (res.status == 200) {
            navigate('/login'); // Arahkan ke halaman login
        } else {
            alert("Registrasi Gagal!");
        }
    };

    return (
        <div className="flex min-h-screen bg-orange-50 font-sans">

            {/* Bagian Kiri (Form Register) - Dibalik posisinya biar beda dikit sama Login */}
            <div className="w-full md:w-1/2 flex justify-center items-center p-8 order-2 md:order-1">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-orange-100">
                    <h2 className="text-3xl font-black text-orange-800 mb-2 text-center uppercase tracking-wider">
                        Buat Akun
                    </h2>
                    <p className="text-gray-500 mb-6 text-center text-sm">Bergabunglah dan nikmati kuliner terbaik Bogor!</p>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                            <input
                                type="text" id="name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50"
                                placeholder="Contoh: Budi Santoso"
                                value={formData.name} onChange={handleChange} required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                            <input
                                type="email" id="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50"
                                placeholder="nama@email.com"
                                value={formData.email} onChange={handleChange} required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                                <input
                                    type="password" id="password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50"
                                    placeholder="******"
                                    value={formData.password} onChange={handleChange} required
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-1">Ulangi Password</label>
                                <input
                                    type="password" id="confirmPassword"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50"
                                    placeholder="******"
                                    value={formData.confirmPassword} onChange={handleChange} required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">alamat</label>
                            <input
                                type="text" id="address"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50"
                                placeholder="alamat lengkap"
                                value={formData.address} onChange={handleChange} required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">nomer hp</label>
                            <input
                                type="text" id="phone_number"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50"
                                placeholder="08952243445"
                                value={formData.phone_number} onChange={handleChange} required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 rounded-lg shadow-md text-lg font-bold text-white bg-orange-600 hover:bg-orange-700 transition-all transform hover:-translate-y-1 mt-4"
                        >
                            DAFTAR SEKARANG
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        <p>Sudah punya akun? <Link to="/login" className="font-bold text-orange-600 hover:underline">Login disini</Link></p>
                    </div>
                </div>
            </div>

            {/* Bagian Kanan (Gambar) */}
            <div className="hidden md:flex w-1/2 bg-orange-100 justify-center items-center relative overflow-hidden order-1 md:order-2">
                <div className="absolute inset-0 bg-orange-900/20 z-10"></div>
                <img
                    src={registerImage}
                    alt="Register Ayam Kabogor"
                    className="object-cover w-full "
                />

            </div>

        </div>
    );
};

export default RegisterPage;