import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Import FaStar diganti dengan Star dari lucide-react, karena react-icons/fa tidak tersedia di lingkungan ini.
import { Loader2, AlertTriangle, Star } from 'lucide-react';

// Mengganti import file lokal (../../assets/...) dengan URL placeholder yang relevan.
import BG_PLACEHOLDER from '../../assets/ayam-kampung-bakar-kecap.jpeg';

const API_URL = import.meta.env.VITE_API_URL + "/reviewshome";

const KataMereka = () => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fungsi untuk mengambil dan memproses data ulasan
    const fetchReviews = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL);
            const rawReviews = response.data.Products || [];

            if (!Array.isArray(rawReviews)) {
                setReviews([]);
                return;
            }

            // 1. Sortir: Rating tertinggi duluan (dari 5 ke 1)
            // 2. Ambil 3 ulasan teratas
            const sortedReviews = rawReviews
                .sort((a, b) => {
                    const ratingA = parseInt(a.product_rating, 10);
                    const ratingB = parseInt(b.product_rating, 10);
                    // Urutan menurun (ratingB - ratingA)
                    return ratingB - ratingA;
                })
                .slice(0, 3); // BATASAN: Hanya mengambil 3 ulasan teratas

            setReviews(sortedReviews);
        } catch (err) {
            console.error("Gagal mengambil ulasan:", err);
            // Menampilkan pesan error yang lebih user-friendly
            setError("Gagal memuat ulasan. Pastikan server lokal (127.0.0.1:8000) sudah berjalan.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // --- RENDER UTAMA ---
    return (
        <section className="w-full bg-orange-50">



            {/* 2. BAGIAN CONTENT (Background Gambar) */}
            <div
                className="relative w-full py-10 px-4 flex flex-col items-center gap-6 min-h-[500px]"
                style={{
                    // Menggunakan URL placeholder yang sudah didefinisikan di atas
                    backgroundImage: `url(${BG_PLACEHOLDER})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                {/* Overlay Gelap/Oranye di atas gambar background agar tulisan terbaca */}
                <div className="absolute inset-0 bg-orange-900/60 backdrop-blur-[1px]"></div>

                {/* --- KONDISI LOADING, ERROR, & KOSONG --- */}

                {/* 2.1 Loading State */}
                {isLoading && (
                    <div className="relative z-10 w-full max-w-2xl p-8 md:p-10 text-center bg-black/40 backdrop-blur-sm text-white rounded-[3rem] shadow-xl">
                        <Loader2 className="animate-spin mx-auto text-orange-400 mb-3" size={32} />
                        <p>Memuat ulasan terbaik...</p>
                    </div>
                )}

                {/* 2.2 Error State */}
                {error && !isLoading && (
                    <div className="relative z-10 w-full max-w-2xl p-8 md:p-10 text-center bg-red-800/80 backdrop-blur-sm text-white rounded-[3rem] shadow-xl border border-red-500">
                        <AlertTriangle className="mx-auto text-red-300 mb-3" size={32} />
                        <p className="font-bold mb-2">Terjadi Kesalahan</p>
                        <p className="text-sm opacity-80">{error}</p>
                    </div>
                )}

                {/* 2.3 Review Grid (Hanya render jika tidak loading dan tidak error) */}
                {!isLoading && !error && reviews.length > 0 && (
                    <>
                        {/* 3. LOOPING KARTU */}
                        {reviews.map((review, index) => {
                            // Mengambil data dari API
                            const username = review.user?.name || 'Anonim';
                            const text = review.review || 'Ulasan tidak tersedia.';
                            const rating = parseInt(review.product_rating, 10) || 0; // Pastikan rating adalah integer

                            // Logika Selang-seling (Ganjil vs Genap)
                            // Index 0 (Genap), Index 1 (Ganjil), Index 2 (Genap)
                            const isSolid = index % 2 !== 0; // Jika index ganjil (kartu kedua), warnanya solid

                            return (
                                <div
                                    key={review.id}
                                    className={`
                                        relative z-10 w-full max-w-2xl p-8 md:p-10 text-center
                                        flex flex-col items-center justify-center
                                        rounded-[3rem] md:rounded-[4rem] shadow-xl
                                        transform transition hover:scale-[1.03] duration-300
                                        ${isSolid
                                            ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-orange-900" // Style Kartu Tengah (Solid)
                                            : "bg-black/40 backdrop-blur-sm text-white border border-white/10" // Style Kartu Atas/Bawah (Transparan)
                                        }
                                    `}
                                >
                                    {/* Nama Pengguna */}
                                    <h3 className="text-xl md:text-2xl font-bold mb-2">{username}</h3>

                                    {/* Teks Ulasan */}
                                    <p className="mb-4 text-sm md:text-base italic opacity-90">
                                        "{text}"
                                    </p>

                                    {/* Bintang Dinamis (Menggunakan Star dari lucide-react) */}
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={i < rating
                                                    ? "text-yellow-300 drop-shadow-md fill-yellow-300" // Bintang terisi
                                                    : (isSolid ? "text-orange-900/50" : "text-gray-400")} // Bintang kosong
                                                size={24}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}

                {/* 2.4 Empty State (Jika data kosong, tidak loading, dan tidak error) */}
                {!isLoading && !error && reviews.length === 0 && (
                    <div className="relative z-10 w-full max-w-2xl p-8 md:p-10 text-center bg-black/40 backdrop-blur-sm text-white rounded-[3rem] shadow-xl">
                        <AlertTriangle className="mx-auto text-orange-400 mb-3" size={32} />
                        <p>Belum ada ulasan yang ditampilkan saat ini.</p>
                    </div>
                )}

            </div>
        </section>
    );
};

export default KataMereka;