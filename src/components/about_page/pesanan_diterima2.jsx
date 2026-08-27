// src/components/pesanan_diterima.jsx

import React from 'react';

const PesananDiterima2 = () => {
    return (
        <section
            className="
                relative
                w-full h-full
                flex items-center justify-center
                overflow-hidden
                py-16
                bg-gradient-to-b from-orange-200 to-orange-400"

        >

            <div className='relative z-10 w-full max-w-7xl mx-auto px-4'>
                {/* Stats Container */}
                <div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-6 md:gap-8 lg:gap-12">

                    {/* Stat 1 */}
                    <div className="flex flex-col items-center text-center flex-1">
                        {/* WARNA TEXT DISESUAIKAN AGAR LEBIH KONTRAST DI BACKGROUND ORANYE BARU */}
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#7C2D12] ">
                            67
                        </h3>
                        <p className="mt-2 text-base md:text-lg lg:text-xl text-[#7C2D12] opacity-90 font-bold">
                            Pesanan Diterima
                        </p>
                    </div>

                    {/* Divider */}
                    {/* WARNA DIVIDER DISESUAIKAN */}
                    <div className="hidden md:block w-px h-20 bg-[#7C2D12] opacity-70"></div>

                    {/* Stat 1 */}
                    <div className="flex flex-col items-center text-center flex-1">
                        {/* WARNA TEXT DISESUAIKAN AGAR LEBIH KONTRAST DI BACKGROUND ORANYE BARU */}
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#7C2D12]">
                            40
                        </h3>
                        <p className="mt-2 text-base md:text-lg lg:text-xl text-[#7C2D12] opacity-90 font-bold">
                            menu
                        </p>
                    </div>

                    {/* Divider */}
                    {/* WARNA DIVIDER DISESUAIKAN */}
                    <div className="hidden md:block w-px h-20 bg-[#7C2D12] opacity-70"></div>

                    {/* Stat 1 */}
                    <div className="flex flex-col items-center text-center flex-1">
                        {/* WARNA TEXT DISESUAIKAN AGAR LEBIH KONTRAST DI BACKGROUND ORANYE BARU */}
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#7C2D12]">
                            30
                        </h3>
                        <p className="mt-2 text-base md:text-lg lg:text-xl text-[#7C2D12] opacity-90 font-bold">
                            User
                        </p>
                    </div>


                </div>
            </div>

        </section>
    );
};

export default PesananDiterima2;