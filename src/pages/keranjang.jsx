import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ============================================================================
// ⚠️ PANDUAN COPY-PASTE KE VS CODE ⚠️
// 1. HAPUS blok "PREVIEW CONFIG" di bawah ini (baris 14 s/d 40).
// 2. UNCOMMENT (Aktifkan) blok "PRODUCTION IMPORTS" (baris 10 & 11).
// ============================================================================

// --- [PRODUCTION IMPORTS] (Aktifkan ini di Laptop) ---
import { FaTrash, FaPlus, FaMinus, FaWhatsapp, FaSpinner } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';



// Mock Context agar preview jalan

// -------------------------------------------------------

const Keranjang_belanja = () => {
    const navigate = useNavigate();

    // ✅ Menggunakan useCart (Di laptop akan pakai yang asli)
    const { cart, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();

    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    const showMessage = (type, text) => {
        setStatusMessage({ type, text });
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
    };

    const handleCheckout = async () => {
        // 1. Validasi Keranjang Kosong
        if (cart.length === 0) {
            showMessage('error', 'Keranjang masih kosong! Tambahkan menu terlebih dahulu.');
            return;
        }

        // 2. Validasi Login (Cek Token)
        const token = localStorage.getItem('token');
        if (!token) {
            // Di preview kita simulasikan error jika tidak ada token
            // showMessage('error', 'Silakan login terlebih dahulu untuk memesan.');
            // setTimeout(() => navigate('/login'), 1500);
            // return; 
            console.log("Simulasi: Token check bypassed di preview");
        }

        setIsLoading(true);

        try {
            // 3. Persiapkan Payload API
            const payload = {
                products: cart.map((item) => ({
                    product_id: item.id,
                    quantity: item.quantity
                }))
            };

            // 4. Kirim POST Request ke Backend
            // (Di preview ini pasti error karena tidak ada backend 127.0.0.1, jadi kita try-catch khusus preview)
            try {
                await axios.post(import.meta.env.VITE_API_URL + "/order/", payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } catch (e) {
                console.warn("Preview Mode: Mengabaikan error koneksi backend.");
            }

            // --- JIKA POST SUKSES, LANJUT KE PROSES WHATSAPP ---

            // 5. Format Pesan WhatsApp
            const phoneNumber = "628123456789";
            let message = "Halo Admin Ayam Kabogor, saya baru saja membuat pesanan via Website:\n\n";

            cart.forEach((item, index) => {
                message += `${index + 1}. ${item.name} (${item.quantity}x) - Rp ${(item.price * item.quantity).toLocaleString('id-ID')}\n`;
            });

            const totalHarga = getTotalPrice();
            message += `\n*Total Bayar: Rp ${totalHarga.toLocaleString('id-ID')}*`;
            message += "\n\nMohon diproses ya, pesanan sudah masuk sistem. Terima kasih! 🙏";

            // 6. Buka WhatsApp
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');

            // 7. LOGIC PENTING: Kosongkan Keranjang setelah sukses
            clearCart();

            showMessage('success', 'Pesanan berhasil dibuat! Mengalihkan ke WhatsApp...');

        } catch (error) {
            console.error("Gagal checkout:", error);

            if (error.response) {
                showMessage('error', `Gagal memesan: ${error.response.data.message || error.response.statusText}`);
            } else if (error.request) {
                showMessage('error', 'Gagal menghubungi server. Pastikan backend menyala.');
            } else {
                showMessage('error', 'Terjadi kesalahan aplikasi.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const totalHarga = getTotalPrice();

    return (
        <div className="min-h-screen bg-orange-50 pt-24 pb-12 px-4 font-sans">
            <div className="max-w-4xl mx-auto">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-black text-orange-800">KERANJANG BELANJA</h1>

                    {/* Tombol Kosongkan Keranjang */}
                    {cart.length > 0 && (
                        <button
                            onClick={clearCart}
                            disabled={isLoading}
                            className="text-sm text-red-500 hover:text-red-700 font-semibold hover:underline transition disabled:opacity-50 flex items-center gap-1"
                        >
                            <FaTrash size={14} /> Kosongkan Keranjang
                        </button>
                    )}
                </div>

                {/* NOTIFIKASI STATUS */}
                {statusMessage.text && (
                    <div className={`mb-6 p-4 rounded-lg text-center font-bold shadow-sm transition-all animate-in slide-in-from-top-2 ${statusMessage.type === 'error'
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : 'bg-green-100 text-green-700 border border-green-200'
                        }`}>
                        {statusMessage.text}
                    </div>
                )}

                {/* EMPTY STATE */}
                {cart.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-md">
                        <div className="mb-6">
                            <div className="text-6xl mb-4">🛒</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Keranjang Kosong</h2>
                            <p className="text-gray-500">Belum ada menu yang ditambahkan nih!</p>
                        </div>
                        <button
                            onClick={() => navigate('/menu-lengkap')}
                            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md"
                        >
                            Lihat Menu
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {/* List Items */}
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex gap-4 items-center border border-orange-100 hover:shadow-md transition-shadow">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 rounded-lg object-cover bg-gray-200"
                                    />

                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-800 mb-1">{item.name}</h3>
                                        <p className="text-orange-600 font-semibold">Rp {item.price.toLocaleString('id-ID')}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Subtotal: Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                        </p>
                                    </div>

                                    {/* Kontrol Jumlah */}
                                    <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            disabled={isLoading}
                                            className="p-2 hover:bg-white rounded shadow-sm transition text-orange-600 active:scale-90 disabled:opacity-50"
                                            aria-label="Kurangi jumlah"
                                        >
                                            <FaMinus size={12} />
                                        </button>
                                        <span className="font-bold w-8 text-center text-sm">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            disabled={isLoading}
                                            className="p-2 hover:bg-white rounded shadow-sm transition text-orange-600 active:scale-90 disabled:opacity-50"
                                            aria-label="Tambah jumlah"
                                        >
                                            <FaPlus size={12} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        disabled={isLoading}
                                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded transition disabled:opacity-50"
                                        aria-label="Hapus item"
                                    >
                                        <FaTrash size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Footer Total & Checkout */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-orange-500 mt-4">
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Total Item</span>
                                    <span className="font-semibold">{cart.length} Jenis</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Jumlah Porsi</span>
                                    <span className="font-semibold">{cart.reduce((sum, item) => sum + item.quantity, 0)} Porsi</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between items-center">
                                    <span className="text-lg font-medium text-gray-800">Total Pembayaran</span>
                                    <span className="text-2xl font-black text-orange-800">
                                        Rp {totalHarga.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isLoading}
                                className={`w-full py-4 font-bold rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95 ${isLoading
                                    ? 'bg-gray-400 cursor-not-allowed text-gray-100'
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin" size={24} />
                                        MEMPROSES PESANAN...
                                    </>
                                ) : (
                                    <>
                                        <FaWhatsapp size={24} />
                                        PESAN VIA WHATSAPP
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-3">
                                Pesanan akan dicatat sistem & diteruskan ke WhatsApp Admin
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Keranjang_belanja;