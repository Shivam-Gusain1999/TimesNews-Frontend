import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiUser, HiMail, HiLockClosed, HiEye, HiEyeOff, HiPhotograph } from 'react-icons/hi';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '', username: '', email: '', password: '',
    });
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const avatarInputRef = useRef(null);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.fullName || !formData.username || !formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }
        // Avatar is optional now
        // if (!avatar) {
        //     toast.error('Please upload a profile photo');
        //     return;
        // }

        setLoading(true);
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, val]) => data.append(key, val));
            data.append('avatar', avatar);
            await register(data);
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full pl-11 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md animate-fade-in">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-2xl">T</span>
                    </div>
                    <h1 className="text-2xl font-bold font-[var(--font-serif)] text-[var(--color-text-primary)]">Create Account</h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Join TimesNews Pro community</p>
                </div>

                {/* Form */}
                <div className="bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 shadow-xl shadow-black/5">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Avatar Upload */}
                        <div className="flex justify-center mb-2">
                            <div className="text-center">
                                <label className={`w-20 h-20 rounded-full overflow-hidden border-2 border-dashed ${avatarPreview ? 'border-primary' : 'border-[var(--color-border)]'} flex items-center justify-center bg-[var(--color-surface)] hover:border-primary active:border-primary active:bg-primary/5 transition-colors mx-auto cursor-pointer`}>
                                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <HiPhotograph className="text-[var(--color-text-muted)]" size={28} />
                                    )}
                                </label>
                                <span className="block text-center text-[11px] text-[var(--color-text-muted)] mt-1.5">Tap to Upload Photo</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Full Name</label>
                            <div className="relative">
                                <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
                                <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="John Doe" className={inputClass} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Username</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-sm">@</span>
                                <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })} placeholder="johndoe" className="w-full pl-9 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Email</label>
                            <div className="relative">
                                <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
                                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" className={inputClass} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Password</label>
                            <div className="relative">
                                <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Create a strong password"
                                    className="w-full pl-11 pr-11 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]">
                                    {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-primary hover:bg-primary-dark active:bg-primary-dark text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2 min-h-[48px]"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating Account...
                                </span>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
