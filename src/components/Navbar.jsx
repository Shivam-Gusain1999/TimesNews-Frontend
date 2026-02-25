import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiMenu, HiX, HiSearch, HiMoon, HiSun, HiChevronDown } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { articleApi } from '../api/articleApi';
import { categoryApi } from '../api/categoryApi';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [categories, setCategories] = useState([]);
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    // Helper to check active path
    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const getCatSlug = (cat) => cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        categoryApi.getAll()
            .then(({ data }) => setCategories(data.data || []))
            .catch(() => { });
    }, []);

    // Debounced Search Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim().length > 1 && showSearch) {
                articleApi.getAll({ search: searchQuery, limit: 5 })
                    .then(({ data }) => {
                        setSuggestions(data.data.articles || []);
                    })
                    .catch(() => setSuggestions([]));
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, showSearch]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setShowSearch(false);
            setSuggestions([]);
        }
    };

    return (
        <header
            // MAROON CHANGE: bg-red-800 (Mehroon) instead of red-950
            className={`sticky top-0 z-50 transition-all duration-300 bg-red-800 text-white shadow-md border-b border-red-700`}
        >
            {/* Top Bar - Slate-900 (Dark Blue for contrast) */}
            <div className="bg-slate-900 text-white/90 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center text-xs">
                    <span className="opacity-80 font-medium text-blue-100">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <span className="opacity-80">Welcome, <span className="font-semibold text-white">{user?.fullName?.split(' ')[0]}</span></span>
                        ) : (
                            <div className="flex gap-3">
                                <Link to="/login" className="hover:text-white text-blue-200 transition-colors">Sign In</Link>
                                <Link to="/register" className="hover:text-white text-blue-200 transition-colors">Subscribe</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Nav - Background is inherited from Header (Red-800) */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 shrink-0 group">
                        {/* Logo Box White for Contrast */}
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg group-hover:bg-gray-100 transition-colors">
                            {/* Text Color changed to red-800 to match theme */}
                            <span className="text-red-800 font-bold text-xl font-[var(--font-serif)]">T</span>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-2xl font-bold font-[var(--font-serif)] text-white leading-none tracking-tight">
                                Times News
                            </h1>
                        </div>
                    </Link>

                    {/* Desktop Categories */}
                    <nav className="hidden lg:flex items-center gap-6">
                        <Link
                            to="/"
                            className={`text-base font-bold transition-colors border-b-2 py-1 
                            ${isActive('/')
                                    ? 'text-white border-white'
                                    : 'text-red-100 border-transparent hover:text-white hover:border-red-300'}`}
                        >
                            Home
                        </Link>
                        {categories.slice(0, 6).map((cat) => {
                            const slug = getCatSlug(cat);
                            return (
                                <Link
                                    key={cat._id}
                                    to={`/category/${slug}`}
                                    className={`text-base font-bold transition-colors border-b-2 py-1 
                                    ${isActive(`/category/${slug}`)
                                            ? 'text-white border-white'
                                            : 'text-red-100 border-transparent hover:text-white hover:border-red-300'}`}
                                >
                                    {cat.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Search Toggle */}
                        <button
                            onClick={() => { setShowSearch(!showSearch); if (!showSearch) setTimeout(() => document.getElementById('navbar-search')?.focus(), 100); }}
                            className="p-2.5 rounded-full hover:bg-red-900 text-red-100 hover:text-white transition-colors"
                        >
                            <HiSearch size={22} />
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-full hover:bg-red-900 text-red-100 hover:text-white transition-colors"
                        >
                            {isDark ? <HiSun size={22} /> : <HiMoon size={22} />}
                        </button>

                        {/* Profile Dropdown */}
                        {isAuthenticated && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-red-900 transition-colors border border-transparent hover:border-red-700"
                                >
                                    <img
                                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullName}&background=ffffff&color=991b1b`}
                                        alt={user?.fullName}
                                        className="w-9 h-9 rounded-full object-cover ring-2 ring-transparent group-hover:ring-white/20"
                                    />
                                    <HiChevronDown size={14} className="text-red-100" />
                                </button>

                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-2 animate-fade-in z-50 text-gray-800 dark:text-white">
                                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                                            <p className="font-bold text-sm">{user?.fullName}</p>
                                            <p className="text-xs text-gray-500 font-medium">@{user?.username}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link to="/profile" onClick={() => setShowProfileMenu(false)} className="block px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                                My Profile
                                            </Link>
                                            {isAdmin && (
                                                <Link to="/admin" onClick={() => setShowProfileMenu(false)} className="block px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                                    Admin Dashboard
                                                </Link>
                                            )}
                                        </div>
                                        <div className="border-t border-gray-200 dark:border-gray-700 py-1">
                                            <button
                                                onClick={() => { logout(); setShowProfileMenu(false); }}
                                                className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden p-2.5 rounded-lg hover:bg-red-900 text-red-100"
                        >
                            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Search Bar - Expandable (Updated BG to red-800) */}
                {showSearch && (
                    <div className="py-4 border-t border-red-700 animate-fade-in relative bg-red-800">
                        <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
                            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                id="navbar-search"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search articles..."
                                autoComplete="off"
                                className="w-full pl-11 pr-4 py-2.5 bg-white text-gray-900 border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all placeholder:text-gray-400"
                            />
                        </form>

                        {/* Live Search Suggestions */}
                        {suggestions.length > 0 && searchQuery && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-xl mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
                                <div className="max-h-[300px] overflow-y-auto">
                                    {suggestions.map(article => (
                                        <Link
                                            key={article._id}
                                            to={`/article/${article.slug}`}
                                            onClick={() => { setShowSearch(false); setSearchQuery(''); setSuggestions([]); }}
                                            className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b last:border-0 border-gray-100 dark:border-gray-700"
                                        >
                                            <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                                                {article.thumbnail ? (
                                                    <img src={article.thumbnail} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <HiSearch size={16} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 text-left">
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{article.title}</h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-800 font-medium">{article.category?.name}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    <Link
                                        to={`/search?q=${encodeURIComponent(searchQuery)}`}
                                        onClick={() => { setShowSearch(false); setSearchQuery(''); setSuggestions([]); }}
                                        className="block p-3 text-center text-sm text-red-800 font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        View all results for "{searchQuery}"
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile Menu (Updated BG to red-800) */}
            {isOpen && (
                <div className="lg:hidden border-t border-red-700 bg-red-800 animate-fade-in text-white">
                    <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
                        <Link to="/" onClick={() => setIsOpen(false)} className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive('/') ? 'bg-red-900 text-white' : 'text-red-100 hover:text-white hover:bg-red-900'}`}>
                            Home
                        </Link>
                        {categories.map((cat) => {
                            const slug = getCatSlug(cat);
                            return (
                                <Link
                                    key={cat._id}
                                    to={`/category/${slug}`}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-4 py-2.5 rounded-lg text-sm transition-colors ${isActive(`/category/${slug}`) ? 'bg-red-900 text-white' : 'text-red-100 hover:text-white hover:bg-red-900'}`}
                                >
                                    {cat.name}
                                </Link>
                            );
                        })}
                        {isAuthenticated && isAdmin && (
                            <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-red-900 transition-colors border-l-4 border-transparent hover:border-white">
                                Dashboard
                            </Link>
                        )}
                        {!isAuthenticated && (
                            <div className="pt-3 border-t border-red-700 space-y-1">
                                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium text-red-100 hover:text-white hover:bg-red-900 transition-colors">
                                    Sign In
                                </Link>
                                <Link to="/register" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm bg-white text-red-800 text-center font-bold hover:bg-gray-100 transition-colors">
                                    Subscribe
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;