import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { settingApi } from '../../api/settingApi';
import Loader from '../../components/Loader';
import { HiOutlineCurrencyDollar } from 'react-icons/hi';

const ManageAds = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [ads, setAds] = useState({
        adHeader: '',
        adSidebar: '',
        adArticleInline: ''
    });

    const fetchAds = async () => {
        try {
            setLoading(true);
            const res = await settingApi.getSettings('ads');
            if (res.data) {
                setAds(prev => ({
                    ...prev,
                    ...res.data
                }));
            }
        } catch (error) {
            toast.error('Failed to load ad settings');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAds();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAds(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Bulk update 
            const settingsArray = Object.entries(ads).map(([key, value]) => ({
                key,
                value,
                type: 'ads',
                isPublic: true
            }));

            await settingApi.updateSettings(settingsArray);
            toast.success('Ad spaces updated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update ads');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-600">
                        <HiOutlineCurrencyDollar size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold font-[var(--font-serif)] text-[var(--color-text-primary)]">Ad Spaces</h2>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage global banner ads and AdSense scripts.</p>
                    </div>
                </div>
            </div>

            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm p-6 lg:p-8">
                {loading ? (
                    <div className="flex justify-center py-12"><Loader /></div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-8">
                        <div>
                            <h3 className="font-semibold text-lg text-[var(--color-text-primary)] mb-1">Header Ad Banner</h3>
                            <p className="text-xs text-[var(--color-text-secondary)] mb-3">
                                Displayed at the top of the website, just below the navigation bar. Ideal for 728x90 banners. Paste raw HTML/JS script here.
                            </p>
                            <textarea
                                name="adHeader"
                                value={ads.adHeader}
                                onChange={handleChange}
                                placeholder="<!-- Paste your AdSense code or HTML banner here -->"
                                rows={4}
                                className="w-full px-4 py-3 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] font-mono text-sm focus:outline-none focus:border-primary"
                            />
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg text-[var(--color-text-primary)] mb-1">Sidebar Ad Widget</h3>
                            <p className="text-xs text-[var(--color-text-secondary)] mb-3">
                                Displayed in the right sidebar on homepage and articles. Ideal for 300x250 square banners.
                            </p>
                            <textarea
                                name="adSidebar"
                                value={ads.adSidebar}
                                onChange={handleChange}
                                placeholder="<!-- Paste your AdSense code or HTML banner here -->"
                                rows={4}
                                className="w-full px-4 py-3 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] font-mono text-sm focus:outline-none focus:border-primary"
                            />
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg text-[var(--color-text-primary)] mb-1">In-Article Ad Slot</h3>
                            <p className="text-xs text-[var(--color-text-secondary)] mb-3">
                                Appears inside the reading layout of every news article. Good for native or responsive ad units.
                            </p>
                            <textarea
                                name="adArticleInline"
                                value={ads.adArticleInline}
                                onChange={handleChange}
                                placeholder="<!-- Paste your AdSense code or HTML banner here -->"
                                rows={4}
                                className="w-full px-4 py-3 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] font-mono text-sm focus:outline-none focus:border-primary"
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors disabled:opacity-70 flex items-center justify-center min-w-[140px]"
                            >
                                {saving ? <Loader size="w-5 h-5" /> : 'Save Ad Settings'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ManageAds;
