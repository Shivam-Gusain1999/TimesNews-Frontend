import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { HiTrash, HiSearch, HiChatAlt2, HiExternalLink } from 'react-icons/hi';
import Loader from '../../components/Loader';
import { Link } from 'react-router-dom';

const ManageComments = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // --- DATA FETCHING ---
    const fetchComments = () => {
        setLoading(true);
        adminApi.getComments({ limit: 20, page })
            .then(({ data }) => {
                setComments(data.data.comments || []);
                setTotalPages(data.data.pagination.totalPages);
            })
            .catch(() => {
                toast.error('Failed to load comments');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchComments(); }, [page]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) return;
        try {
            await adminApi.deleteComment(id);
            toast.success('Comment deleted');
            fetchComments();
        } catch {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto animate-fade-in">

            {/* --- HEADER --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <HiChatAlt2 size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Comments</h1>
                        <p className="text-xs text-gray-500">Manage user discussions</p>
                    </div>
                </div>

                {/* (Search can be added later if backend supports it) */}
            </div>

            {/* --- TABLE SECTION --- */}
            {loading ? <div className="py-20 flex justify-center"><Loader type="spinner" /></div> : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full whitespace-nowrap min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">User</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Comment</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Article</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Date</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {comments.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-12 text-gray-400">No comments found.</td></tr>
                                ) : comments.map((c) => (
                                    <tr key={c._id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={c.owner?.avatar || `https://ui-avatars.com/api/?name=${c.owner?.fullName}&background=random`}
                                                    alt=""
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{c.owner?.fullName || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-500">@{c.owner?.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap max-w-md line-clamp-2" title={c.content}>
                                                {c.content}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {c.article ? (
                                                <Link to={`/article/${c.article.slug}`} target="_blank" className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline">
                                                    <span className="max-w-[150px] truncate">{c.article.title}</span>
                                                    <HiExternalLink size={14} />
                                                </Link>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Article Deleted</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono text-gray-600">
                                            {new Date(c.createdAt).toLocaleDateString()}
                                            <span className="text-xs text-gray-400 block">{new Date(c.createdAt).toLocaleTimeString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(c._id)}
                                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                title="Delete Comment"
                                            >
                                                <HiTrash size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageComments;
