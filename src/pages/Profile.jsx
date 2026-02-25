import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';
import { HiCamera, HiPencil, HiLockClosed } from 'react-icons/hi';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [editForm, setEditForm] = useState({ fullName: user?.fullName || '', email: user?.email || '' });
    const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await authApi.updateAccount(editForm);
            updateUser(data.data);
            toast.success('Profile updated');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!passwordForm.oldPassword || !passwordForm.newPassword) {
            toast.error('Both fields required');
            return;
        }
        setLoading(true);
        try {
            await authApi.changePassword(passwordForm);
            toast.success('Password changed');
            setPasswordForm({ oldPassword: '', newPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Password change failed');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpdate = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('avatar', file);
        try {
            const { data } = await authApi.updateAvatar(formData);
            updateUser(data.data);
            toast.success('Avatar updated');
        } catch {
            toast.error('Avatar update failed');
        }
    };

    const handleCoverUpdate = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('coverImage', file);
        try {
            const { data } = await authApi.updateCoverImage(formData);
            updateUser(data.data);
            toast.success('Cover image updated');
        } catch {
            toast.error('Cover image update failed');
        }
    };

    const inputClass = "w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
            {/* Cover Image */}
            <div className="relative h-48 md:h-56 rounded-2xl overflow-hidden bg-gradient-to-r from-dark to-dark-tertiary">
                {user?.coverImage && (
                    <img src={user.coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                )}
                <label className="absolute bottom-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white cursor-pointer hover:bg-black/70 transition-colors">
                    <HiCamera size={18} />
                    <input type="file" accept="image/*" onChange={handleCoverUpdate} className="hidden" />
                </label>
            </div>

            {/* Avatar + Name */}
            <div className="flex items-end gap-4 -mt-12 ml-4 sm:ml-6">
                <div className="relative">
                    <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullName}&size=96&background=e94560&color=fff`}
                        alt={user?.fullName}
                        className="w-24 h-24 rounded-full object-cover border-4 border-[var(--color-surface)] shadow-lg"
                    />
                    <label className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full text-white cursor-pointer hover:bg-primary-dark transition-colors shadow-md">
                        <HiCamera size={14} />
                        <input type="file" accept="image/*" onChange={handleAvatarUpdate} className="hidden" />
                    </label>
                </div>
                <div className="mb-2">
                    <h1 className="text-xl font-bold text-[var(--color-text-primary)]">{user?.fullName}</h1>
                    <p className="text-sm text-[var(--color-text-muted)]">@{user?.username} · {user?.role}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-8 flex gap-1 border-b border-[var(--color-border)]">
                {[
                    { key: 'profile', label: 'Edit Profile', icon: HiPencil },
                    { key: 'password', label: 'Change Password', icon: HiLockClosed },
                ].map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === key
                            ? 'border-primary text-primary'
                            : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                            }`}
                    >
                        <Icon size={16} /> {label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'profile' && (
                    <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Full Name</label>
                            <input type="text" value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Email</label>
                            <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className={inputClass} />
                        </div>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-50">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                )}

                {activeTab === 'password' && (
                    <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Current Password</label>
                            <input type="password" value={passwordForm.oldPassword} onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">New Password</label>
                            <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className={inputClass} />
                        </div>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-50">
                            {loading ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;
