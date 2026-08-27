import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Plus, Edit, Trash2, AlertCircle, Loader } from "lucide-react";

// Pastikan file ProductModal.jsx berada di folder yang sama
import ProductModal from "../modals/ProductModal";

export default function MenuManagerView() {
    // --- STATE DATA ---
    const [menus, setMenus] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // --- STATE MODAL ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMenu, setCurrentMenu] = useState({});

    // Base URL Storage Laravel
    const STORAGE_URL = import.meta.env.VITE_STORAGE_URL + "/";

    // --- 1. FETCH DATA ---
    const fetchProducts = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(import.meta.env.VITE_API_URL + "/products", {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Mapping data sesuai respons backend
            const data = response.data.Products || response.data.products || response.data.data || [];
            setMenus(data);

        } catch (error) {
            console.error("Gagal mengambil data produk:", error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // --- 2. HANDLERS MODAL ---
    const handleOpenAddModal = () => {
        setCurrentMenu({}); // Reset form
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item) => {
        setCurrentMenu({
            id: item.id,
            product_name: item.product_name || item.name,
            product_description: item.product_description || item.description,
            product_price: item.product_price || item.price,
            product_url_image: item.product_url_image || item.image,
            _method: 'PATCH'
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleSaveSuccess = () => {
        fetchProducts();
    };

    // --- 3. HANDLE DELETE ---
    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus produk ini?")) return;

        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Produk berhasil dihapus!");
            fetchProducts(); // Refresh data

        } catch (error) {
            console.error("Gagal menghapus produk:", error);
            alert("Gagal menghapus produk. Silakan coba lagi.");
        }
    };

    // --- FILTERING ---
    const filteredMenus = menus.filter(item =>
        (item.product_name || item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatRupiah = (price) => {
        return parseInt(price || 0).toLocaleString("id-ID");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    Daftar Produk ({filteredMenus.length})
                </h2>

                <button
                    onClick={handleOpenAddModal}
                    className="bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-orange-700 transition shadow-sm"
                >
                    <Plus size={18} /> Tambah Produk
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari nama produk..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 min-w-[700px]">
                        <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-xs">
                            <tr>
                                <th className="px-6 py-3 w-24">Gambar</th>
                                <th className="px-6 py-3">Nama Produk</th>
                                <th className="px-6 py-3 w-1/3">Deskripsi</th>
                                <th className="px-6 py-3">Harga</th>
                                <th className="px-6 py-3 text-center w-32">Aksi</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <Loader className="animate-spin text-orange-500 mb-2" size={24} />
                                            Memuat data produk...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredMenus.length > 0 ? (
                                filteredMenus.map((item) => (
                                    <tr key={item.id} className="hover:bg-orange-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            {item.product_url_image || item.image ? (
                                                <img
                                                    src={item.product_url_image ? `${STORAGE_URL}${item.product_url_image}` : item.image}
                                                    alt={item.product_name}
                                                    className="w-12 h-12 rounded-lg object-cover border shadow-sm bg-gray-50"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/orange/white?text=IMG"; }}
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500 border">
                                                    No Img
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            {item.product_name || item.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 line-clamp-2">
                                            {item.product_description || item.description || "-"}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-orange-600">
                                            Rp {formatRupiah(item.product_price || item.price)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    onClick={() => handleOpenEditModal(item)}
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    onClick={() => handleDelete(item.id)}
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <AlertCircle size={32} className="mb-2 text-gray-300" />
                                            Tidak ada produk yang ditemukan.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Component */}
            <ProductModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                isEditing={isEditing}
                currentMenu={currentMenu}
                setCurrentMenu={setCurrentMenu}
                handleSaveMenu={handleSaveSuccess}
            />
        </div>
    );
}