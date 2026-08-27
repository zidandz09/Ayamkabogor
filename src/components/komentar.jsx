import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL + "/reviewshome";

const KataMereka = () => {
    const [reviews, setReviews] = useState([]);
    const [currentTestimoni, setCurrentTestimoni] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(API_URL);
                const data = response.data.Products || [];

                if (Array.isArray(data) && data.length > 0) {
                    // 1. Sort rating tertinggi (descending)
                    // Pastikan product_rating dianggap sebagai angka
                    const sortedData = data.sort((a, b) => parseFloat(b.product_rating) - parseFloat(a.product_rating));

                    // 2. Ambil maksimal 3 review teratas
                    const top3Reviews = sortedData.slice(0, 3);

                    // 3. Mapping ke format UI menggunakan data NAMA ASLI dari API
                    const formattedReviews = top3Reviews.map((item) => ({
                        id: item.id,
                        // ✅ Menggunakan nama dari objek user, fallback ke 'Pelanggan' jika null
                        name: item.user?.name || "Pelanggan",
                        message: item.review,
                        rating: item.product_rating
                    }));

                    setReviews(formattedReviews);
                }
            } catch (error) {
                console.error("Gagal mengambil ulasan:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const nextTestimoni = () => {
        if (reviews.length === 0) return;
        setCurrentTestimoni((prev) => (prev + 1) % reviews.length);
    };

    const prevTestimoni = () => {
        if (reviews.length === 0) return;
        setCurrentTestimoni((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    // Loading State
    if (isLoading) {
        return (
            <section className="relative w-full min-h-[500px] bg-orange-800 flex items-center justify-center">
                <p className="text-white animate-pulse">Memuat ulasan...</p>
            </section>
        );
    }

    // Jika tidak ada data
    if (reviews.length === 0) return null;

    // Helper untuk mengambil data dengan index aman (circular)
    const getReview = (offset) => {
        const index = (currentTestimoni + offset + reviews.length) % reviews.length;
        return reviews[index];
    };

    return (
        <section className="relative w-full min-h-screen bg-gradient-to-b from-orange-700 via-orange-600 to-orange-900 py-16 flex items-center justify-center overflow-hidden">

            {/* Container */}
            <div className="max-w-7xl mx-auto px-4 w-full">

                {/* Title */}
                <div className="text-center mb-12">
                    <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold text-yellow-300 italic"
                        style={{
                            fontFamily: 'Brush Script MT, cursive',
                            textShadow: '4px 4px 8px rgba(0,0,0,0.3)',
                            letterSpacing: '0.05em'
                        }}>
                        Kata Mereka
                    </h2>
                </div>

                {/* Carousel Container */}
                <div className="relative flex items-center justify-center gap-4 h-[400px]">

                    {/* Left Card (Blur) */}
                    {reviews.length > 1 && (
                        <div className="hidden lg:block flex-shrink-0 w-72 opacity-30 blur-sm transform scale-90 transition-all duration-500">
                            <div className="bg-gray-200 rounded-3xl p-6 h-64 flex flex-col justify-between">
                                <p className="text-gray-600 text-sm line-clamp-6">
                                    {getReview(-1).message}
                                </p>
                                <p className="text-xs text-gray-400 text-right mt-4 font-bold">
                                    {getReview(-1).name}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Left Arrow */}
                    <button
                        onClick={prevTestimoni}
                        className="absolute left-0 lg:left-10 z-20 text-white hover:text-yellow-300 transition-colors bg-black/20 rounded-full p-2 hover:bg-black/40 backdrop-blur-sm"
                        aria-label="Previous"
                    >
                        <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {/* Center Card (Active) */}
                    <div className="flex-shrink-0 w-full max-w-xl transform scale-100 z-10 transition-all duration-500 ease-in-out">
                        <div className="bg-white rounded-3xl p-8 shadow-2xl relative">

                            {/* Header */}
                            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                                {/* Avatar Inisial */}
                                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl shadow-sm uppercase">
                                    {getReview(0).name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800 capitalize">{getReview(0).name}</h4>

                                    {/* Format Rating: Angka + Bintang */}
                                    <div className="flex items-center gap-1 mt-1 bg-yellow-50 px-2 py-0.5 rounded-lg w-fit border border-yellow-100">
                                        <span className="text-yellow-600 font-bold text-sm">
                                            {getReview(0).rating}
                                        </span>
                                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                    </div>

                                </div>
                            </div>

                            {/* Message Bubble */}
                            <div className="bg-orange-50 rounded-2xl p-6 min-h-[180px] flex flex-col justify-center relative">
                                {/* Segitiga bubble */}
                                <div className="absolute -top-2 left-8 w-4 h-4 bg-orange-50 transform rotate-45"></div>

                                <p className="text-gray-700 text-lg leading-relaxed italic text-center">
                                    "{getReview(0).message}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={nextTestimoni}
                        className="absolute right-0 lg:right-10 z-20 text-white hover:text-yellow-300 transition-colors bg-black/20 rounded-full p-2 hover:bg-black/40 backdrop-blur-sm"
                        aria-label="Next"
                    >
                        <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {/* Right Card (Blur) */}
                    {reviews.length > 1 && (
                        <div className="hidden lg:block flex-shrink-0 w-72 opacity-30 blur-sm transform scale-90 transition-all duration-500">
                            <div className="bg-gray-200 rounded-3xl p-6 h-64 flex flex-col justify-between">
                                <p className="text-gray-600 text-sm line-clamp-6">
                                    {getReview(1).message}
                                </p>
                                <p className="text-xs text-gray-400 text-right mt-4 font-bold">
                                    {getReview(1).name}
                                </p>
                            </div>
                        </div>
                    )}

                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-3 mt-12">
                    {reviews.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentTestimoni(index)}
                            className={`rounded-full transition-all duration-300 shadow-sm ${index === currentTestimoni
                                ? 'bg-yellow-400 w-10 h-3'
                                : 'bg-white/40 w-3 h-3 hover:bg-white/60'
                                }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default KataMereka;