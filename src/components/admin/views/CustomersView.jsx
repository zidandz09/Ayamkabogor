import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Save, User, Mail, Phone, MapPin, Shield, Loader, Lock } from 'lucide-react';
import axios from 'axios';

const CustomersView = () => {
    // --- STATE ---
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Form data dengan nilai awal string kosong (JANGAN null)
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        email: '',
        address: '',
        phone_number: '',
        password: '',
        is_admin: false
    });

    // --- 1. FETCH DATA (GET /api/users) ---
    const fetchCustomers = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(import.meta.env.VITE_API_URL + "/users", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = response.data.users || [];
            setCustomers(data);

        } catch (error) {
            console.error('Error fetching customers:', error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // --- 2. HANDLERS ---

    const filteredCustomers = customers.filter(customer =>
        (customer.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.phone_number || '').includes(searchTerm)
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Open Add Modal
    const handleOpenAddModal = () => {
        setIsEditing(false);
        // Reset form dengan nilai aman (String kosong, bukan null)
        setFormData({
            id: null,
            name: '',
            email: '',
            address: '',
            phone_number: '',
            password: '',
            is_admin: false
        });
        setIsModalOpen(true);
    };

    // Open Edit Modal - FIX POTENSI CRASH DISINI
    const handleOpenEditModal = (customer) => {
        setIsEditing(true);
        // Pastikan semua field memiliki fallback ke string kosong ('') atau boolean (false)
        // agar input tidak menerima undefined/null yang menyebabkan crash React.
        setFormData({
            id: customer.id,
            name: customer.name || '',
            email: customer.email || '',
            address: customer.address || '',
            phone_number: customer.phone_number || '',
            password: '', // Password dikosongkan saat edit
            is_admin: !!customer.is_admin // Pakai !! untuk memaksa jadi boolean true/false
        });
        setIsModalOpen(true);
    };

    // --- 3. SAVE DATA (POST / PUT) ---
    const handleSaveCustomer = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        const payload = {
            name: formData.name,
            email: formData.email,
            address: formData.address,
            phone_number: formData.phone_number,
            is_admin: formData.is_admin
        };

        if (formData.password) {
            payload.password = formData.password;
        }

        try {
            if (isEditing) {
                await axios.put(`${import.meta.env.VITE_API_URL}/user/${formData.id}`, payload, { headers });
                alert('✅ Data berhasil diperbarui!');
            } else {
                await axios.post(import.meta.env.VITE_API_URL + "/user/", payload, { headers });
                alert('✅ User baru berhasil ditambahkan!');
            }

            fetchCustomers();
            setIsModalOpen(false);

        } catch (error) {
            console.error('Save error:', error);
            const msg = error.response?.data?.message || 'Gagal menyimpan data.';
            alert(`❌ ${msg}`);
        } finally {
            setIsSaving(false);
        }
    };

    // --- 4. DELETE DATA ---
    const handleDeleteCustomer = async (id) => {
        if (!window.confirm('Yakin ingin menghapus user ini?')) return;

        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('✅ User berhasil dihapus');
            fetchCustomers();
        } catch (error) {
            console.error('Delete error:', error);
            alert('❌ Gagal menghapus user.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    Manajemen User ({customers.length})
                </h2>
                <button
                    onClick={handleOpenAddModal}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2 transition shadow-md"
                >
                    <Plus size={18} /> Tambah User
                </button>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari nama, email, atau no telepon..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600 min-w-[800px]">
                        <thead className="bg-gray-50 text-gray-700 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Nama</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">No. Telepon</th>
                                <th className="px-6 py-3">Alamat</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-10">
                                        <div className="flex flex-col items-center text-gray-500">
                                            <Loader className="animate-spin text-orange-500 mb-2" size={24} />
                                            Memuat data user...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-800">{customer.name}</td>
                                        <td className="px-6 py-4">{customer.email}</td>
                                        <td className="px-6 py-4">{customer.phone_number || '-'}</td>
                                        <td className="px-6 py-4 truncate max-w-xs" title={customer.address}>
                                            {customer.address || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {customer.is_admin ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    <Shield size={10} className="mr-1" /> Admin
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    User
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    onClick={() => handleOpenEditModal(customer)}
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    onClick={() => handleDeleteCustomer(customer.id)}
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
                                    <td colSpan="6" className="text-center py-10 text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <User size={32} className="mb-2 text-gray-300" />
                                            Tidak ada data user ditemukan.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL ADD / EDIT (Render Conditional) --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95">

                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-bold text-gray-900">
                                {isEditing ? 'Edit User' : 'Tambah User Baru'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSaveCustomer} className="p-6 space-y-4">

                            {/* Nama */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        // Menggunakan short-circuit || '' untuk mencegah value null/undefined
                                        value={formData.name || ''}
                                        onChange={handleChange}
                                        placeholder="Nama User"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        placeholder="user@example.com"
                                    />
                                </div>
                            </div>

                            {/* No Telepon */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="phone_number"
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        value={formData.phone_number || ''}
                                        onChange={handleChange}
                                        placeholder="08..."
                                    />
                                </div>
                            </div>

                            {/* Alamat */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <textarea
                                        name="address"
                                        rows="3"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                                        value={formData.address || ''}
                                        onChange={handleChange}
                                        placeholder="Alamat lengkap user..."
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password {isEditing && <span className="text-gray-400 font-normal">(Kosongkan jika tidak diubah)</span>}
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        name="password"
                                        required={!isEditing}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                        value={formData.password || ''}
                                        onChange={handleChange}
                                        placeholder={isEditing ? "********" : "Minimal 6 karakter"}
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            {/* Checkbox Admin */}
                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    name="is_admin"
                                    id="is_admin"
                                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                                    // Pastikan checked selalu boolean
                                    checked={!!formData.is_admin}
                                    onChange={handleChange}
                                />
                                <label htmlFor="is_admin" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                                    Jadikan sebagai Admin
                                </label>
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                                    disabled={isSaving}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium shadow-sm transition flex justify-center items-center gap-2"
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader size={18} className="animate-spin" /> Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} /> {isEditing ? 'Simpan' : 'Tambah'}
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomersView;