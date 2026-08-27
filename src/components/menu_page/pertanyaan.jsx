import React from 'react';
import axios from 'axios';

const PunyaPertanyaan = () => {

    // ✅ Fungsi untuk menembak API saat tombol diklik
    const handleWhatsAppClick = () => {
        // Fire & Forget: Kirim request tanpa menunggu response (await)
        // agar user langsung diarahkan ke WhatsApp tanpa delay.
        axios.post(import.meta.env.VITE_API_URL + "/cta")
            .then(() => {
                console.log("CTA WhatsApp berhasil dicatat");
            })
            .catch((error) => {
                // Error silent saja agar tidak mengganggu user
                console.error("Gagal mencatat CTA:", error);
            });
    };

    return (
        <section className="w-full min-h-screen bg-gradient-to-b from-orange-600 to-orange-700 py-16 flex items-center justify-center px-4">

            {/* Card */}
            <div className="max-w-2xl w-full bg-orange-800/50 backdrop-blur-sm rounded-3xl border-2 border-yellow-600 p-6 md:p-12 text-center shadow-2xl">

                {/* Title */}
                <h2 className="text-yellow-200 text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
                    Punya Pertanyaan?
                </h2>

                {/* Description */}
                <p className="text-white text-base md:text-xl lg:text-2xl mb-8 leading-relaxed">
                    Anda Punya Pertanyaan Lebih Lanjut{' '}
                    <br className="hidden md:block" />
                    Tentang Produk Kami? Silakan Bertanya{' '}
                    <br className="hidden md:block" />
                    Ke Nomor Whatsapp Berikut!
                </p>

                {/* TOMBOL WHATSAPP */}
                <a
                    href="https://wa.me/6281281459999"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatsAppClick} // ✅ Event Handler ditambahkan di sini
                    className="
                        inline-flex items-center justify-center gap-2 
                        bg-yellow-500 hover:bg-yellow-400 
                        text-white 
                        text-xs sm:text-sm md:text-lg 
                        font-semibold 
                        py-3 px-4 sm:px-6 md:px-8 
                        rounded-full 
                        transition-transform hover:scale-105 shadow-lg
                        whitespace-nowrap
                        cursor-pointer
                    "
                >
                    {/* Icon WhatsApp (SVG Inline agar aman tanpa install react-icons) */}
                    <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 448 512"
                        className="text-lg md:text-2xl"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                    </svg>
                    Hubungkan dengan Whatsapp
                </a>

            </div>

        </section>
    );
};

export default PunyaPertanyaan;