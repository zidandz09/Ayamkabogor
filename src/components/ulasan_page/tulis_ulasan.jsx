import React, { useState, useEffect } from 'react';
// Mengganti react-icons dengan lucide-react yang support di preview
import { Star, Loader2, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const REVIEWS_API_URL = import.meta.env.VITE_API_URL + "/reviews";
const PRODUCTS_API_URL = import.meta.env.VITE_API_URL + "/products";

// --- Custom Modal Component (Pengganti Alert) ---
const CustomModal = ({ modalData, onClose }) => {
    if (!modalData.visible) return null;

    let icon, colorClass;
    switch (modalData.type) {
        case 'success':
            icon = <CheckCircle size={32} />;
            colorClass = "bg-orange-600 border-orange-700";
            break;
        case 'error':
            icon = <X size={32} />;
            colorClass = "bg-red-600 border-red-700";
            break;
        case 'warning':
            icon = <AlertTriangle size={32} />;
            colorClass = "bg-yellow-500 border-yellow-600";
            break;
        default:
            icon = <AlertTriangle size={32} />;
            colorClass = "bg-blue-500 border-blue-600";
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full transform transition-all overflow-hidden border-4 border-b-8 border-r-8" style={{ borderColor: colorClass.split(' ')[1] }}>
                <div className={`p-6 flex flex-col items-center ${colorClass} text-white`}>
                    {icon}
                    <h3 className="mt-3 text-2xl font-bold">{modalData.title}</h3>
                </div>
                <div className="p-6 text-center text-gray-800">
                    <p className="mb-6">{modalData.body}</p>
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl font-semibold transition-colors shadow-md"
                        style={{ backgroundColor: colorClass.split(' ')[0].replace('bg-', '#'), color: 'black' }}
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---
const TulisUlasan = () => {
    const navigate = useNavigate();

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

    const [formData, setFormData] = useState({
        productName: '', // Ini akan diisi dengan product_name (string)
        reviewText: ''
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [messageModal, setMessageModal] = useState({ visible: false, type: 'info', title: '', body: '' });


    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            fetchProducts();
        }
    }, [isLoggedIn]);

    const fetchProducts = async () => {
        setIsLoadingProducts(true);
        try {
            const response = await axios.get(PRODUCTS_API_URL);

            // Akses array produk melalui kunci "Products"
            let data = response.data.Products;

            if (Array.isArray(data)) {
                setProducts(data);
                // Set default product if available
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, productName: data[0].product_name }));
                }
            } else {
                console.warn("Format data produk tidak sesuai. Tidak ditemukan array di kunci 'Products'.", response.data);
                setProducts([]);
            }

        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setIsLoadingProducts(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCloseModal = () => {
        setMessageModal({ visible: false, type: 'info', title: '', body: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setMessageModal({
                visible: true,
                type: 'warning',
                title: 'Perhatian!',
                body: 'Silakan berikan nilai (rating bintang) terlebih dahulu sebelum mengirim ulasan.'
            });
            return;
        }

        // Pastikan produk sudah dipilih
        if (!formData.productName) {
            setMessageModal({
                visible: true,
                type: 'warning',
                title: 'Perhatian!',
                body: 'Silakan pilih produk yang ingin Anda ulas.'
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const token = localStorage.getItem('token');

            // Payload menggunakan product_name sebagai string text
            await axios.post(REVIEWS_API_URL, {
                product: formData.productName,
                product_rating: rating.toString(),
                review: formData.reviewText
            }, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                }
            });


            setSubmitStatus('success');
            setFormData(prev => ({ ...prev, reviewText: '' })); // Reset hanya review text
            setRating(0);

            setMessageModal({
                visible: true,
                type: 'success',
                title: 'Sukses!',
                body: 'Terima kasih! Ulasan Anda berhasil dikirim dan akan segera tampil.'
            });

        } catch (error) {
            console.error('Error submitting review:', error);
            setSubmitStatus('error');

            if (error.response?.status === 401) {
                setMessageModal({
                    visible: true,
                    type: 'error',
                    title: 'Sesi Berakhir',
                    body: 'Sesi Anda telah berakhir. Silakan login kembali.'
                });
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            const errorMsg = error.response?.data?.message || 'Gagal mengirim ulasan. Periksa koneksi Anda atau coba lagi.';
            setMessageModal({
                visible: true,
                type: 'error',
                title: 'Gagal Mengirim',
                body: errorMsg
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="w-full py-16 px-4 flex justify-center items-center bg-[#9A3412] min-h-screen font-[Inter]">
            <CustomModal modalData={messageModal} onClose={handleCloseModal} />

            <div className="w-full max-w-3xl">
                <div className="text-center mb-8">
                    <h2 className="text-4xl md:text-5xl font-black italic tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-b from-yellow-300 to-orange-500 drop-shadow-sm">
                        TULIS ULASAN ANDA!
                    </h2>
                </div>

                <div className="border-2 border-white/40 rounded-3xl p-6 md:p-10 bg-white/5 backdrop-blur-sm">
                    {!isLoggedIn ? (
                        <div className="text-center py-16 space-y-6">
                            <h3 className="text-2xl font-bold text-white">Silakan Login Terlebih Dahulu</h3>
                            <p className="text-white/80">Anda harus masuk ke akun untuk memberikan ulasan produk.</p>
                            <div className="flex justify-center gap-4 mt-4">
                                <button onClick={() => navigate('/login')} className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold shadow-xl hover:bg-orange-600 transition">
                                    Login Sekarang
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                            {/* Bagian Produk */}
                            <div className="flex flex-col gap-3">
                                <label className="text-white font-bold text-lg ml-1">Pilih Produk Yang Dibeli</label>

                                {isLoadingProducts ? (
                                    <div className="w-full p-4 rounded-xl bg-white/80 text-center text-gray-500 flex items-center justify-center gap-2">
                                        <Loader2 className="animate-spin" size={20} /> Memuat produk...
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <select
                                            name="productName"
                                            value={formData.productName}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting || products.length === 0}
                                            className="w-full p-4 rounded-xl bg-white/90 border-2 border-white/50 text-gray-800 font-semibold cursor-pointer appearance-none shadow-inner focus:ring-orange-500 focus:border-orange-500"
                                        >
                                            <option value="" disabled>-- Pilih Produk --</option>

                                            {products.length > 0 ? (
                                                products.map((product) => (
                                                    <option key={product.id} value={product.product_name}>
                                                        {product.product_name} • Rp {parseInt(product.product_price || 0).toLocaleString('id-ID')}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>Tidak ada produk tersedia</option>
                                            )}
                                        </select>
                                        {/* ICON WARNING DIHAPUS DARI SINI */}
                                    </div>
                                )}
                            </div>

                            {/* Bagian Rating */}
                            <div className="flex flex-col gap-3">
                                <label className="text-white font-bold text-lg ml-1">Nilai Produk</label>
                                <div className="flex gap-4 items-center bg-white/10 p-4 rounded-xl justify-center shadow-inner">
                                    {[...Array(5)].map((_, index) => {
                                        const starValue = index + 1;
                                        const isActive = starValue <= (hover || rating);
                                        return (
                                            <label key={index} className="cursor-pointer hover:scale-110 transition">
                                                <input
                                                    type="radio"
                                                    name="rating"
                                                    value={starValue}
                                                    onClick={() => setRating(starValue)}
                                                    className="hidden"
                                                    disabled={isSubmitting}
                                                />
                                                <Star
                                                    size={42}
                                                    className={`transition-colors duration-200 drop-shadow-md ${isActive ? "text-yellow-400 fill-yellow-400" : "text-gray-400/80"}`}
                                                    onMouseEnter={() => setHover(starValue)}
                                                    onMouseLeave={() => setHover(0)}
                                                />
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Bagian Text Area */}
                            <div className="flex flex-col gap-3">
                                <label className="text-white font-bold text-lg ml-1">Tulis Ulasan Anda</label>
                                <textarea
                                    name="reviewText"
                                    rows="5"
                                    placeholder="Bagikan pengalaman Anda..."
                                    value={formData.reviewText}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting}
                                    className="w-full p-4 rounded-xl bg-white/90 border-2 border-white/50 text-gray-800 shadow-inner resize-none focus:ring-orange-500 focus:border-orange-500"
                                ></textarea>
                            </div>

                            <div className="mt-4 flex justify-center">
                                <button
                                    type="submit"
                                    // Tombol dinonaktifkan jika: sedang submit, tidak ada produk, atau rating 0
                                    disabled={isSubmitting || products.length === 0 || rating === 0}
                                    className="bg-orange-700 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-2xl shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} /> Mengirim...
                                        </>
                                    ) : (
                                        'Kirim Ulasan Saya'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default TulisUlasan;