import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Clock, CheckCircle, XCircle, ChevronRight, AlertCircle, Loader, X, Calendar } from 'lucide-react';

const RiwayatPesanan = () => {
    const navigate = useNavigate();

    // State Data
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null); // Data detail order untuk modal

    // State UI
    const [isLoading, setIsLoading] = useState(true);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [error, setError] = useState(null);

    // Base URL untuk gambar (Sesuaikan jika folder storage Anda berbeda)
    const STORAGE_URL = import.meta.env.VITE_STORAGE_URL + "/";

    // 1. Fetch Semua Order (GET /api/orders)
    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                setIsLoading(true);
                const response = await axios.get(import.meta.env.VITE_API_URL + "/orders", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data && response.data.Orders) {
                    setOrders(response.data.Orders);
                } else {
                    setOrders([]);
                }
            } catch (err) {
                console.error("Gagal mengambil riwayat:", err);
                setError("Gagal memuat riwayat pesanan.");
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    // 2. Fetch Detail Order (GET /api/order/{id})
    const handleViewDetail = async (orderId) => {
        const token = localStorage.getItem('token');

        // ✅ PERBAIKAN 1: Gunakan state loading terpisah, jangan taruh di object data
        setIsDetailLoading(true);

        // Set ID saja untuk membuka modal (tanpa properti isLoading di dalamnya)
        setSelectedOrder({ id: orderId });

        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/order/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("DEBUG RESPONSE DETAIL:", response.data); // Cek console browser Anda

            // ✅ PERBAIKAN 2: Cek berbagai kemungkinan struktur response (Order/order/data)
            const orderData = response.data.Order || response.data.order || response.data.data;

            if (orderData) {
                setSelectedOrder(orderData);
            } else {
                console.warn("Struktur data detail tidak dikenali:", response.data);
            }
        } catch (err) {
            console.error("Gagal mengambil detail:", err);
            alert("Gagal memuat detail pesanan.");
            setSelectedOrder(null);
        } finally {
            // ✅ PERBAIKAN 3: Loading pasti berhenti di sini, sukses ataupun gagal
            setIsDetailLoading(false);
        }
    };

    const closeModal = () => {
        setSelectedOrder(null);
    };

    // --- Helper Functions ---

    const formatRupiah = (number) => {
        // Handle jika number undefined/null agar tidak error
        if (number === undefined || number === null) return "Rp 0";
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        try {
            const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
            return new Date(dateString).toLocaleDateString('id-ID', options);
        } catch (e) {
            return dateString;
        }
    };

    const getStatusColor = (status) => {
        // Gunakan toLowerCase() untuk antisipasi perbedaan huruf besar/kecil dari backend
        const s = status ? status.toLowerCase() : '';
        switch (s) {
            case 'completed':
            case 'selesai': return 'bg-green-100 text-green-700 border-green-200';
            case 'processing':
            case 'diproses': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'cancelled':
            case 'dibatalkan': return 'bg-red-100 text-red-700 border-red-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusLabel = (status) => {
        const s = status ? status.toLowerCase() : '';
        switch (s) {
            case 'completed': return 'Selesai';
            case 'processing': return 'Diproses';
            case 'cancelled': return 'Dibatalkan';
            case 'pending': return 'Menunggu Konfirmasi';
            default: return status || '-';
        }
    };

    const getStatusIcon = (status) => {
        const s = status ? status.toLowerCase() : '';
        switch (s) {
            case 'completed': return <CheckCircle size={16} />;
            case 'processing': return <Clock size={16} />;
            case 'cancelled': return <XCircle size={16} />;
            case 'pending': return <AlertCircle size={16} />;
            default: return <ShoppingBag size={16} />;
        }
    };

    // --- Render UI ---

    if (isLoading) {
        return (
            <div className="min-h-screen bg-orange-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="animate-spin text-orange-600 mx-auto mb-2" size={40} />
                    <p className="text-gray-500">Memuat riwayat pesanan...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-orange-50 pt-24 pb-12 px-4 font-sans">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-orange-900 flex items-center gap-2">
                        <ShoppingBag className="text-orange-600" /> Riwayat Pesanan
                    </h1>
                    <p className="text-gray-600 mt-1">Pantau status pesananmu di sini.</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* List Pesanan (Empty State) */}
                {!isLoading && orders.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl shadow border border-orange-100">
                        <ShoppingBag className="mx-auto text-gray-300 mb-3" size={48} />
                        <p className="text-gray-500">Belum ada pesanan.</p>
                        <button onClick={() => navigate('/menu-lengkap')} className="mt-4 text-orange-600 font-bold hover:underline">
                            Pesan Sekarang
                        </button>
                    </div>
                )}

                {/* List Pesanan (Map) */}
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow-lg border border-orange-100 overflow-hidden transition-shadow hover:shadow-xl">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-50 gap-4">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                        <ShoppingBag size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-mono">ORDER #{order.id}</p>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <Calendar size={12} /> {formatDate(order.created_at)}
                                        </p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 min-w-[100px] justify-center ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    {getStatusLabel(order.status)}
                                </div>
                            </div>

                            <div className="bg-orange-50/50 p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-gray-500">Total Belanja</p>
                                    <p className="font-bold text-lg text-orange-700">{formatRupiah(order.total_price)}</p>
                                </div>
                                <button
                                    onClick={() => handleViewDetail(order.id)}
                                    className="text-sm font-semibold text-white bg-orange-600 px-4 py-2 rounded-lg flex items-center hover:bg-orange-700 transition-colors shadow-md"
                                >
                                    Lihat Detail <ChevronRight size={16} className="ml-1" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- MODAL DETAIL --- */}
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                            {/* Modal Header */}
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-orange-50">
                                <h3 className="font-bold text-lg text-gray-800">Detail Pesanan #{selectedOrder.id || '...'}</h3>
                                <button onClick={closeModal} className="p-1 rounded-full hover:bg-gray-200 transition">
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto">
                                {/* ✅ PERBAIKAN 4: Hanya menggunakan state isDetailLoading */}
                                {isDetailLoading ? (
                                    <div className="flex flex-col items-center justify-center py-10">
                                        <Loader className="animate-spin text-orange-500 mb-2" />
                                        <p className="text-sm text-gray-500">Mengambil detail produk...</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Status & Tanggal Detail */}
                                        <div className="mb-6 grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <p className="text-xs text-gray-500 mb-1">Status</p>
                                                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(selectedOrder.status)}`}>
                                                    {getStatusLabel(selectedOrder.status)}
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <p className="text-xs text-gray-500 mb-1">Tanggal Pesan</p>
                                                <p className="text-sm font-medium text-gray-700">{formatDate(selectedOrder.created_at)}</p>
                                            </div>
                                        </div>

                                        {/* List Produk */}
                                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                            <ShoppingBag size={16} className="text-orange-500" /> Daftar Menu
                                        </h4>
                                        <div className="space-y-3 mb-6">
                                            {selectedOrder.products?.length > 0 ? (
                                                selectedOrder.products.map((product) => (
                                                    <div key={product.id} className="flex gap-3 items-start border-b border-gray-50 pb-3 last:border-0">
                                                        <img
                                                            src={`${STORAGE_URL}${product.product_url_image}`}
                                                            alt={product.product_name}
                                                            className="w-16 h-16 rounded-lg object-cover bg-gray-200"
                                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100?text=Menu"; }}
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-bold text-gray-800 text-sm">{product.product_name}</p>
                                                            <p className="text-xs text-gray-500 line-clamp-1">{product.product_description}</p>
                                                            <div className="flex justify-between items-center mt-1">
                                                                <p className="text-xs text-gray-600">
                                                                    {product.pivot?.quantity} x {formatRupiah(product.pivot?.price_at_time)}
                                                                </p>
                                                                <p className="text-sm font-bold text-orange-600">
                                                                    {formatRupiah(product.pivot?.quantity * product.pivot?.price_at_time)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-500 italic text-center py-4">Tidak ada data produk.</p>
                                            )}
                                        </div>

                                        {/* Total Akhir */}
                                        <div className="border-t border-dashed border-gray-300 pt-4 flex justify-between items-center">
                                            <span className="font-bold text-gray-700">Total Pembayaran</span>
                                            <span className="font-black text-xl text-orange-700">{formatRupiah(selectedOrder.total_price)}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default RiwayatPesanan;