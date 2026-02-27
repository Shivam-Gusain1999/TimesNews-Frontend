import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    HiChartBar, HiDocumentText, HiTag, HiMenu, HiX, HiUsers,
    HiCollection, HiSun, HiMoon, HiChatAlt2, HiMail, HiCloudUpload,
    HiCog, HiOutlineColorSwatch, HiOutlineMenuAlt2, HiOutlineChartPie,
    HiOutlineCurrencyDollar, HiOutlineLogout, HiGlobeAlt, HiChevronDown, HiHome
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
    { path: '/admin', label: 'Dashboard', icon: HiChartBar },
    { path: '/admin/articles', label: 'Articles', icon: HiDocumentText },
    { path: '/admin/categories', label: 'Categories', icon: HiCollection },
    { path: '/admin/users', label: 'Users', icon: HiUsers },
    { path: '/admin/comments', label: 'Comments', icon: HiChatAlt2 },
    { path: '/admin/messages', label: 'Messages', icon: HiMail },
    { path: '/admin/newsletters', label: 'Subscribers', icon: HiDocumentText },
    { path: '/admin/polls', label: 'Polls', icon: HiOutlineChartPie },
    { path: '/admin/ads', label: 'Ad Spaces', icon: HiOutlineCurrencyDollar },
    { path: '/admin/bulk-upload', label: 'Bulk Upload', icon: HiCloudUpload },
    { path: '/admin/navigation', label: 'Navigation', icon: HiOutlineMenuAlt2 },
    { path: '/admin/themes', label: 'Themes', icon: HiOutlineColorSwatch },
    { path: '/admin/settings', label: 'Settings', icon: HiCog },
];

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[var(--color-surface-alt)] flex">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-full flex flex-col w-64 bg-[#222E3C] shadow-xl transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center px-4 shrink-0 bg-[#1A232E] border-b border-white/5">
                    <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center font-bold mr-3 shadow-sm">T</div>
                    <span className="text-white text-lg font-semibold tracking-wide">Times News Panel</span>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-gray-400 hover:text-white">
                        <HiX size={20} />
                    </button>
                </div>

                {/* Sidebar Profile Container */}
                <div className="p-5 flex items-center gap-4 border-b border-white/5 shrink-0">
                    <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullName}&size=48&background=e94560&color=fff`}
                        alt={user?.fullName}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10"
                    />
                    <div>
                        <p className="text-white font-medium text-sm leading-tight mb-1">{user?.fullName}</p>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e] animate-pulse"></span>
                            <span className="text-[11px] text-gray-300 uppercase tracking-wide">Online</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 min-h-0 overflow-y-auto px-4 pr-2 py-5 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pb-10">
                    {/* Back to Home — visible on mobile */}
                    <Link
                        to="/"
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded text-[13px] font-medium text-green-400 hover:text-white hover:bg-green-600/20 transition-all mb-3 border border-green-500/20"
                    >
                        <HiHome size={18} />
                        Back to Website
                    </Link>

                    <div className="px-2 mb-3 mt-1 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        Main Navigation
                    </div>

                    {navItems.map(({ path, label, icon: Icon }) => {
                        const isActive = location.pathname === path;
                        return (
                            <Link
                                key={path}
                                to={path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded text-[13px] font-medium transition-all ${isActive
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Overlay for mobile */}
            {
                sidebarOpen && (
                    <div className="fixed inset-0 z-30 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)} />
                )
            }

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
                {/* Top Header */}
                <header className="sticky top-0 z-20 bg-white dark:bg-[var(--color-surface)] shadow-sm px-4 md:px-6 h-16 flex items-center justify-between transition-colors">
                    <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 mr-2 transition-colors">
                            <HiMenu size={24} />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link to="/" className="flex items-center gap-1.5 px-3 py-2 bg-[#00A65A] hover:bg-[#008d4c] active:bg-[#007a3d] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors min-h-[40px]">
                            <HiGlobeAlt size={16} />
                            <span className="hidden sm:inline">View Site</span>
                            <span className="sm:hidden">Home</span>
                        </Link>

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                            title="Toggle Theme"
                        >
                            {isDark ? <HiSun size={20} className="text-yellow-500" /> : <HiMoon size={20} />}
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setProfileDropdown(!profileDropdown)}
                                className="flex items-center gap-2.5 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors pl-2 pr-3 border border-transparent dark:border-gray-700"
                            >
                                <img
                                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullName}&size=32&background=e94560&color=fff`}
                                    alt={user?.fullName}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <span className="hidden sm:block text-sm font-medium text-[var(--color-text-primary)]">
                                    {user?.fullName}
                                </span>
                                <HiChevronDown size={14} className="text-[var(--color-text-secondary)] hidden sm:block" />
                            </button>

                            {profileDropdown && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setProfileDropdown(false)}></div>
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[var(--color-surface)] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-20 animate-fade-in origin-top-right">
                                        <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 text-center">
                                            <img
                                                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullName}&size=64&background=e94560&color=fff`}
                                                alt={user?.fullName}
                                                className="w-16 h-16 rounded-full object-cover mx-auto mb-2 ring-4 ring-white dark:ring-gray-800 shadow-sm"
                                            />
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.fullName}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user?.email}</p>
                                        </div>
                                        <div className="p-2">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium border border-transparent hover:border-red-100 dark:hover:border-red-900"
                                            >
                                                <HiOutlineLogout size={16} />
                                                Log Out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 md:p-6 lg:p-8 flex-1">
                    <Outlet />
                </main>
            </div>
        </div >
    );
};

export default AdminLayout;
