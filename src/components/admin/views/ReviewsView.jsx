import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, AlertCircle, Trash2, Loader, Star, Filter, Eye, EyeOff } from "lucide-react";

export default function ReviewsView() {
    // --- STATE ---
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // --- FETCH DATA ---
    const fetchReviews = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(import.meta.env.VITE_API_URL + "/reviews", {
                headers: { Authorization: `Bearer ${token}` },
                params: { status: filterStatus }
            });

            const data = response.data.Products || [];
            setReviews(data);

        } catch (error) {
            console.error("Gagal mengambil ulasan:", error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [filterStatus]);

    // --- HANDLE TOGGLE STATUS (PATCH) ---
    const handleToggleStatus = async (id, currentState) => {
        const token = localStorage.getItem('token');
        // Tentukan status baru (kebalikan dari status sekarang)
        const newState = currentState === 'show' ? 'hide' : 'show';

        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/reviews/${id}`,
                { state: newState }, // Payload
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Refresh data setelah sukses
            fetchReviews();

        } catch (error) {
            console.error("Gagal mengubah status:", error);
            alert("Gagal mengubah status ulasan.");
        }
    };

    // --- HANDLE DELETE ---
    const handleDeleteReview = async (id) => {
        if (!window.confirm("Yakin ingin menghapus ulasan ini secara permanen?")) return;

        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/reviews/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Ulasan berhasil dihapus.");
            fetchReviews();

        } catch (error) {
            console.error("Gagal menghapus ulasan:", error);
            alert("Gagal menghapus ulasan.");
        }
    };

    // --- HELPER ---
    const filteredReviews = reviews.filter(r =>
        (r.product || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.review || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + parseFloat(r.product_rating), 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="space-y-6">
            {/* Header & Filter */}
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Ulasan Pelanggan ({filteredReviews.length})
                    </h2>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                        Rating Rata-rata:
                        <span className="font-bold text-orange-500 flex items-center bg-orange-50 px-2 rounded border border-orange-100">
                            {averageRating} <Star size={12} className="fill-orange-500 ml-1" />
                        </span>
                    </p>
                </div>

                {/* Dropdown Filter Status */}
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-gray-500" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white cursor-pointer"
                    >
                        <option value="all">Semua Status</option>
                        <option value="show">Show (Tampil)</option>
                        <option value="hide">Hide (Sembunyi)</option>
                    </select>
                </div>
            </div>

            {/* Tabel Data */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari ulasan berdasarkan produk atau isi..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-gray-600 min-w-[700px]">
                        <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3 text-left">Produk</th>
                                <th className="px-6 py-3 text-left">Rating</th>
                                <th className="px-6 py-3 text-left w-1/3">Ulasan</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Tanggal</th>
                                <th className="px-6 py-3 text-center w-32">Aksi</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-10">
                                        <div className="flex flex-col items-center text-gray-500">
                                            <Loader className="animate-spin text-orange-500 mb-2" size={24} />
                                            Memuat ulasan...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredReviews.length > 0 ? (
                                filteredReviews.map(review => (
                                    <tr key={review.id} className="hover:bg-orange-50/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {review.product || "Produk Umum"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-orange-500">
                                                <span className="font-bold mr-1">{review.product_rating}</span>
                                                <Star size={14} className="fill-orange-500" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="line-clamp-2 text-gray-600 italic">"{review.review}"</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${review.state === 'show'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {review.state}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500">
                                            {new Date(review.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">

                                                {/* TOMBOL TOGGLE STATUS */}
                                                <button
                                                    onClick={() => handleToggleStatus(review.id, review.state)}
                                                    className={`p-2 rounded-lg transition border border-transparent ${review.state === 'show'
                                                            ? 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                                                            : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                                                        }`}
                                                    title={review.state === 'show' ? "Sembunyikan Ulasan" : "Tampilkan Ulasan"}
                                                >
                                                    {review.state === 'show' ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>

                                                {/* TOMBOL HAPUS */}
                                                <button
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-200"
                                                    onClick={() => handleDeleteReview(review.id)}
                                                    title="Hapus Ulasan"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <AlertCircle size={32} className="mb-2 text-gray-300" />
                                            Tidak ada ulasan ditemukan
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}   