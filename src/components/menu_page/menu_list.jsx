import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, RefreshCw, Frown, UtensilsCrossed, Loader } from 'lucide-react';
import axios from 'axios';

// --- REAL IMPORTS ---
// Pastikan path ini sesuai dengan struktur folder Anda
import { useCart } from '../../contexts/CartContext';

// --- KONFIGURASI URL ---
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL = `${BASE_URL}/api/products`;
const STORAGE_URL = `${BASE_URL}/storage`;

const MenuPage = () => {
    // 1. State Data
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. State Search & Login
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 3. Gunakan Context Cart
    // Jika error "useCart is not defined", pastikan CartContext sudah dibuat dan di-wrap di App.jsx
    const { addToCart } = useCart();

    // ✅ Cek Login Status
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    // ✅ Fetch Data Produk dari API
    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL);
            const data = response.data.Products || [];

            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                setProducts([]); // Fallback jika data bukan array
            }
        } catch (err) {
            console.error("Gagal mengambil menu:", err);
            setError("Gagal memuat daftar menu. Periksa koneksi server.");
        } finally {
            setIsLoading(false);
        }
    };

    // Panggil fetch saat mount
    useEffect(() => {
        fetchProducts();
    }, []);

    // --- LOGIKA SEARCHING ---
    // Filter produk berdasarkan nama saja (Kategori sudah dihapus)
    const filteredData = products.filter(item =>
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-orange-50/30 pt-24 pb-20 px-4 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* --- HEADER SECTION --- */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-5xl font-black text-orange-800 mb-4 tracking-tight uppercase">
                        Daftar Menu
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Nikmati aneka olahan ayam dan sambal khas Bogor yang menggugah selera.
                        Pilih menu favoritmu sekarang!
                    </p>
                </div>

                {/* --- SEARCH BAR --- */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 mb-8 sticky top-20 z-30 max-w-3xl mx-auto">
                    <div className="flex gap-2 w-full">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Cari menu lezat..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all text-gray-700"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        </div>

                        <button
                            onClick={fetchProducts}
                            disabled={isLoading}
                            className="p-3 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200 transition-colors disabled:opacity-50"
                            title="Refresh Data"
                        >
                            <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>

                {/* --- CONTENT AREA --- */}

                {/* 1. Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader className="animate-spin text-orange-600 mb-4" size={40} />
                        <p className="text-gray-500 animate-pulse">Sedang menyiapkan menu terbaik...</p>
                    </div>
                )}

                {/* 2. Error State */}
                {error && !isLoading && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-lg mx-auto">
                        <Frown className="mx-auto text-red-500 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-red-700 mb-2">Oops, gagal memuat menu!</h3>
                        <p className="text-red-600 mb-4 text-sm">{error}</p>
                        <button
                            onClick={fetchProducts}
                            className="px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors"
                        >
                            Coba Lagi
                        </button>
                    </div>
                )}

                {/* 3. Empty State (Hasil pencarian 0) */}
                {!isLoading && !error && filteredData.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                            <UtensilsCrossed className="text-gray-400" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-700">Menu tidak ditemukan</h3>
                        <p className="text-gray-500">Coba cari dengan kata kunci lain.</p>
                        <button
                            onClick={() => setSearchTerm("")}
                            className="mt-4 text-orange-600 font-semibold hover:underline"
                        >
                            Reset Pencarian
                        </button>
                    </div>
                )}

                {/* 4. Product Grid */}
                {!isLoading && !error && filteredData.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filteredData.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl shadow-sm border border-orange-50 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                            >
                                {/* Image Area */}
                                <div className="relative aspect-square overflow-hidden bg-gray-100">
                                    <img
                                        // Gabungkan Base URL Storage dengan Path dari DB
                                        src={item.product_url_image
                                            ? `${STORAGE_URL}/${item.product_url_image}`
                                            : "https://placehold.co/400x400/orange/white?text=No+Image"
                                        }
                                        alt={item.product_name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            // Placeholder jika gambar error/404
                                            e.target.src = "https://placehold.co/400x400/orange/white?text=Ayam+Kabogor";
                                        }}
                                    />
                                </div>

                                {/* Content Area */}
                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1" title={item.product_name}>
                                        {item.product_name}
                                    </h3>
                                    <p className="text-gray-500 text-xs line-clamp-2 mb-4 h-8">
                                        {item.product_description}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400">Harga</span>
                                            <span className="text-lg font-black text-orange-600">
                                                Rp {parseInt(item.product_price).toLocaleString('id-ID')}
                                            </span>
                                        </div>

                                        {/* ✅ Tombol Add to Cart (Hanya jika login) */}
                                        {isLoggedIn && (
                                            <button
                                                onClick={() => {
                                                    // Mapping data agar sesuai format CartContext
                                                    addToCart({
                                                        id: item.id,
                                                        name: item.product_name,
                                                        price: parseInt(item.product_price),
                                                        image: item.product_url_image
                                                            ? `${STORAGE_URL}/${item.product_url_image}`
                                                            : null
                                                    });
                                                }}
                                                className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-orange-700 active:scale-90 transition-all"
                                                title="Tambah ke Keranjang"
                                            >
                                                <ShoppingCart size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuPage;