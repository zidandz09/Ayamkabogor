import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, CheckCircle, AlertTriangle, LogOut } from 'lucide-react';

// --- KONFIGURASI API ---
const BASE_API_URL = import.meta.env.VITE_API_URL;

const UserProfileSecure = () => {
    // State untuk Data Profil
    const [userData, setUserData] = useState({
        id: null,
        name: "",
        email: "",
        phone: "", // Di frontend kita pakai 'phone', nanti dikirim sebagai 'phone_number'
        address: "",
        member_since: null
    });

    // State UI & Status
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({ type: 'success', text: '' });
    const [errorMessage, setErrorMessage] = useState(null);

    // Form validation errors
    const [validationErrors, setValidationErrors] = useState({});

    // ✅ 1. CHECK AUTHENTICATION
    const checkAuth = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Sesi berakhir. Silakan login kembali.');
            window.location.href = '/login';
            return false;
        }
        return token;
    };

    // ✅ 2. FETCH USER PROFILE
    const fetchUserProfile = async () => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const token = checkAuth();
            if (!token) return;

            const response = await fetch(`${BASE_API_URL}/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                alert('Sesi berakhir. Silakan login kembali.');
                window.location.href = '/login';
                return;
            }

            if (!response.ok) {
                throw new Error(`Gagal memuat profil (${response.status})`);
            }

            const result = await response.json();

            // Mapping response backend ke state frontend
            const data = result.User || result.data || {};

            setUserData({
                id: data.id,
                name: data.name || '',
                email: data.email || '',
                // Backend kirim 'phone_number', kita simpan di state 'phone'
                phone: data.phone_number || data.phone || '',
                address: data.address || '',
                member_since: data.created_at
            });

        } catch (error) {
            console.error("Fetch profile error:", error);
            setErrorMessage(error.message);
            showNotification('error', `Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    // ✅ 3. VALIDATE FORM
    const validateForm = () => {
        const errors = {};

        if (!userData.name || userData.name.trim().length < 3) {
            errors.name = 'Nama minimal 3 karakter';
        }

        if (!userData.address || userData.address.trim() === "") {
            errors.address = 'Alamat wajib diisi';
        }

        // Validasi phone number (Max 20 chars sesuai request backend)
        if (!userData.phone || userData.phone.length > 20) {
            errors.phone = 'Nomor telepon wajib diisi (maks 20 karakter)';
        } else if (!/^[0-9+\-\s]+$/.test(userData.phone)) {
            errors.phone = 'Format nomor telepon tidak valid';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // ✅ 4. SAVE PROFILE (PUT REQUEST)
    const handleSave = async () => {
        if (!validateForm()) {
            showNotification('error', 'Mohon perbaiki input yang salah');
            return;
        }

        setIsSaving(true);
        setErrorMessage(null);

        try {
            const token = checkAuth();
            if (!token) return;

            // ✅ PAYLOAD ADJUSTMENT SESUAI REQUEST
            // Kita hanya kirim: name, address, phone_number
            // Email tidak dikirim karena tidak boleh diedit
            const payload = {
                name: userData.name,
                address: userData.address,
                phone_number: userData.phone // Mapping state 'phone' ke key 'phone_number'
            };

            const response = await fetch(`${BASE_API_URL}/profile`, {
                method: 'PUT', // Request method PUT
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                alert('Sesi berakhir. Silakan login kembali.');
                window.location.href = '/login';
                return;
            }

            if (!response.ok) {
                // Coba ambil pesan error dari backend jika ada
                const errorData = await response.json();
                const serverMsg = errorData.message || errorData.error || 'Gagal menyimpan profil';
                throw new Error(serverMsg);
            }

            // Update sukses
            setIsEditing(false);
            showNotification('success', '✅ Profil berhasil diperbarui!');

            // Refresh data agar sinkron dengan backend
            fetchUserProfile();

        } catch (error) {
            console.error("Save profile error:", error);
            showNotification('error', `Gagal menyimpan: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    // ✅ 5. LOGOUT
    const handleLogout = () => {
        if (window.confirm('Yakin ingin keluar?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));

        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const showNotification = (type, text) => {
        setToastMessage({ type, text });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-orange-50 pt-24 pb-10 px-4 font-sans relative">

            {/* Toast Notifikasi */}
            {showToast && (
                <div className={`fixed top-5 right-5 z-50 p-4 rounded-lg shadow-xl flex items-center gap-3 transition-all duration-300 ${toastMessage.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white animate-slidein`}>
                    {toastMessage.type === 'success' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
                    <p className="font-semibold text-sm md:text-base">{toastMessage.text}</p>
                </div>
            )}

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-white/80 z-40 flex items-center justify-center backdrop-blur-sm">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-700"></div>
                        <p className="mt-4 text-orange-700 font-medium">Memuat profil...</p>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto">

                {/* Header / Cover */}
                <div className="relative h-48 bg-gradient-to-r from-orange-600 to-orange-400 rounded-t-2xl shadow-lg">
                    <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                        <div className="relative group">
                            {/* Foto Profil Default */}
                            <img
                                src={"https://placehold.co/150x150/E5964D/white?text=User"}
                                alt="Profile"
                                className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover bg-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Konten Profil */}
                <div className="bg-white rounded-b-2xl shadow-lg pt-20 pb-8 px-6 md:px-12 mt-0 border-x border-b border-orange-100">

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">{userData.name || 'Pengguna'}</h1>
                        <p className="text-gray-500 text-sm mt-1">{userData.email}</p>
                        <p className="text-xs text-gray-400 mt-2">
                            Bergabung sejak {formatDate(userData.member_since)}
                        </p>
                    </div>

                    {/* Form Data */}
                    <div className="space-y-6">
                        <div className="flex flex-wrap justify-between items-center border-b-2 border-orange-100 pb-3 mb-4">
                            <h3 className="text-xl font-bold text-orange-800">Informasi Pribadi</h3>
                            <button
                                onClick={() => {
                                    if (isEditing) {
                                        // Reset jika batal
                                        fetchUserProfile();
                                        setValidationErrors({});
                                    }
                                    setIsEditing(!isEditing);
                                }}
                                className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-800 font-semibold p-1 transition-colors"
                            >
                                <Edit2 size={16} />
                                {isEditing ? 'Batal Edit' : 'Edit Profil'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Nama Lengkap */}
                            <ProfileField
                                label="Nama Lengkap"
                                icon={User}
                                name="name"
                                value={userData.name}
                                isEditing={isEditing}
                                handleChange={handleChange}
                                type="text"
                                error={validationErrors.name}
                            />

                            {/* Email (Read Only) - TIDAK DIKIRIM SAAT SAVE */}
                            <ProfileField
                                label="Email"
                                icon={Mail}
                                name="email"
                                value={userData.email}
                                isEditing={false} // Selalu false agar tidak muncul input box
                                readOnly={true}
                                info="Email tidak dapat diubah"
                            />

                            {/* No Telepon (Mapping ke phone_number) */}
                            <ProfileField
                                label="No. WhatsApp"
                                icon={Phone}
                                name="phone" // State key: phone
                                value={userData.phone}
                                isEditing={isEditing}
                                handleChange={handleChange}
                                type="text"
                                error={validationErrors.phone}
                            />

                            {/* Alamat */}
                            <ProfileField
                                label="Alamat Pengiriman"
                                icon={MapPin}
                                name="address"
                                value={userData.address}
                                isEditing={isEditing}
                                handleChange={handleChange}
                                type="textarea"
                                fullWidth={true}
                                error={validationErrors.address}
                            />
                        </div>

                        {/* Tombol Simpan & Logout */}
                        <div className="flex flex-col md:flex-row gap-3 mt-8">
                            {isEditing && (
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex-1 bg-orange-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-orange-700 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Save size={20} />
                                    {isSaving ? 'Menyimpan...' : 'SIMPAN PERUBAHAN'}
                                </button>
                            )}

                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <LogOut size={20} />
                                KELUAR
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Sub-Komponen ProfileField
const ProfileField = ({
    label,
    icon: Icon,
    name,
    value,
    isEditing,
    handleChange,
    type = 'text',
    readOnly = false,
    info = null,
    fullWidth = false,
    error = null
}) => (
    <div className={`bg-orange-50/50 p-4 rounded-xl border ${error ? 'border-red-400' : 'border-orange-100'} ${fullWidth ? 'md:col-span-2' : ''}`}>
        <label className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Icon size={16} className="text-orange-500" /> {label}
        </label>
        {isEditing && !readOnly ? (
            <>
                {type === 'textarea' ? (
                    <textarea
                        name={name}
                        value={value}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 text-gray-800 ${error ? 'border-red-400' : ''}`}
                        rows="2"
                    />
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 text-gray-800 ${error ? 'border-red-400' : ''}`}
                    />
                )}
                {error && <p className="text-xs text-red-500 mt-1">⚠️ {error}</p>}
            </>
        ) : (
            <>
                <p className="font-semibold text-gray-800 text-lg break-words">{value || '-'}</p>
                {info && <p className="text-xs text-gray-400 mt-1">{info}</p>}
            </>
        )}
    </div>
);

export default UserProfileSecure;