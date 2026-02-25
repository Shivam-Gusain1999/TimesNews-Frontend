import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { settingApi } from '../../api/settingApi';
import Loader from '../../components/Loader';
import { HiOutlineMenu, HiOutlineSave, HiPlus, HiX, HiChevronUp, HiChevronDown } from 'react-icons/hi';

const ManageNavigation = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // We expect the backend to store a JSON array of links for 'headerMenu'
    const [navItems, setNavItems] = useState([
        { id: Date.now().toString(), label: 'Home', url: '/' },
        { id: (Date.now() + 1).toString(), label: 'News', url: '/category/news' },
        { id: (Date.now() + 2).toString(), label: 'Contact', url: '/contact' }
    ]);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await settingApi.getSettings('navigation');
                // The API returns an object like { headerMenu: [{label, url}, ...] }
                if (res.data && res.data.headerMenu) {
                    // Make sure they have IDs for React iteration/drag
                    const linkedItems = typeof res.data.headerMenu === 'string'
                        ? JSON.parse(res.data.headerMenu)
                        : res.data.headerMenu;

                    const itemsWithId = linkedItems.map(item => ({
                        ...item,
                        id: item.id || Math.random().toString(36).substring(7)
                    }));
                    setNavItems(itemsWithId);
                }
            } catch (error) {
                toast.error('Failed to load navigation settings');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleAddItem = () => {
        setNavItems([
            ...navItems,
            { id: Date.now().toString(), label: 'New Link', url: '/' }
        ]);
    };

    const handleRemoveItem = (id) => {
        setNavItems(navItems.filter(item => item.id !== id));
    };

    const handleChange = (id, field, value) => {
        setNavItems(navItems.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleMoveUp = (index) => {
        if (index === 0) return;
        const newItems = [...navItems];
        const temp = newItems[index];
        newItems[index] = newItems[index - 1];
        newItems[index - 1] = temp;
        setNavItems(newItems);
    };

    const handleMoveDown = (index) => {
        if (index === navItems.length - 1) return;
        const newItems = [...navItems];
        const temp = newItems[index];
        newItems[index] = newItems[index + 1];
        newItems[index + 1] = temp;
        setNavItems(newItems);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Strip out the random IDs generated for the UI before saving to DB
            const cleanData = navItems.map(({ label, url }) => ({ label, url }));

            const settingsArray = [{
                key: 'headerMenu',
                value: cleanData, // Will be stored as JSON array in Mongoose Mixed type
                type: 'navigation'
            }];

            await settingApi.updateSettings(settingsArray);
            toast.success('Navigation menu saved successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save navigation');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in relative">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                    <HiOutlineMenu size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold font-[var(--font-serif)] text-[var(--color-text-primary)]">Header Navigation</h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage the links that appear at the top of your website.</p>
                </div>
            </div>

            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-surface-hover)] flex justify-between items-center">
                    <h3 className="font-semibold text-[var(--color-text-primary)]">Menu Items</h3>
                    <button
                        onClick={handleAddItem}
                        className="flex items-center gap-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors font-medium"
                    >
                        <HiPlus size={16} /> Add Link
                    </button>
                </div>

                <div className="p-4 space-y-3">
                    {navItems.length === 0 ? (
                        <div className="text-center py-8 text-[var(--color-text-secondary)]">
                            No menu items found. Click "Add Link" to create one.
                        </div>
                    ) : (
                        navItems.map((item, index) => (
                            <div key={item.id} className="flex gap-3 items-center bg-[var(--color-surface-alt)] p-3 rounded-xl border border-[var(--color-border)] group transition-all hover:border-[var(--color-border-hover)] relative">
                                {/* Order Controls */}
                                <div className="flex flex-col text-[var(--color-text-secondary)] opacity-50 group-hover:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        onClick={() => handleMoveUp(index)}
                                        disabled={index === 0}
                                        className="hover:text-primary disabled:opacity-30 disabled:hover:text-[var(--color-text-secondary)] cursor-pointer"
                                    >
                                        <HiChevronUp size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleMoveDown(index)}
                                        disabled={index === navItems.length - 1}
                                        className="hover:text-primary disabled:opacity-30 disabled:hover:text-[var(--color-text-secondary)] cursor-pointer"
                                    >
                                        <HiChevronDown size={20} />
                                    </button>
                                </div>

                                {/* Label Input */}
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={item.label}
                                        onChange={(e) => handleChange(item.id, 'label', e.target.value)}
                                        placeholder="Link Text (e.g. Home)"
                                        className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>

                                {/* URL Input */}
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={item.url}
                                        onChange={(e) => handleChange(item.id, 'url', e.target.value)}
                                        placeholder="URL or Path (e.g. /category/news)"
                                        className="w-full px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-primary transition-colors font-mono"
                                    />
                                </div>

                                {/* Delete Button */}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="p-2 text-red-400 hover:text-white hover:bg-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    title="Remove Link"
                                >
                                    <HiX size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-colors disabled:opacity-70 shadow-sm"
                >
                    {saving ? <Loader size="w-5 h-5" /> : <HiOutlineSave size={20} />}
                    {saving ? 'Saving...' : 'Save Navigation'}
                </button>
            </div>

        </div>
    );
};

export default ManageNavigation;
