import React, { useEffect, useState } from "react";
import { X, Loader, Save } from "lucide-react";
import axios from "axios";

export default function ProductModal({
    isModalOpen,
    isEditing,
    currentMenu,
    setCurrentMenu,
    handleSaveMenu, // Callback untuk refresh data di parent
    setIsModalOpen
}) {
    const [isSaving, setIsSaving] = useState(false);

    // URL Storage untuk preview gambar lama
    const STORAGE_URL = import.meta.env.VITE_STORAGE_URL + "/";

    // Reset method patch saat modal dibuka dalam mode edit
    useEffect(() => {
        if (isModalOpen && isEditing) {
            setCurrentMenu(prev => ({ ...prev, _method: 'PATCH' }));
        }
    }, [isModalOpen, isEditing, setCurrentMenu]);

    if (!isModalOpen) return null;

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        // Handle input file
        if (name === "product_img") {
            if (files && files[0]) {
                setCurrentMenu((prev) => ({
                    ...prev,
                    [name]: files[0] // Simpan sebagai object File
                }));
            }
        } else {
            setCurrentMenu((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // --- SUBMIT FORM ---
    const onFormSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const token = localStorage.getItem('token');

        if (!token) {
            alert("Sesi Anda habis. Silakan login kembali.");
            window.location.href = '/login';
            return;
        }

        const formData = new FormData();

        // Append Text Data
        formData.append('product_name', currentMenu.product_name || '');
        formData.append('product_description', currentMenu.product_description || '');
        formData.append('product_price', currentMenu.product_price || 0);

        // Append File Gambar (Hanya jika user upload file baru)
        if (currentMenu.product_img && typeof currentMenu.product_img === 'object') {
            formData.append('product_img', currentMenu.product_img);
        }

        try {
            let url = import.meta.env.VITE_API_URL + "/products";

            // Jika Mode EDIT:
            // 1. Arahkan ke endpoint update specific ID
            // 2. Tambahkan _method=PATCH (Laravel requirement untuk FormData)
            if (isEditing) {
                url = `${import.meta.env.VITE_API_URL}/products/${currentMenu.id}?_method=PATCH`;
                formData.append('_method', 'PATCH');
            }

            // Kirim request selalu via POST karena ada FormData
            await axios.post(url, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert(isEditing ? "Produk berhasil diperbarui!" : "Produk berhasil ditambahkan!");
            setIsModalOpen(false);

            // Refresh data di parent
            if (handleSaveMenu) handleSaveMenu();

        } catch (error) {
            console.error("Gagal menyimpan produk:", error);

            // Error Handling
            if (error.response) {
                if (error.response.status === 422) {
                    // Error Validasi
                    const errors = error.response.data.errors;
                    let errMsg = "Validasi Gagal:\n";
                    for (const key in errors) {
                        errMsg += `- ${errors[key][0]}\n`;
                    }
                    alert(errMsg);
                } else if (error.response.status === 401) {
                    alert("Sesi login berakhir. Silakan login ulang.");
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                } else {
                    const msg = error.response.data.message || "Terjadi kesalahan server.";
                    alert(`Gagal (${error.response.status}): ${msg}`);
                }
            } else if (error.request) {
                alert("Gagal menghubungi server. Pastikan backend menyala.");
            } else {
                alert("Terjadi kesalahan aplikasi.");
            }

        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-2xl relative overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">

                <button
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-800 transition"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSaving}
                >
                    <X size={24} />
                </button>

                <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">
                    {isEditing ? "Edit Produk" : "Tambah Produk Baru"}
                </h2>

                <form onSubmit={onFormSubmit} className="space-y-5" encType="multipart/form-data">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                        <input
                            type="text"
                            name="product_name"
                            value={currentMenu.product_name || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none transition"
                            placeholder="Contoh: Ayam Bakar Madu"
                            required
                            disabled={isSaving}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                        <textarea
                            name="product_description"
                            value={currentMenu.product_description || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-orange-500 focus:outline-none transition"
                            placeholder="Deskripsi singkat produk..."
                            required
                            disabled={isSaving}
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                        <input
                            type="number"
                            name="product_price"
                            value={currentMenu.product_price || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none transition"
                            placeholder="0"
                            min="0"
                            required
                            disabled={isSaving}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Produk</label>

                        {/* Preview Gambar Lama */}
                        {isEditing && currentMenu.product_url_image && typeof currentMenu.product_url_image === 'string' && (
                            <div className="mb-3 p-2 border rounded-lg bg-gray-50 inline-block relative group">
                                <p className="text-[10px] text-gray-500 mb-1">Gambar Saat Ini:</p>
                                <img
                                    src={`${STORAGE_URL}${currentMenu.product_url_image}`}
                                    alt="Preview"
                                    className="w-24 h-24 object-cover rounded-md bg-white"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                        )}

                        {/* Input File Baru */}
                        <input
                            type="file"
                            name="product_img"
                            onChange={handleChange}
                            className="w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-orange-50 file:text-orange-700
                                hover:file:bg-orange-100
                                border border-gray-300 rounded-lg cursor-pointer bg-white"
                            accept="image/png, image/jpeg, image/jpg"
                            disabled={isSaving}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Format: PNG, JPG. {isEditing ? "(Upload baru untuk mengganti)" : "(Wajib upload)"}
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                            disabled={isSaving}
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-bold shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <>
                                    <Loader className="animate-spin" size={18} /> Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save size={18} /> {isEditing ? "Simpan Perubahan" : "Tambah Produk"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}