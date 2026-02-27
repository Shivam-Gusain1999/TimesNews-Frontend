import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { articleApi } from '../../api/articleApi';
import { categoryApi } from '../../api/categoryApi';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiX, HiPhotograph, HiSearch, HiRefresh, HiUpload } from 'react-icons/hi';
import Loader from '../../components/Loader';

const ManageArticles = () => {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState('');
    const [searchParams] = useSearchParams();
    const statusFilter = searchParams.get('status');

    const [formData, setFormData] = useState({
        title: '', content: '', category: '', status: 'DRAFT', isFeatured: false,
    });
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    // --- DATA FETCHING ---
    const fetchArticles = () => {
        setLoading(true);
        // Use Admin API to see all statuses including Drafts/Archived
        articleApi.getAdminAll({ limit: 50, search, status: statusFilter })
            .then(({ data }) => setArticles(data.data.articles || []))
            .catch((err) => {
                console.error("Failed to fetch articles:", err);
                toast.error("Failed to load articles. Please restart the backend.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchArticles(); }, [search, statusFilter]);
    useEffect(() => {
        categoryApi.getAll()
            .then(({ data }) => setCategories(data.data || []))
            .catch(() => { });
    }, []);

    // --- FORM HANDLERS ---
    const resetForm = () => {
        setFormData({ title: '', content: '', category: '', status: 'DRAFT', isFeatured: false });
        setThumbnail(null);
        setThumbnailPreview(null);
        setEditingId(null);
        setShowForm(false);
    };

    const openEdit = (article) => {
        setEditingId(article._id);
        setFormData({
            title: article.title,
            content: article.content || '',
            category: article.category?._id || '',
            status: article.status || 'DRAFT',
            isFeatured: article.isFeatured || false,
        });
        setThumbnailPreview(article.thumbnail);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.content || !formData.category) {
            toast.error('Title, content and category are required');
            return;
        }
        setSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('content', formData.content);
            data.append('categoryId', formData.category);
            data.append('status', formData.status.toUpperCase());
            data.append('isFeatured', formData.isFeatured);
            if (thumbnail) data.append('thumbnail', thumbnail);

            if (editingId) {
                await articleApi.update(editingId, data);
                toast.success('Article updated successfully');
            } else {
                await articleApi.create(data);
                toast.success('Article created successfully');
            }
            resetForm();
            fetchArticles();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save article');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) return;
        try {
            await articleApi.delete(id);
            toast.success('Article moved to archive');
            fetchArticles();
        } catch {
            toast.error('Delete failed');
        }
    };

    const handleRestore = async (id) => {
        if (!window.confirm('Restore this article to Drafts?')) return;
        try {
            const data = new FormData();
            data.append('status', 'DRAFT');
            await articleApi.update(id, data);
            toast.success('Article restored successfully');
            fetchArticles();
        } catch {
            toast.error('Restore failed');
        }
    };

    const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all";

    return (
        <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto">

            {/* --- HEADER --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative flex-1 w-full sm:max-w-md">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by title..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    />
                </div>

                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-red-600/20 transition-all active:scale-95"
                >
                    <HiPlus size={18} />
                    <span>New Article</span>
                </button>
            </div>

            {/* --- MODAL (POPUP) --- */}
            {showForm && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
                    onClick={(e) => e.target === e.currentTarget && resetForm()}
                >
                    <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-3xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto overscroll-y-none animate-scale-up pb-safe">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
                            <h2 className="text-base sm:text-lg font-bold text-gray-800">{editingId ? 'Edit Article' : 'Create New Article'}</h2>
                            <button onClick={resetForm} className="p-2.5 rounded-full hover:bg-gray-100 active:bg-gray-200 text-gray-500 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                                <HiX size={22} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
                            {/* Title */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1">Title</label>
                                <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter article headline..." className={inputClass} />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1">Content</label>
                                <textarea required value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={6} placeholder="Write your article content here..." className={`${inputClass} resize-none leading-relaxed`} />
                            </div>

                            {/* Category & Status Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1">Category</label>
                                    <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className={inputClass}>
                                        <option value="">Select Category</option>
                                        {categories.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1">Publication Status</label>
                                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={inputClass}>
                                        <option value="DRAFT">Draft (Unpublished)</option>
                                        <option value="PUBLISHED">Published (Live)</option>
                                        <option value="ARCHIVED">Archived (Hidden)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Thumbnail Upload — Bulletproof native label wrap */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1">Article Thumbnail</label>
                                <label className="w-full flex flex-col items-center justify-center gap-2 h-44 sm:h-40 border-2 border-dashed border-gray-300 rounded-xl active:border-red-500 active:bg-red-50/20 hover:border-red-400 hover:bg-red-50/10 transition-colors overflow-hidden relative group cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        onChange={(e) => { const f = e.target.files[0]; if (f) { setThumbnail(f); setThumbnailPreview(URL.createObjectURL(f)); } }}
                                        className="hidden"
                                    />
                                    {thumbnailPreview ? (
                                        <>
                                            <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 sm:opacity-0 sm:group-hover:opacity-100 opacity-100 flex items-center justify-center transition-opacity">
                                                <span className="flex items-center gap-2 bg-white/90 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                                                    <HiUpload size={16} /> Change Image
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center text-gray-400 group-hover:text-red-500 active:text-red-600 transition-colors px-4">
                                            <HiPhotograph size={36} className="mx-auto mb-2" />
                                            <span className="text-sm font-medium">Tap to upload cover image</span>
                                            <span className="text-xs text-gray-400 block mt-1">JPG, PNG, WebP • Max 10MB</span>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* Featured Checkbox */}
                            <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100 active:bg-gray-100">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="w-6 h-6 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                                />
                                <label htmlFor="featured" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                                    Mark as Featured Story
                                </label>
                            </div>

                            {/* Actions — Stacked on mobile */}
                            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2 pb-4 sm:pb-2">
                                <button type="button" onClick={resetForm} className="w-full sm:w-auto px-6 py-3.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[48px] mb-2 sm:mb-0">
                                    Cancel
                                </button>
                                <button type="submit" disabled={submitting} className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed min-h-[48px]">
                                    {submitting ? 'Processing...' : editingId ? 'Update Article' : 'Publish Article'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- TABLE SECTION --- */}
            {loading ? <div className="py-20 flex justify-center"><Loader type="spinner" /></div> : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full whitespace-nowrap">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Article Details</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Category</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Views</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {articles.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-12 text-gray-400">No articles found.</td></tr>
                                ) : articles.map((a) => (
                                    <tr key={a._id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-4">
                                                <div className="relative shrink-0 w-16 h-12">
                                                    {a.thumbnail ? (
                                                        <img src={a.thumbnail} alt="" className="w-full h-full rounded-lg object-cover shadow-sm" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400"><HiPhotograph /></div>
                                                    )}
                                                </div>
                                                <div className="max-w-xs">
                                                    <p className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-red-600 transition-colors" title={a.title}>{a.title}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{new Date(a.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-bold uppercase rounded-md border border-gray-200">
                                                {a.category?.name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-md border
                                                ${a.status === 'PUBLISHED' ? 'bg-green-50 text-green-700 border-green-100' :
                                                    a.status === 'ARCHIVED' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                                                        'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                }`}>
                                                {a.status || 'DRAFT'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono text-gray-600">
                                            {a.views?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {statusFilter === 'ARCHIVED' ? (
                                                    <button
                                                        onClick={() => handleRestore(a._id)}
                                                        className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                                        title="Restore"
                                                    >
                                                        <HiRefresh size={16} />
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => openEdit(a)}
                                                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <HiPencil size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(a._id)}
                                                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <HiTrash size={16} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageArticles;