import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Menu, X, User, History, LogOut, ShoppingCart } from 'lucide-react';
import axios from 'axios';

// ✅ LANGKAH 1: Import useCart yang ASLI dari context
// Pastikan path '../contexts/CartContext' sesuai dengan struktur foldermu
import { useCart } from '../contexts/CartContext';

import logo from "../assets/logo-ayamkabogor.png";

// ❌ LANGKAH 2: Kode "Simulasi useCart" (Mock Data) SUDAH DIHAPUS di sini.
// Sekarang Navbar akan menggunakan useCart yang di-import di atas.

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');

    // ✅ LANGKAH 3: Panggil fungsi asli
    // Karena mock data sudah dihapus, getTotalItems() sekarang mengambil data real dari CartContext
    const { getTotalItems } = useCart();
    const totalItems = getTotalItems();

    const isAdminPage = location.pathname.startsWith('/admin');

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setIsLoggedIn(false);
                return;
            }

            try {
                const response = await axios.get(import.meta.env.VITE_API_URL + "/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setIsLoggedIn(true);
                const userData = response.data;

                if (userData && userData.name) {
                    setUserName(userData.name);
                } else {
                    setUserName('Pelanggan');
                }

            } catch (error) {
                console.error("Gagal mengambil profil:", error);
                setIsLoggedIn(false);
                setUserName('');
            }
        };

        fetchUserProfile();
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

    const handleLogout = () => {
        if (window.confirm('Yakin ingin keluar dari akun?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsLoggedIn(false);
            setUserName('');
            setIsProfileOpen(false);
            navigate('/');
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50">

            {/* OVERLAY */}
            {(isOpen || isProfileOpen) && (
                <div
                    className="fixed inset-0 w-full h-full bg-black/10 backdrop-blur-[1px] z-0"
                    onClick={() => { setIsOpen(false); setIsProfileOpen(false); }}
                />
            )}

            {!isAdminPage && (
                <nav className="container mx-auto relative p-2 h-14 flex items-center justify-end">

                    {/* BAR ORANYE TENGAH */}
                    <div className="w-11/12 sm:w-9/12 md:w-7/12 lg:w-4/12 xl:max-w-lg 2xl:max-w-2xl px-2 justify-center rounded top-1/2 -translate-y-1/2 bg-gradient-to-b from-orange-600 to-orange-400 text-white font-bold shadow-lg absolute left-1/2 -translate-x-1/2 z-20">
                        <div className="flex items-center justify-between">

                            {/* Tombol Menu */}
                            <button
                                onClick={toggleMenu}
                                className="flex items-center space-x-2 px-3 py-1 rounded-md hover:bg-black/10 transition-all"
                                aria-label="Toggle Menu"
                            >
                                {isOpen ? <X size={22} /> : <Menu size={22} />}
                                <span className="text-xs tracking-wider uppercase">Menu</span>
                            </button>

                            {/* Logo */}
                            <div>
                                <Link to="/">
                                    <img src={logo} alt="Logo Ayam Kabogor" className="h-10 object-contain" />
                                </Link>
                            </div>

                            {/* Area Kanan */}
                            <div className="flex items-center gap-2">

                                {/* ✅ ICON KERANJANG (Counter akan otomatis berubah) */}
                                {isLoggedIn && (
                                    <Link
                                        to="/keranjang"
                                        className="relative p-1 rounded-full hover:bg-black/10 transition-all"
                                        aria-label="Keranjang Belanja"
                                    >
                                        <ShoppingCart size={24} />

                                        {/* Logika Tampilan Notifikasi */}
                                        {totalItems > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                                                {totalItems > 99 ? '99+' : totalItems}
                                            </span>
                                        )}
                                    </Link>
                                )}

                                {/* Fitur Profile */}
                                {isLoggedIn ? (
                                    <div className="relative">
                                        <button
                                            onClick={toggleProfile}
                                            className="flex items-center justify-center p-1 rounded-full hover:bg-black/10 transition-all focus:outline-none"
                                        >
                                            <User size={24} className="text-yellow-200" />
                                        </button>

                                        {/* Dropdown Menu Profile */}
                                        {isProfileOpen && (
                                            <div className="absolute top-full right-0 mt-3 w-48 bg-white rounded-xl shadow-xl text-gray-800 py-2 border border-orange-100 animate-in fade-in slide-in-from-top-2 z-50">

                                                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                                    <p className="text-xs text-gray-400">Halo,</p>
                                                    <p className="font-bold text-orange-600 truncate">{userName}</p>
                                                </div>

                                                <Link
                                                    to="/profile"
                                                    className="flex items-center px-4 py-2 hover:bg-orange-50 text-sm gap-3 transition-colors"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    <User className="text-gray-400" size={14} />
                                                    Profile Saya
                                                </Link>

                                                <Link
                                                    to="/riwayat-pesanan"
                                                    className="flex items-center px-4 py-2 hover:bg-orange-50 text-sm gap-3 transition-colors"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    <History className="text-gray-400" size={14} />
                                                    Riwayat Order
                                                </Link>

                                                <div className="border-t border-gray-100 my-1"></div>

                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center px-4 py-2 hover:bg-red-50 text-red-600 text-sm gap-3 text-left transition-colors"
                                                >
                                                    <LogOut size={14} />
                                                    Keluar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="text-[10px] sm:text-xs bg-white text-orange-600 px-3 py-1 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-sm"
                                    >
                                        LOGIN
                                    </Link>
                                )}

                            </div>
                        </div>
                    </div>

                    {/* TOMBOL PESAN (DESKTOP) */}
                    <div className='container mx-auto flex justify-end items-center h-14'>
                        <a
                            href="https://wa.me/628123456789"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden lg:inline-block bg-gradient-to-b from-orange-600 to-orange-800 hover:from-orange-700 text-white font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-full shadow-md transition-all"
                        >
                            Pesan Sekarang!
                        </a>
                    </div>

                </nav>
            )}

            {/* MENU DROPDOWN MOBILE */}
            <div
                className={`
                    absolute w-11/12 sm:w-9/12 md:w-7/12 lg:w-4/12 xl:max-w-lg 2xl:max-w-2xl max-w-6xl left-1/2 -translate-x-1/2 bg-gradient-to-b from-orange-400 to-orange-500 shadow-lg 
                    text-white font-bold p-6 transition-all duration-300 ease-in-out rounded
                    ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}
                `}
            >
                <ul className="flex flex-col items-center text-center space-y-4 tracking-wider">
                    <li><Link to="/" onClick={toggleMenu} className="block py-3 px-6 border-b border-white/30 w-60 hover:bg-black/10 rounded-md">01 HOME</Link></li>
                    <li><Link to="/about" onClick={toggleMenu} className="block py-3 px-6 border-b border-white/30 w-60 hover:bg-black/10 rounded-md">02 ABOUT US</Link></li>
                    <li><Link to="/menu-lengkap" onClick={toggleMenu} className="block py-3 px-6 border-b border-white/30 w-60 hover:bg-black/10 rounded-md">03 PRICELIST & MENU</Link></li>
                    <li><Link to="/ulasan" onClick={toggleMenu} className="block py-3 px-6 border-b border-white/30 w-60 hover:bg-black/10 rounded-md">04 ULASAN</Link></li>
                    <li><Link to="/FAQ" onClick={toggleMenu} className="block py-3 px-6 w-60 hover:bg-black/10 rounded-md">05 FAQ</Link></li>
                </ul>

                {!isAdminPage && (
                    <a
                        href="https://wa.me/628123456789"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full max-w-xs mx-auto text-center mt-8 py-3 bg-orange-700 hover:bg-orange-800 rounded-lg tracking-wider transition-all"
                    >
                        ORDER NOW!
                    </a>
                )}
            </div>

        </header>
    );
}

export default Navbar;