import React, { useState, useEffect } from "react";
import { Menu as MenuIcon } from 'lucide-react';
import axios from 'axios';

export default function AdminTopbar({ isSidebarOpen, setIsSidebarOpen }) {
    const [adminName, setAdminName] = useState('Admin');

    useEffect(() => {
        const fetchAdminProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await axios.get(import.meta.env.VITE_API_URL + "/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Ambil nama dari response.data.User.name
                if (response.data && response.data.User && response.data.User.name) {
                    setAdminName(response.data.User.name);
                }
            } catch (error) {
                console.error("Gagal mengambil profil admin:", error);
            }
        };

        fetchAdminProfile();
    }, []);

    // Ambil huruf pertama untuk avatar
    const initial = adminName ? adminName.charAt(0).toUpperCase() : 'A';

    return (
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4">
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-600 p-2 hover:bg-gray-100 rounded-md md:hidden"
            >
                <MenuIcon size={24} />
            </button>

            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 hidden sm:block">Halo, {adminName}</span>
                <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold uppercase">
                    {initial}
                </div>
            </div>
        </header>
    );
}