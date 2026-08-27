import React from 'react';
import { LayoutDashboard, Coffee, ShoppingBag, Star, Users, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import logo from "../../assets/logo-ayamkabogor.png";

export default function AdminSidebar({ isSidebarOpen, setIsSidebarOpen, activeTab, setActiveTab }) {
    const navigate = useNavigate();

    // Fungsi Logout Internal
    const handleLogout = () => {
        if (window.confirm('Yakin ingin keluar dari Panel Admin?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    // Daftar Menu Navigasi
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'menu', label: 'Manajemen Menu', icon: Coffee },
        { id: 'orders', label: 'Pesanan Masuk', icon: ShoppingBag },
        { id: 'reviews', label: 'Ulasan', icon: Star },
        { id: 'customers', label: 'Pelanggan', icon: Users },
    ];

    return (
        <>
            {/* Overlay Gelap untuk Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Container Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-30
                w-64 bg-orange-500 md:w-50 border-r border-gray-200 
                transform transition-transform duration-300 ease-in-out
                flex flex-col
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Header Sidebar */}
                <div className="h-16 flex items-center justify-center px-6 ">
                    <img src={logo} alt="Logo Ayam Kabogor" className="h-10 object-contain" />
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden text-white-500 hover:text-red-500"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* List Menu */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);

                                }}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                                    ${isActive
                                        ? 'bg-orange-50 text-orange-600'
                                        : 'text-gray-100 hover:bg-gray-50 hover:text-gray-600'}
                                `}
                            >
                                <Icon size={20} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Tombol Logout di Bawah */}
                <div className="p-4   bg-orange-500">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm  font-medium  text-red-700 hover:bg-red-100 transition-colors"
                    >
                        <LogOut size={20} />
                        Keluar
                    </button>
                </div>
            </aside>
        </>
    );
}