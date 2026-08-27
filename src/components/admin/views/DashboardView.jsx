import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DashboardView() {
    // --- 1. STATE & INISIALISASI ---

    const today = new Date().toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

    const [dashboardData, setDashboardData] = useState({
        total_user: 0,
        totalOrderSuccess: 0,
        cta: 0,
        best_selling_products: []
    });

    const [isLoading, setIsLoading] = useState(false);

    // --- 2. HANDLER TANGGAL (DENGAN VALIDASI) ---

    const handleStartDateChange = (e) => {
        const newStart = e.target.value;
        setStartDate(newStart);

        // Validasi: Jika Start Date melebihi End Date, geser End Date biar sama
        if (newStart > endDate) {
            setEndDate(newStart);
        }
    };

    const handleEndDateChange = (e) => {
        const newEnd = e.target.value;

        // Validasi: Jika End Date kurang dari Start Date, jangan biarkan (atau geser Start Date)
        if (newEnd < startDate) {
            alert("Tanggal Akhir tidak boleh lebih mundur dari Tanggal Awal!");
            // Opsi lain: setStartDate(newEnd); // Auto-correct
            return;
        }
        setEndDate(newEnd);
    };

    // --- 3. FETCH DATA DARI API ---
    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            // Double check validation sebelum fetch
            if (startDate > endDate) return;

            setIsLoading(true);
            try {
                const response = await axios.get(import.meta.env.VITE_API_URL + "/dashboard", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        startDate: startDate,
                        endDate: endDate
                    }
                });

                if (response.data && response.data.data) {
                    setDashboardData(response.data.data);
                }

            } catch (error) {
                console.error("Gagal mengambil data dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (startDate && endDate) {
            fetchDashboardData();
        }
    }, [startDate, endDate]);


    // --- 4. KOMPONEN KARTU ---
    const StatCard = ({ title, count, iconPath, color = "bg-orange-500" }) => (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white shrink-0`}>
                {iconPath}
            </div>
            <div>
                <h3 className="text-2xl font-bold text-gray-800">
                    {isLoading ? "..." : count}
                </h3>
                <p className="text-sm text-gray-500">{title}</p>
            </div>
        </div>
    );

    // --- 5. ICONS ---
    const IconUser = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
    const IconOrder = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18.182 12.12 21 20.85 12.5" /><path d="M7 2h10a2 2 0 0 1 2 2v14.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" /></svg>;
    const IconCursor = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 12-9-9" /><path d="M19 9 10 18l-3-3" /><path d="m21 21-9-9" /></svg>;

    return (
        <div className="space-y-8">

            {/* --- FILTER TANGGAL --- */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-700 mb-4">Filter Periode</h2>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="text-orange-500 font-bold text-sm mb-1 block">Tanggal Awal</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange} // ✅ Pakai handler baru
                            className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-orange-500 font-bold text-sm mb-1 block">Tanggal Akhir</label>
                        <input
                            type="date"
                            value={endDate}
                            min={startDate} // ✅ Validasi HTML native: min date = start date
                            onChange={handleEndDateChange} // ✅ Pakai handler baru
                            className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
                        />
                    </div>
                </div>
            </div>

            {/* --- BAGIAN 1: DASHBOARD UTAMA --- */}
            <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Total Pengguna"
                        count={dashboardData.total_user}
                        iconPath={IconUser}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Pesanan Sukses"
                        count={dashboardData.totalOrderSuccess}
                        iconPath={IconOrder}
                        color="bg-green-500"
                    />
                    <StatCard
                        title="Klik CTA (WhatsApp)"
                        count={dashboardData.cta}
                        iconPath={IconCursor}
                        color="bg-orange-500"
                    />
                </div>
            </div>

            {/* --- BAGIAN 2: PRODUK TERLARIS --- */}
            <div>
                <h2 className="text-orange-500 font-bold mb-4 text-lg flex items-center gap-2">
                    Produk Terlaris
                    {isLoading && <span className="text-xs font-normal text-gray-400 animate-pulse">(Memuat data...)</span>}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboardData.best_selling_products.length > 0 ? (
                        dashboardData.best_selling_products.map((product, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between h-full hover:shadow-md transition">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-800 text-lg line-clamp-2" title={product.product_name}>
                                            {product.product_name}
                                        </h3>
                                        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">
                                            #{index + 1}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-1 rounded-full mb-3">
                                        <div className="bg-orange-500 h-1 rounded-full" style={{ width: '60%' }}></div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-3xl font-black text-gray-700">
                                        {product.total_sold}
                                    </span>
                                    <span className="text-sm text-gray-500">Pcs Terjual</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <p className="text-gray-500 italic">Belum ada data penjualan pada periode ini.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}