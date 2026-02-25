import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    // 1. AUTO REDIRECT
    useEffect(() => {
        if (user) {
            if (['admin', 'editor', 'reporter'].includes(user.role)) {
                navigate('/admin', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }
    }, [user, navigate]);

    // 2. FORM SUBMIT LOGIC
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            const userData = await login(formData);
            console.log("LOGIN SUCCESS:", userData);

            if (['admin', 'editor', 'reporter'].includes(userData.role)) {
                navigate('/admin', { replace: true });
            } else {
                const target = (from === '/login' || from === '/register') ? '/' : from;
                navigate(target, { replace: true });
            }

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
            <div className="w-full max-w-md animate-fade-in">
                {/* Header */}
                <div className="text-center mb-8">
                    {/* MAROON CHANGE: bg-red-800 and shadow */}
                    <div className="w-14 h-14 bg-red-800 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-800/20">
                        <span className="text-white font-bold text-2xl">T</span>
                    </div>
                    <h1 className="text-2xl font-bold font-serif text-gray-900">Welcome Back</h1>
                    <p className="text-sm text-gray-500 mt-1">Sign in to your Times News account</p>
                </div>

                {/* Form */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-xl shadow-gray-200/40">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                            <div className="relative">
                                <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="you@example.com"
                                    // MAROON CHANGE: focus ring and border darkened to red-700
                                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Enter your password"
                                    // MAROON CHANGE: focus ring and border darkened to red-700
                                    className="w-full pl-11 pr-11 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            // MAROON CHANGE: bg-red-800, hover:bg-red-900, shadow-red-800/20
                            className="w-full py-2.5 bg-red-800 hover:bg-red-900 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-800/20 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Signing In...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don't have an account?{' '}
                        {/* MAROON CHANGE: text-red-800 */}
                        <Link to="/register" className="text-red-800 font-semibold hover:underline">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;