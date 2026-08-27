// src/components/TentangRingkas.jsx
import React from 'react';
import menu from '../assets/allmenu.jpeg';
// ... import lainnya ...

// Pastikan nama const-nya BENAR
const TentangRingkas = () => {
    return (
        <section className="
                relative 
                w-full h-screen 
                flex items-center justify-center
                overflow-hidden
        ">
            {/* berisi konten ringkasan */}

            <div className="absolute inset-0 bg-[#FFF6E7]">
                <div className="inline-flex justify-start items-center gap-20">
                    {/* Circle container - perbesar ukurannya */}
                    <div className="relative w-96 h-[550px] flex-shrink-0 hidden lg:block">
                        {/* Amber outer circle */}
                        <div className="absolute translate-y-12 translate-x-0 w-10/12 h-[500px] rounded-[170px] border-4 border-orange-700"></div>

                        {/* Orange/brown inner circle */}
                        <div className="absolute translate-y-16 translate-x-4 w-9/12 h-[465px] rounded-[140px] border-4 border-amber-500"></div>

                        <img
                            src={menu}
                            alt="Hero Background"
                            className="absolute translate-y-20 translate-x-8 w-8/12 h-[420px] rounded-[140px]"
                        />


                    </div>
                    <div className="
                    w-full lg:max-w-xl /* w-full di mobile, batasi di desktop */
                    flex flex-col justify-center items-center gap-5 text-center
                ">
                        <div className="
                        text-4xl sm:text-5xl lg:text-6xl 
                        font-bold 
                        leading-tight 
                        text-orange-700 /* Tambahkan warna teks yang hilang */
                    ">Tentang Kami</div>

                        {/* Paragraf 1: Ukuran teks disesuaikan untuk mobile/desktop */}
                        <div className="
                        text-lg md:text-xl font-poppins 
                        text-center leading-relaxed
                        text-gray-700 
                    ">
                            AYAM KABOGOR adalah spesialisasi catering yang bangga menyajikan hidangan lezat Ayam Kampung dan Bebek dengan cita rasa otentik yang khas dari Bogor. Kami memprioritaskan kualitas dengan memilih Ayam Kampung yang gurih dan Bebek yang empuk, diolah menggunakan rempah-rempah pilihan yang diracik khusus.
                        </div>

                        {/* Paragraf 2: Ukuran teks disesuaikan untuk mobile/desktop */}
                        <div className="
                        text-lg md:text-xl font-poppins 
                        text-center leading-relaxed
                        text-gray-700 /* Tambahkan warna teks agar terlihat */
                    ">
                            Proses ungkep yang lama dan bumbu rempah asli Nusantara yang meresap sempurna adalah kunci keunggulan kami. Komitmen kami adalah menghadirkan makanan yang tidak hanya lezat, tetapi juga membawa kenangan rasa masakan rumahan kampung yang tak terlupakan.
                        </div>
                    </div>
                </div>
            </div>



        </section>
    );
};

// Pastikan export default-nya BENAR
export default TentangRingkas;