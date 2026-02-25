import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { settingApi } from '../../api/settingApi';
import Loader from '../../components/Loader';
import { HiOutlineColorSwatch, HiOutlineSave, HiOutlineMenuAlt2 } from 'react-icons/hi';

const predefinedColors = [
    { name: 'Rose (Default)', value: '#e94560' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Slate', value: '#475569' },
];

const ManageThemes = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Default theme settings
    const [theme, setTheme] = useState({
        primaryColor: '#e94560',
        defaultMode: 'light', // 'light' or 'dark'
        siteLogoUrl: '',
        faviconUrl: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await settingApi.getSettings('theme');
                if (res.data) {
                    setTheme(prev => ({ ...prev, ...res.data }));
                }
            } catch (error) {
                toast.error('Failed to load theme settings');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTheme(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const settingsArray = Object.keys(theme).map(key => ({
                key,
                value: theme[key],
                type: 'theme'
            }));

            await settingApi.updateSettings(settingsArray);
            toast.success('Theme settings saved! Refresh site to see changes.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save theme settings');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in relative">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
                    <HiOutlineColorSwatch size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold font-[var(--font-serif)] text-[var(--color-text-primary)]">Theme Customization</h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">Customize the primary visual identity of your news portal.</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">

                {/* Brand Colors Section */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 border-b border-[var(--color-border)] pb-2">Brand Colors</h3>

                    <div className="space-y-4">
                        <label className="text-sm font-medium text-[var(--color-text-primary)] block">Primary Accent Color</label>
                        <p className="text-xs text-[var(--color-text-secondary)] mb-3">This color runs throughout buttons, links, and highlights.</p>

                        <div className="flex flex-wrap gap-4 items-center">
                            {predefinedColors.map(color => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setTheme(prev => ({ ...prev, primaryColor: color.value }))}
                                    className={`w-10 h-10 rounded-full border-2 transition-all ${theme.primaryColor === color.value ? 'border-white ring-2 ring-primary scale-110 shadow-md' : 'border-transparent hover:scale-110'}`}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                />
                            ))}
                            <div className="flex items-center gap-2 ml-4">
                                <span className="text-sm text-[var(--color-text-secondary)]">Custom HEX:</span>
                                <input
                                    type="color"
                                    name="primaryColor"
                                    value={theme.primaryColor}
                                    onChange={handleChange}
                                    className="w-10 h-10 border-0 rounded cursor-pointer p-0"
                                />
                                <input
                                    type="text"
                                    name="primaryColor"
                                    value={theme.primaryColor}
                                    onChange={handleChange}
                                    className="w-24 px-2 py-1.5 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded text-sm text-[var(--color-text-primary)] uppercase focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Brand Logos (URL links) */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 border-b border-[var(--color-border)] pb-2 flex items-center gap-2">
                        Site Logos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-primary)]">Main Logo URL</label>
                            <input
                                type="url"
                                name="siteLogoUrl"
                                value={theme.siteLogoUrl || ''}
                                onChange={handleChange}
                                placeholder="https://example.com/logo.png"
                                className="w-full px-4 py-2.5 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:border-primary transition-colors"
                            />
                            <p className="text-xs text-[var(--color-text-secondary)]">Paste a Cloudinary or external image URL. Appears in navigation headers.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-primary)]">Favicon URL (Icon on Browser Tab)</label>
                            <input
                                type="url"
                                name="faviconUrl"
                                value={theme.faviconUrl || ''}
                                onChange={handleChange}
                                placeholder="https://example.com/favicon.png"
                                className="w-full px-4 py-2.5 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:border-primary transition-colors"
                            />
                            <p className="text-xs text-[var(--color-text-secondary)]">A squared image (.png or .ico) for browser tabs.</p>
                        </div>
                    </div>
                    {/* Live Preview Area */}
                    {(theme.siteLogoUrl || theme.primaryColor) && (
                        <div className="mt-8 p-4 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl flex items-center justify-between shadow-inner">
                            <div className="flex items-center gap-3">
                                {theme.siteLogoUrl ? (
                                    <img src={theme.siteLogoUrl} alt="Logo Preview" className="h-8 max-w-[150px] object-contain" />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.primaryColor }}>
                                            <span className="text-white font-bold text-sm">T</span>
                                        </div>
                                        <span className="font-bold text-lg text-[var(--color-text-primary)]">Times News</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-4 hidden md:flex">
                                <span className="text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer text-[var(--color-text-primary)]">Home</span>
                                <span className="text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer text-[var(--color-text-primary)]">News</span>
                                <button className="px-4 py-1.5 text-white text-sm font-medium rounded transition-opacity hover:opacity-90" style={{ backgroundColor: theme.primaryColor }}>
                                    Live Preview Button
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Appearance Section */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 border-b border-[var(--color-border)] pb-2">Appearance Settings</h3>
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-[var(--color-text-primary)] block">Default Theme Mode for New Visitors</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="defaultMode"
                                    value="light"
                                    checked={theme.defaultMode === 'light'}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                                />
                                <span className="text-sm text-[var(--color-text-primary)]">Light Mode</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="defaultMode"
                                    value="dark"
                                    checked={theme.defaultMode === 'dark'}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                                />
                                <span className="text-sm text-[var(--color-text-primary)]">Dark Mode</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Submit Action */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-colors disabled:opacity-70 shadow-sm"
                    >
                        {saving ? <Loader size="w-5 h-5" /> : <HiOutlineSave size={20} />}
                        {saving ? 'Saving...' : 'Save Theme & Colors'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default ManageThemes;
