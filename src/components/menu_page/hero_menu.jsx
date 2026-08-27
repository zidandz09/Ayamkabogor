import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import axios from 'axios';

// Konfigurasi URL
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL = `${BASE_URL}/api/products`;
const STORAGE_URL = `${BASE_URL}/storage`;

const HeroMenu = () => {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Fetch Data Gambar dari API
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(API_URL);
                const data = response.data.Products || [];

                if (Array.isArray(data) && data.length > 0) {

                    // ✅ UPDATE: Ambil MAKSIMAL 3 produk teratas saja
                    const top3Products = data.slice(0, 3);

                    // Mapping data produk menjadi array URL gambar lengkap
                    const imageUrls = top3Products.map(product => {
                        // Pastikan path gambar ada, jika tidak pakai placeholder
                        if (product.product_url_image) {
                            return `${STORAGE_URL}/${product.product_url_image}`;
                        }
                        return "https://placehold.co/800x450/F4A460/333333?text=No+Image";
                    });

                    setImages(imageUrls);
                } else {
                    // Fallback jika data kosong
                    setImages([
                        "https://placehold.co/800x450/F4A460/333333?text=Tumpeng+Spesial",
                        "https://placehold.co/800x450/DEB887/333333?text=Tumpeng+Mini"
                    ]);
                }
            } catch (error) {
                console.error("Gagal mengambil gambar hero:", error);
                // Fallback jika error
                setImages([
                    "https://placehold.co/800x450/F4A460/333333?text=Error+Loading+Image"
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, []);

    // 2. Logika Slider (Hanya jalan jika images ada)
    const totalSlides = images.length;

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? totalSlides - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === totalSlides - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    // Auto Slide
    useEffect(() => {
        if (totalSlides <= 1) return; // Jangan auto slide jika gambar cuma 1

        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [currentIndex, totalSlides]);

    // Loading State
    if (isLoading) {
        return (
            <section className="py-8 md:py-16 bg-[#FFF6E7] min-h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-orange-400">
                    <Loader className="animate-spin" />
                    <span className="text-sm font-medium">Memuat Galeri...</span>
                </div>
            </section>
        );
    }

    return (
        <section className="py-8 md:py-16 bg-[#FFF6E7]">
            {/* Container: px-0 di HP (agar full width), px-4 di tablet ke atas */}
            <div className="max-w-5xl mx-auto px-0 md:px-4 relative group">

                {/* KOTAK GAMBAR UTAMA */}
                <div className="w-full aspect-[4/3] sm:aspect-video md:h-[450px] md:aspect-auto overflow-hidden relative md:rounded-2xl shadow-lg bg-gray-200">

                    {/* Wrapper Slide */}
                    <div
                        className="w-full h-full flex transition-transform ease-out duration-700"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {images.map((src, index) => (
                            <div key={index} className="w-full h-full flex-shrink-0 relative">
                                <img
                                    src={src}
                                    alt={`Slide ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://placehold.co/800x450/ccc/999?text=Image+Not+Found";
                                    }}
                                />
                                {/* Overlay Gradasi Tipis */}
                                <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black/40 to-transparent"></div>
                            </div>
                        ))}
                    </div>

                    {/* --- TOMBOL NAVIGASI (Hanya muncul jika gambar > 1) --- */}
                    {totalSlides > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 z-10 
                                           p-1 md:p-2 rounded-full bg-white/30 hover:bg-white/80 backdrop-blur-sm
                                           text-white hover:text-orange-600 transition-all duration-300 border border-white/20"
                            >
                                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                            </button>

                            <button
                                onClick={nextSlide}
                                className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4 z-10 
                                           p-1 md:p-2 rounded-full bg-white/30 hover:bg-white/80 backdrop-blur-sm
                                           text-white hover:text-orange-600 transition-all duration-300 border border-white/20"
                            >
                                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                            </button>

                            {/* --- INDIKATOR TITIK --- */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`
                                            transition-all duration-300 rounded-full shadow-sm
                                            ${currentIndex === index
                                                ? 'w-8 h-2 bg-orange-500' // Titik Aktif
                                                : 'w-2 h-2 bg-white/60 hover:bg-white' // Titik Inaktif
                                            }
                                        `}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                </div>
            </div>
        </section>
    );
};

export default HeroMenu;