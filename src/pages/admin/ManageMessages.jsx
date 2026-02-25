import { useState, useEffect } from 'react';
import { messageApi } from '../../api/messageApi';
import toast from 'react-hot-toast';
import {
    HiOutlineMail,
    HiOutlineMailOpen,
    HiOutlineTrash,
    HiOutlineExclamationCircle
} from 'react-icons/hi';
import Loader from '../../components/Loader';

const ManageMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isReadFilter, setIsReadFilter] = useState(''); // '' for all, 'true' for read, 'false' for unread

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 15 };
            if (isReadFilter !== '') {
                params.isRead = isReadFilter;
            }
            const res = await messageApi.getAllMessages(params);
            setMessages(res.data.messages);
            setTotalPages(res.data.pages);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [page, isReadFilter]);

    const handleToggleRead = async (id, currentStatus) => {
        try {
            await messageApi.markAsRead(id);
            toast.success(`Message marked as ${!currentStatus ? 'read' : 'unread'}`);
            // Optimistic UI update
            setMessages(messages.map(msg =>
                msg._id === id ? { ...msg, isRead: !currentStatus } : msg
            ));
        } catch (error) {
            toast.error('Failed to update message status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        try {
            await messageApi.deleteMessage(id);
            toast.success('Message deleted successfully');
            setMessages(messages.filter(msg => msg._id !== id));
            // Refetch if the page is empty
            if (messages.length === 1 && page > 1) {
                setPage(page - 1);
            }
        } catch (error) {
            toast.error('Failed to delete message');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in relative min-h-[60vh]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-[var(--font-serif)] text-[var(--color-text-primary)]">Contact Messages</h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage user inquiries and feedback</p>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-primary transition-colors cursor-pointer"
                        value={isReadFilter}
                        onChange={(e) => {
                            setIsReadFilter(e.target.value);
                            setPage(1); // Reset page on filter change
                        }}
                    >
                        <option value="">All Messages</option>
                        <option value="false">Unread</option>
                        <option value="true">Read</option>
                    </select>
                </div>
            </div>

            <div className="bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="py-20 flex justify-center items-center"><Loader /></div>
                    ) : messages.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                                <HiOutlineExclamationCircle size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">No messages found</h3>
                            <p className="text-[var(--color-text-secondary)]">There are no contact messages to display.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/50">
                                    <th className="p-4 text-sm font-semibold text-[var(--color-text-secondary)] w-1/4">Sender Info</th>
                                    <th className="p-4 text-sm font-semibold text-[var(--color-text-secondary)] w-2/4">Message</th>
                                    <th className="p-4 text-sm font-semibold text-[var(--color-text-secondary)] w-1/4">Date & Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]">
                                {messages.map((msg) => (
                                    <tr
                                        key={msg._id}
                                        className={`hover:bg-[var(--color-surface-hover)] transition-colors ${!msg.isRead ? 'bg-primary/5' : ''}`}
                                    >
                                        <td className="p-4 align-top">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1">
                                                    {!msg.isRead ? (
                                                        <span className="w-2.5 h-2.5 bg-primary rounded-full inline-block" title="Unread"></span>
                                                    ) : (
                                                        <span className="w-2.5 h-2.5 bg-gray-300 rounded-full inline-block" title="Read"></span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className={`text-sm ${!msg.isRead ? 'font-bold' : 'font-medium'} text-[var(--color-text-primary)]`}>
                                                        {msg.name}
                                                    </p>
                                                    <p className="text-xs text-[var(--color-text-secondary)] hover:text-primary transition-colors cursor-pointer">
                                                        <a href={`mailto:${msg.email}`}>{msg.email}</a>
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4 align-top">
                                            <div className="max-w-md">
                                                {msg.subject && (
                                                    <p className={`text-sm mb-1 line-clamp-1 ${!msg.isRead ? 'font-semibold text-[var(--color-text-primary)]' : 'font-medium text-[var(--color-text-secondary)]'}`}>
                                                        {msg.subject}
                                                    </p>
                                                )}
                                                <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3">
                                                    {msg.message}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="p-4 align-top">
                                            <div className="flex flex-col gap-3">
                                                <span className="text-xs text-[var(--color-text-secondary)] font-medium">
                                                    {new Date(msg.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>

                                                <div className="flex items-center gap-2 mt-auto">
                                                    <button
                                                        onClick={() => handleToggleRead(msg._id, msg.isRead)}
                                                        className={`p-2 rounded-lg transition-colors border ${msg.isRead
                                                            ? 'border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                                            : 'border-primary/20 bg-primary/10 text-primary hover:bg-primary hover:text-white'
                                                            }`}
                                                        title={msg.isRead ? "Mark as unread" : "Mark as read"}
                                                    >
                                                        {msg.isRead ? <HiOutlineMail size={16} /> : <HiOutlineMailOpen size={16} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(msg._id)}
                                                        className="p-2 border border-red-200 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                                                        title="Delete message"
                                                    >
                                                        <HiOutlineTrash size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(page => Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 border border-[var(--color-border)] rounded text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-[var(--color-text-secondary)]">
                            Page <span className="font-semibold text-[var(--color-text-primary)]">{page}</span> of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(page => Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1 border border-[var(--color-border)] rounded text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageMessages;
