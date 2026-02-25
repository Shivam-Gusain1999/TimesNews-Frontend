import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { newsletterApi } from '../../api/newsletterApi';
import Loader from '../../components/Loader';
import { HiOutlineMail, HiOutlineClipboardCopy, HiOutlineTrash } from 'react-icons/hi';
import { format } from 'date-fns';

const ManageNewsletter = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSubscribers = async () => {
        try {
            setLoading(true);
            const res = await newsletterApi.getAllSubscribersAdmin();
            if (res.data) setSubscribers(res.data);
        } catch (error) {
            toast.error('Failed to load newsletter subscribers');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const handleDelete = async (id, email) => {
        if (!window.confirm(`Are you sure you want to completely remove ${email}?`)) return;

        try {
            await newsletterApi.deleteSubscriber(id);
            toast.success('Subscriber removed');
            setSubscribers(prev => prev.filter(sub => sub._id !== id));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to remove subscriber');
        }
    };

    const handleCopyAll = () => {
        const activeEmails = subscribers
            .filter(sub => sub.status === 'subscribed')
            .map(sub => sub.email)
            .join(', ');

        navigator.clipboard.writeText(activeEmails)
            .then(() => toast.success('Copied all active emails to clipboard!'))
            .catch(() => toast.error('Failed to copy.'));
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
                        <HiOutlineMail size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold font-[var(--font-serif)] text-[var(--color-text-primary)]">Newsletter Subscribers</h2>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage all users who opted in to receive updates.</p>
                    </div>
                </div>

                <button
                    onClick={handleCopyAll}
                    disabled={subscribers.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
                >
                    <HiOutlineClipboardCopy size={18} />
                    Copy Active Emails
                </button>
            </div>

            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center py-12"><Loader /></div>
                    ) : subscribers.length === 0 ? (
                        <div className="text-center py-12 text-[var(--color-text-secondary)]">
                            No subscribers yet! Embed the newsletter form on your site to start collecting emails.
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--color-surface-hover)] border-b border-[var(--color-border)]">
                                    <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Email Address</th>
                                    <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Date Subscribed</th>
                                    <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]">
                                {subscribers.map((sub) => (
                                    <tr key={sub._id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                                        <td className="p-4 font-medium text-[var(--color-text-primary)]">
                                            {sub.email}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${sub.status === 'subscribed' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                {sub.status === 'subscribed' ? 'Active' : 'Unsubscribed'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-[var(--color-text-secondary)]">
                                            {format(new Date(sub.subscribedAt), 'MMM d, yyyy - h:mm a')}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDelete(sub._id, sub.email)}
                                                className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                                title="Delete Permanently"
                                            >
                                                <HiOutlineTrash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageNewsletter;
