import { useState, useEffect } from 'react';
import { categoryApi } from '../../api/categoryApi';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import Loader from '../../components/Loader';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', slug: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchCategories = () => {
        setLoading(true);
        categoryApi.getAll()
            .then(({ data }) => setCategories(data.data || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchCategories(); }, []);

    const resetForm = () => {
        setFormData({ name: '', slug: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const openEdit = (cat) => {
        setEditingId(cat._id);
        setFormData({ name: cat.name, slug: cat.slug || '' });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) { toast.error('Category name is required'); return; }
        setSubmitting(true);
        try {
            if (editingId) {
                await categoryApi.update(editingId, formData);
                toast.success('Category updated');
            } else {
                await categoryApi.create(formData);
                toast.success('Category created');
            }
            resetForm();
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            await categoryApi.delete(id);
            toast.success('Category deleted');
            fetchCategories();
        } catch { toast.error('Delete failed'); }
    };

    const inputClass = "w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-[var(--color-text-muted)]">{categories.length} categories</p>
                <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors">
                    <HiPlus size={18} /> Add Category
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-[var(--color-text-primary)]">{editingId ? 'Edit Category' : 'New Category'}</h3>
                        <button onClick={resetForm} className="p-1 rounded hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"><HiX size={18} /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                            placeholder="Category name"
                            className={`${inputClass} flex-1`}
                        />
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            placeholder="slug (auto-generated)"
                            className={`${inputClass} flex-1`}
                        />
                        <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl text-sm transition-colors whitespace-nowrap disabled:opacity-50">
                            {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
                        </button>
                    </form>
                </div>
            )}

            {/* Categories Table */}
            {loading ? <Loader type="spinner" /> : (
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Name</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Slug</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Created</th>
                                <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-12 text-[var(--color-text-muted)]">No categories yet</td></tr>
                            ) : categories.map((cat) => (
                                <tr key={cat._id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-hover)] transition-colors">
                                    <td className="px-5 py-3 text-sm font-medium text-[var(--color-text-primary)]">{cat.name}</td>
                                    <td className="px-5 py-3 text-sm text-[var(--color-text-muted)] font-mono">
                                        {cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || '-'}
                                    </td>
                                    <td className="px-5 py-3 text-sm text-[var(--color-text-muted)]">
                                        {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"><HiPencil size={16} /></button>
                                            <button onClick={() => handleDelete(cat._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><HiTrash size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageCategories;
