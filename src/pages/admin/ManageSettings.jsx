import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { settingApi } from '../../api/settingApi';
import Loader from '../../components/Loader';
import { HiOutlineSave, HiOutlineCog } from 'react-icons/hi';

const ManageSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Default structure for settings
    const [settings, setSettings] = useState({
        siteTitle: '',
        siteTagline: '',
        contactEmail: '',
        contactPhone: '',
        facebookUrl: '',
        twitterUrl: '',
        instagramUrl: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Fetch only 'general' or 'social' settings
                const res = await settingApi.getSettings();
                // Merge fetched settings into state
                if (res.data) {
                    setSettings(prev => ({ ...prev, ...res.data }));
                }
            } catch (error) {
                toast.error('Failed to load settings');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Convert standard object to array of setting objects for the backend
            const settingsArray = Object.keys(settings).map(key => {
                // Determine type based on key 
                let type = 'general';
                if (key.includes('Url')) type = 'social';

                return {
                    key,
                    value: settings[key],
                    type
                };
            });

            await settingApi.updateSettings(settingsArray);
            toast.success('Settings saved successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save settings');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in relative">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <HiOutlineCog size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold font-[var(--font-serif)] text-[var(--color-text-primary)]">General Settings</h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">Configure your website's basic information and social links.</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">

                {/* Site Information Section */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 border-b border-[var(--color-border)] pb-2">Site Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-primary)]">Site Title</label>
                            <input
                                type="text"
                                name="siteTitle"
                                value={settings.siteTitle || ''}
                                onChange={handleChange}
                                placeholder="E.g. Times News Pro"
                                className="w-full px-4 py-2.5 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-primary)]">Site Tagline</label>
                            <input
                                type="text"
                                name="siteTagline"
                                value={settings.siteTagline || ''}
                                onChange={handleChange}
                                placeholder="E.g. Your Daily Source of Truth"
                                className="w-full px-4 py-2.5 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Information Section */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 border-b border-[var(--color-border)] pb-2">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-primary)]">Public Contact Email</label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={settings.contactEmail || ''}
                                onChange={handleChange}
                                placeholder="contact@example.com"
                                className="w-full px-4 py-2.5 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-primary)]">Public Support Phone</label>
                            <input
                                type="text"
                                name="contactPhone"
                                value={settings.contactPhone || ''}
                                onChange={handleChange}
                                placeholder="+1 234 567 890"
                                className="w-full px-4 py-2.5 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Links Section */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 border-b border-[var(--color-border)] pb-2">Social Media Profiles</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-primary)]">Facebook Page URL</label>
                            <input
                                type="url"
                                name="facebookUrl"
                                value={settings.facebookUrl || ''}
                                onChange={handleChange}
                                placeholder="https://facebook.com/yourpage"
                                className="w-full px-4 py-2.5 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-primary)]">Twitter / X URL</label>
                            <input
                                type="url"
                                name="twitterUrl"
                                value={settings.twitterUrl || ''}
                                onChange={handleChange}
                                placeholder="https://twitter.com/yourhandle"
                                className="w-full px-4 py-2.5 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-primary)]">Instagram Profile URL</label>
                            <input
                                type="url"
                                name="instagramUrl"
                                value={settings.instagramUrl || ''}
                                onChange={handleChange}
                                placeholder="https://instagram.com/yourhandle"
                                className="w-full px-4 py-2.5 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] focus:outline-none focus:border-primary transition-colors"
                            />
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
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default ManageSettings;
