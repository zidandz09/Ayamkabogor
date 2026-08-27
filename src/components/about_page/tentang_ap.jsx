import React from 'react';

// GANTI DENGAN GAMBAR KAMU SENDIRI
// Pastikan kamu punya gambar yang memanjang ke atas (portrait)
import heroImage from '../../assets/ayam-goreng-kremes.jpeg';

const TentangAp = () => {
    return (
        <section className="w-full min-h-screen flex items-center justify-center py-16 px-6 md:px-12 bg-gradient-to-b from-orange-50 to-orange-200">

            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">

                {/* 1. BAGIAN KIRI: GAMBAR */}
                <div className="flex justify-center md:justify-end">
                    <div className="relative w-full max-w-md">
                        {/* Gambar dibuat rounded besar dan shadow halus sesuai desain */}
                        <img
                            src={heroImage}
                            alt="Ayam Goreng Kremes Kabogor"
                            className="w-full h-auto md:h-[600px] object-cover rounded-[3rem] shadow-2xl"
                        />
                    </div>
                </div>

                {/* 2. BAGIAN KANAN: TEKS */}
                <div className="text-center">

                    {/* Judul Besar */}
                    <h2
                        className="text-5xl md:text-7xl font-black italic text-[#9A3412] mb-8 uppercase tracking-tight"
                        style={{ fontFamily: 'serif' }} // Menggunakan font serif tebal agar mirip gambar
                    >
                        AYAM KABOGOR
                    </h2>

                    {/* Paragraf 1 (Lorem Ipsum Sesuai Gambar) */}
                    <p className="text-[#7C2D12] text-lg md:text-xl leading-relaxed mb-6 font-poppins text-center opacity-90">
                        AYAM KABOGOR adalah spesialisasi catering yang bangga menyajikan hidangan lezat Ayam Kampung dan Bebek dengan cita rasa otentik yang khas dari Bogor. Kami memprioritaskan kualitas dengan memilih Ayam Kampung yang gurih dan Bebek yang empuk, diolah menggunakan rempah-rempah pilihan yang diracik khusus.
                    </p>

                    {/* Paragraf 2 (Lorem Ipsum Sesuai Gambar) */}
                    <p className="text-[#7C2D12] text-lg md:text-xl leading-relaxed  font-poppins text-center opacity-90">
                        Proses ungkep yang lama dan bumbu rempah asli Nusantara yang meresap sempurna adalah kunci keunggulan kami. Komitmen kami adalah menghadirkan makanan yang tidak hanya lezat, tetapi juga membawa kenangan rasa masakan rumahan kampung yang tak terlupakan.
                    </p>

                </div>

            </div>
        </section>
    );
};

export default TentangAp;