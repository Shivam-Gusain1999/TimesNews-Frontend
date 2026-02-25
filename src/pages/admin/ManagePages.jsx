import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { pageApi } from '../../api/pageApi';
import Loader from '../../components/Loader';
import { HiPlus, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineDocumentText } from 'react-icons/hi';
import { format } from 'date-fns';

const ManagePages = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPages = async () => {
        try {
            setLoading(true);
            const res = await pageApi.getAllPagesAdmin(); // Using Admin list to get everything
            if (res.data) setPages(res.data);
        } catch (error) {
            toast.error('Failed to load pages');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete the page "${title}"?`)) return;

        try {
            await pageApi.deletePage(id);
            toast.success('Page deleted successfully');
            setPages(prev => prev.filter(page => page._id !== id));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete page');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-[var(--font-serif)] text-[var(--color-text-primary)]">Manage Pages</h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">Create and manage your dynamic website pages like About Us, Privacy Policy.</p>
                </div>
                <Link
                    to="/admin/pages/create"
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors font-medium text-sm"
                >
                    <HiPlus size={18} />
                    Create New Page
                </Link>
            </div>

            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
                <div className="p-4 border-b border-[var(--color-border)]">
                    <h3 className="font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                        <HiOutlineDocumentText className="text-primary" size={20} /> All Pages
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Loader />
                        </div>
                    ) : pages.length === 0 ? (
                        <div className="text-center py-10 text-[var(--color-text-secondary)]">
                            No pages found. Click "Create New Page" to add one.
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--color-surface-hover)] border-b border-[var(--color-border)]">
                                    <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Title</th>
                                    <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Slug</th>
                                    <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Created By</th>
                                    <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Date</th>
                                    <th className="p-4 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]">
                                {pages.map((page) => (
                                    <tr key={page._id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                                        <td className="p-4 font-medium text-[var(--color-text-primary)]">
                                            {page.title}
                                        </td>
                                        <td className="p-4 text-sm text-[var(--color-text-secondary)]">
                                            /{page.slug}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${page.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                {page.status === 'published' ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-[var(--color-text-secondary)]">
                                            {page.author?.fullName || 'Unknown'}
                                        </td>
                                        <td className="p-4 text-sm text-[var(--color-text-secondary)]">
                                            {format(new Date(page.createdAt), 'MMM d, yyyy')}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/admin/pages/edit/${page._id}`}
                                                    className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <HiOutlinePencilAlt size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(page._id, page.title)}
                                                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <HiOutlineTrash size={18} />
                                                </button>
                                            </div>
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

export default ManagePages;
