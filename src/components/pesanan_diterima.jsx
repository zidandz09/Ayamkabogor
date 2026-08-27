// src/components/pesanan_diterima.jsx

import React from 'react';
import background from '../assets/background-image.jpeg';

const PesananDiterima = () => {
    return (
        <section
            className="
                relative
                w-full h-full
                flex items-center justify-center
                overflow-hidden
                py-16
            "
        >
            <div className='absolute inset-0 z-0'>
                {/* Gambar Latar Belakang */}
                <img
                    src={background}
                    alt="Hero Background"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className='relative z-10 w-full max-w-7xl mx-auto px-4'>
                {/* Stats Container - GUNAKAN FLEX */}
                <div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-6 md:gap-8 lg:gap-12">

                    {/* Stat 1 */}
                    <div className="flex flex-col items-center text-center flex-1">
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black ">
                            67
                        </h3>
                        <p className="mt-2 text-base md:text-lg lg:text-xl text-black">
                            Pesanan Diterima
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px h-20 bg-orange-700"></div>

                    {/* Stat 2 */}
                    <div className="flex flex-col items-center text-center flex-1">
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black">
                            30
                        </h3>
                        <p className="mt-2 text-base md:text-lg lg:text-xl text-black">
                            User
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px h-20 bg-orange-700"></div>

                    {/* Stat 3 */}
                    <div className="flex flex-col items-center text-center flex-1">
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black">
                            40
                        </h3>
                        <p className="mt-2 text-base md:text-lg lg:text-xl text-black">
                            menu
                        </p>
                    </div>




                </div>
            </div>

        </section>
    );
};

export default PesananDiterima; 